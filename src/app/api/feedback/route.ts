import { NextResponse } from "next/server";
import { FieldValue } from "firebase-admin/firestore";
import { getFirebaseDb } from "@/lib/firebase/admin";

export async function POST(request: Request) {
  let payload: unknown;
  try {
    payload = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  if (!payload || typeof payload !== "object" || Array.isArray(payload)) {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  const body = payload as Record<string, unknown>;
  const kind = body.kind === "enquiry" ? "enquiry" : "feedback";
  const name = String(body.customer_name || "").trim();
  const phone = String(body.phone || "").trim();
  const message = String(body.message || "").trim();
  const rating = Number(body.rating || 0);
  const category = String(body.category || "General").trim();

  if (!name || name.length > 100 || !phone || phone.length > 20 || !message || message.length > 2000) {
    return NextResponse.json({ error: "Please check the required fields and try again." }, { status: 400 });
  }
  if (kind === "feedback" && (!Number.isInteger(rating) || rating < 1 || rating > 5)) {
    return NextResponse.json({ error: "Please select a valid rating." }, { status: 400 });
  }

  const collection = kind === "feedback" ? "feedback" : "enquiries";
  const row = kind === "feedback"
    ? { customer_name: name, phone, rating, message, status: "new" }
    : { customer_name: name, phone, category, message, status: "new" };

  try {
    await getFirebaseDb().collection(collection).add({
      ...row,
      created_at: FieldValue.serverTimestamp(),
    });
    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("Firebase submission error:", error);
    return NextResponse.json({ error: "Submission is temporarily unavailable. Please contact us on WhatsApp." }, { status: 503 });
  }
}

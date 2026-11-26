import { NextResponse } from "next/server";
import { FieldValue } from "firebase-admin/firestore";
import { getFirebaseDb } from "@/lib/firebase/admin";

const validCategories = [
  "Product Quality",
  "Staff Behaviour",
  "Pricing",
  "Product Variety",
  "Overall Experience",
];

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
  const registrationId = String(body.registration_id || "").trim();
  const rating = Number(body.rating || 0);
  const categories = Array.isArray(body.categories) ? body.categories : [];
  const message = String(body.message || "").trim();

  if (!registrationId || registrationId.length > 128) {
    return NextResponse.json(
      { error: "Invalid submission reference." },
      { status: 400 },
    );
  }

  if (!Number.isInteger(rating) || rating < 1 || rating > 5) {
    return NextResponse.json(
      { error: "Please 1-5 star rating select karein." },
      { status: 400 },
    );
  }

  const validatedCategories = categories
    .map((c: unknown) => String(c).trim())
    .filter((c: string) => validCategories.includes(c));

  if (message.length > 2000) {
    return NextResponse.json(
      { error: "Feedback message too long (max 2000 characters)." },
      { status: 400 },
    );
  }

  try {
    const db = getFirebaseDb();

    // Verify registration exists
    const regDoc = await db
      .collection("customer_registrations")
      .doc(registrationId)
      .get();
    if (!regDoc.exists) {
      return NextResponse.json(
        { error: "Registration not found." },
        { status: 404 },
      );
    }

    // Check for duplicate feedback for this registration
    const dupeFeedback = await db
      .collection("welcome_feedback")
      .where("registration_id", "==", registrationId)
      .limit(1)
      .get();

    if (!dupeFeedback.empty) {
      return NextResponse.json({ ok: true, duplicate: true });
    }

    const docRef = await db.collection("welcome_feedback").add({
      registration_id: registrationId,
      rating,
      categories: validatedCategories,
      message: message || null,
      created_at: FieldValue.serverTimestamp(),
    });

    // Update the registration with the feedback reference
    await db
      .collection("customer_registrations")
      .doc(registrationId)
      .update({ feedback_id: docRef.id });

    return NextResponse.json({ ok: true, id: docRef.id });
  } catch (error) {
    console.error("Welcome feedback error:", error);
    return NextResponse.json(
      {
        error:
          "Feedback submit nahi ho pa rahi. Please dobara try karein.",
      },
      { status: 503 },
    );
  }
}

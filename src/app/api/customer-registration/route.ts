import { NextResponse } from "next/server";
import { FieldValue } from "firebase-admin/firestore";
import { getFirebaseDb } from "@/lib/firebase/admin";

const customerTypes = ["first_time", "regular", "mistri", "contractor"];

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
  const name = String(body.name || "").trim();
  const phone = String(body.phone || "").trim();
  const customerType = String(body.customer_type || "");
  const whatsappConsent = body.whatsapp_consent === true;
  const source = String(body.source || "qr_welcome");

  // Validate name
  // if (!name || name.length < 2 || name.length > 100) {
  //   return NextResponse.json(
  //     { error: "Please apna naam sahi se enter karein (2-100 characters)." },
  //     { status: 400 },
  //   );
  // }

  // Validate Indian mobile: strip non-digits, must be 10 digits starting with 6-9
  const digits = phone.replace(/\D/g, "");
  const mobile =
    digits.length === 12 && digits.startsWith("91") ? digits.slice(2) : digits;
  if (!phone || mobile.length !== 10 || !/^[6-9]\d{9}$/.test(mobile)) {
    return NextResponse.json(
      { error: "Please valid 10-digit Indian mobile number enter karein." },
      { status: 400 },
    );
  }

  if (!customerTypes.includes(customerType)) {
    return NextResponse.json(
      { error: "Please customer type select karein." },
      { status: 400 },
    );
  }

  try {
    const db = getFirebaseDb();

    // Remove duplicate check for now, as it was causing issues with multiple submissions in a short time frame. We can reintroduce it later if needed.

    // Duplicate check: same phone in last 30 minutes
    // const thirtyMinAgo = new Date(Date.now() - 30 * 60 * 1000);
    // const dupe = await db
    //   .collection("customer_registrations")
    //   .where("phone", "==", mobile)
    //   .limit(20)
    //   .get();

    // const existing = dupe.docs.find((doc) => {
    //   const createdAt = doc.get("created_at");
    //   const createdAtDate =
    //     createdAt?.toDate?.() ?? (createdAt instanceof Date ? createdAt : null);
    //   return createdAtDate && createdAtDate >= thirtyMinAgo;
    // });

    // if (existing) {
    //   return NextResponse.json({ ok: true, id: existing.id, duplicate: true });
    // }

    const docRef = await db.collection("customer_registrations").add({
      name,
      phone: mobile,
      customer_type: customerType,
      whatsapp_consent: whatsappConsent,
      consent_timestamp: whatsappConsent ? FieldValue.serverTimestamp() : null,
      source,
      created_at: FieldValue.serverTimestamp(),
    });

    return NextResponse.json({ ok: true, id: docRef.id });
  } catch (error) {
    console.error("Firebase customer registration error:", error);
    return NextResponse.json(
      {
        error:
          "Abhi details submit nahi ho pa rahi hain. Thodi der baad try karein.",
      },
      { status: 503 },
    );
  }
}

import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { createClient } from "@supabase/supabase-js";
import { cert, getApps, initializeApp } from "firebase-admin/app";
import { FieldValue, Timestamp, getFirestore } from "firebase-admin/firestore";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
let serviceAccountJson = process.env.FIREBASE_SERVICE_ACCOUNT_JSON?.trim();

if (!serviceAccountJson) {
  const localFile = join(process.cwd(), "serviceaccount.json");
  if (existsSync(localFile)) {
    serviceAccountJson = readFileSync(localFile, "utf8");
  }
}

if (!supabaseUrl || !supabaseServiceRoleKey || !serviceAccountJson) {
  throw new Error(
    "Set NEXT_PUBLIC_SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, and FIREBASE_SERVICE_ACCOUNT_JSON (or provide serviceaccount.json) before migration.",
  );
}

let serviceAccount;
try {
  let jsonStr = serviceAccountJson;
  if (
    (jsonStr.startsWith("'") && jsonStr.endsWith("'")) ||
    (jsonStr.startsWith('"') && jsonStr.endsWith('"'))
  ) {
    jsonStr = jsonStr.slice(1, -1).trim();
  }
  serviceAccount = JSON.parse(jsonStr);
} catch {
  throw new Error("FIREBASE_SERVICE_ACCOUNT_JSON must contain valid JSON.");
}

if (
  typeof serviceAccount.project_id !== "string" ||
  typeof serviceAccount.client_email !== "string" ||
  typeof serviceAccount.private_key !== "string"
) {
  throw new Error("FIREBASE_SERVICE_ACCOUNT_JSON is missing required service-account fields.");
}

const app =
  getApps()[0] ??
  initializeApp({
    credential: cert({
      projectId: serviceAccount.project_id,
      clientEmail: serviceAccount.client_email,
      privateKey: serviceAccount.private_key.replace(/\\n/g, "\n"),
    }),
  });
const firestore = getFirestore(app);
const supabase = createClient(supabaseUrl, supabaseServiceRoleKey, {
  auth: { persistSession: false, autoRefreshToken: false },
});
const pageSize = 400;

function convertRow(row) {
  const converted = { ...row };
  for (const field of ["created_at", "updated_at"]) {
    if (typeof converted[field] === "string") {
      const date = new Date(converted[field]);
      if (!Number.isNaN(date.getTime())) converted[field] = Timestamp.fromDate(date);
    }
  }
  return converted;
}

async function migrateCollection(tableName) {
  let offset = 0;
  let migrated = 0;
  while (true) {
    const { data, error } = await supabase
      .from(tableName)
      .select("*")
      .order("id", { ascending: true })
      .range(offset, offset + pageSize - 1);
    if (error) throw new Error(`Could not read Supabase ${tableName}: ${error.message}`);
    const rows = data ?? [];
    if (rows.length === 0) break;

    const batch = firestore.batch();
    for (const row of rows) {
      if (typeof row.id !== "string" || row.id.length === 0) {
        throw new Error(`Found a ${tableName} record without an id.`);
      }
      batch.set(
        firestore.collection(tableName).doc(row.id),
        convertRow(row),
        { merge: true },
      );
    }
    await batch.commit();
    migrated += rows.length;
    offset += rows.length;
    if (rows.length < pageSize) break;
  }

  console.log(`${tableName}: migrated ${migrated} records`);
}

async function migrateStaffRoles() {
  let offset = 0;
  let migrated = 0;
  let skipped = 0;

  while (true) {
    const { data, error } = await supabase
      .from("profiles")
      .select("id, full_name, role")
      .order("id", { ascending: true })
      .range(offset, offset + pageSize - 1);
    if (error) throw new Error(`Could not read Supabase profiles: ${error.message}`);
    const profiles = data ?? [];
    if (profiles.length === 0) break;

    for (const profile of profiles) {
      if (!["admin", "staff"].includes(profile.role)) {
        skipped += 1;
        continue;
      }
      const { data: result, error: userError } = await supabase.auth.admin.getUserById(profile.id);
      if (userError || !result.user.email) {
        console.warn(`Skipped staff role for Supabase user ${profile.id}: no email was available.`);
        skipped += 1;
        continue;
      }

      const email = result.user.email.toLowerCase();
      await firestore.collection("staffRoles").doc(email).set(
        {
          email,
          full_name: profile.full_name ?? "",
          role: profile.role,
          supabase_user_id: profile.id,
          migrated_at: FieldValue.serverTimestamp(),
        },
        { merge: true },
      );
      migrated += 1;
    }

    offset += profiles.length;
    if (profiles.length < pageSize) break;
  }

  console.log(`staffRoles: migrated ${migrated} records; skipped ${skipped}`);
}

for (const collection of [
  "feedback",
  "enquiries",
  "customer_registrations",
  "testimonials",
  "business_settings",
]) {
  await migrateCollection(collection);
}
await migrateStaffRoles();
console.log("Migration complete. Source Supabase records were not modified.");

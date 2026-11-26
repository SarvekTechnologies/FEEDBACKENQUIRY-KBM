import "server-only";

import { readFileSync } from "node:fs";
import { join } from "node:path";
import { cert, getApps, initializeApp } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";
import { getFirestore } from "firebase-admin/firestore";

function getAdminApp() {
  const existingApp = getApps()[0];
  if (existingApp) return existingApp;

  const serviceAccountJson = process.env.FIREBASE_SERVICE_ACCOUNT_JSON?.trim();
  const configuredPath = process.env.GOOGLE_APPLICATION_CREDENTIALS?.trim();
  if (serviceAccountJson && configuredPath) {
    throw new Error(
      "Set only one of FIREBASE_SERVICE_ACCOUNT_JSON or GOOGLE_APPLICATION_CREDENTIALS.",
    );
  }

  const defaultCredentialsPath = join(process.cwd(), "serviceaccount.json");
  let rawCredentials: string;
  if (serviceAccountJson) {
    rawCredentials = serviceAccountJson;
  } else {
    const credentialsPath = configuredPath || defaultCredentialsPath;
    try {
      rawCredentials = readFileSync(credentialsPath, "utf8");
    } catch (error) {
      throw new Error(
        "Firebase service-account file could not be read. Place it at the project root as serviceaccount.json, or set GOOGLE_APPLICATION_CREDENTIALS to its absolute path.",
        { cause: error },
      );
    }
  }

  let serviceAccount: unknown;
  try {
    serviceAccount = JSON.parse(rawCredentials);
  } catch (error) {
    throw new Error(
      "Firebase service-account file is not valid JSON. Use the original downloaded service-account JSON file.",
      { cause: error },
    );
  }

  if (
    !serviceAccount ||
    typeof serviceAccount !== "object" ||
    !("project_id" in serviceAccount) ||
    typeof serviceAccount.project_id !== "string" ||
    !("client_email" in serviceAccount) ||
    typeof serviceAccount.client_email !== "string" ||
    !("private_key" in serviceAccount) ||
    typeof serviceAccount.private_key !== "string"
  ) {
    throw new Error(
      "Firebase service-account JSON is missing project_id, client_email, or private_key.",
    );
  }

  return initializeApp({
    credential: cert({
      projectId: serviceAccount.project_id,
      clientEmail: serviceAccount.client_email,
      privateKey: serviceAccount.private_key.replace(/\\n/g, "\n"),
    }),
  });
}

export function getFirebaseAuth() {
  return getAuth(getAdminApp());
}

export function getFirebaseDb() {
  return getFirestore(getAdminApp());
}

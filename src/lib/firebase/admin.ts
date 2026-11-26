import "server-only";

import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { cert, getApps, initializeApp } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";
import { getFirestore } from "firebase-admin/firestore";

interface ServiceAccountCredentials {
  project_id: string;
  client_email: string;
  private_key: string;
  [key: string]: unknown;
}

function parseCredentials(input: string): ServiceAccountCredentials | null {
  let trimmed = input.trim();
  if (!trimmed) return null;

  // Unwrap surrounding single or double quotes
  if (
    (trimmed.startsWith("'") && trimmed.endsWith("'")) ||
    (trimmed.startsWith('"') && trimmed.endsWith('"'))
  ) {
    trimmed = trimmed.slice(1, -1).trim();
  }

  // Handle base64 encoded JSON
  if (!trimmed.startsWith("{") && /^[A-Za-z0-9+/=]+$/.test(trimmed)) {
    try {
      const decoded = Buffer.from(trimmed, "base64").toString("utf8").trim();
      if (decoded.startsWith("{")) {
        trimmed = decoded;
      }
    } catch {
      // ignore
    }
  }

  // Handle file path if input points to a JSON file
  if (trimmed.endsWith(".json") || trimmed.startsWith("./") || trimmed.startsWith("/")) {
    try {
      if (existsSync(trimmed)) {
        trimmed = readFileSync(trimmed, "utf8");
      }
    } catch {
      // ignore
    }
  }

  try {
    const parsed = JSON.parse(trimmed);
    if (
      parsed &&
      typeof parsed === "object" &&
      typeof parsed.project_id === "string" &&
      typeof parsed.client_email === "string" &&
      typeof parsed.private_key === "string"
    ) {
      return parsed as ServiceAccountCredentials;
    }
  } catch {
    return null;
  }

  return null;
}

function getAdminApp() {
  const existingApp = getApps()[0];
  if (existingApp) return existingApp;

  let serviceAccount: ServiceAccountCredentials | null = null;

  // 1. Try FIREBASE_SERVICE_ACCOUNT_JSON environment variable
  const serviceAccountJson = process.env.FIREBASE_SERVICE_ACCOUNT_JSON?.trim();
  if (serviceAccountJson && serviceAccountJson !== "{") {
    serviceAccount = parseCredentials(serviceAccountJson);
  }

  // 2. Try file path candidates (GOOGLE_APPLICATION_CREDENTIALS or default locations)
  if (!serviceAccount) {
    const candidatePaths = [
      process.env.GOOGLE_APPLICATION_CREDENTIALS?.trim(),
      join(process.cwd(), "serviceaccount.json"),
      join(process.cwd(), "FEEDBACKENQUIRY-KBM", "serviceaccount.json"),
      join(__dirname, "..", "..", "..", "serviceaccount.json"),
    ].filter(Boolean) as string[];

    for (const filePath of candidatePaths) {
      try {
        if (existsSync(filePath)) {
          const content = readFileSync(filePath, "utf8");
          const parsed = parseCredentials(content);
          if (parsed) {
            serviceAccount = parsed;
            break;
          }
        }
      } catch {
        // try next candidate
      }
    }
  }

  if (!serviceAccount) {
    throw new Error(
      "Firebase service-account credentials could not be loaded. Place serviceaccount.json in the project root or configure FIREBASE_SERVICE_ACCOUNT_JSON / GOOGLE_APPLICATION_CREDENTIALS.",
    );
  }

  const privateKey = serviceAccount.private_key.replace(/\\n/g, "\n");

  return initializeApp({
    credential: cert({
      projectId: serviceAccount.project_id,
      clientEmail: serviceAccount.client_email,
      privateKey,
    }),
  });
}

export function getFirebaseAuth() {
  return getAuth(getAdminApp());
}

export function getFirebaseDb() {
  return getFirestore(getAdminApp());
}

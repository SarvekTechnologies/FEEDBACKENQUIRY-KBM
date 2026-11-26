"use client";

import { getFirebaseClientAuth } from "@/lib/firebase/client";
import { signOut } from "firebase/auth";
import { useState } from "react";

export default function StaffLogoutButton() {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  async function logout() {
    setBusy(true);
    setError("");
    try {
      const response = await fetch("/api/staff/session", { method: "DELETE" });
      if (!response.ok) throw new Error("Could not end the staff session.");
      await signOut(getFirebaseClientAuth());
      window.location.href = "/staff/login";
    } catch (error) {
      console.error("Staff logout failed:", error);
      setError(error instanceof Error ? error.message : "Could not sign out.");
      setBusy(false);
    }
  }

  return (
    <div className="flex items-center gap-3">
      {error && <span role="alert" className="text-sm text-red-600">{error}</span>}
      <button className="btn-outline text-sm" disabled={busy} onClick={logout}>
        {busy ? "Signing out..." : "Sign out"}
      </button>
    </div>
  );
}

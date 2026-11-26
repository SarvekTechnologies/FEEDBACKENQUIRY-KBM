//Make Name optional

"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { FaCheck, FaWhatsapp, FaUser, FaPhone } from "react-icons/fa";

const customerTypes = [
  { value: "first_time", label: "First-time Customer", emoji: "👋" },
  { value: "regular", label: "Regular Customer", emoji: "⭐" },
  { value: "mistri", label: "Mistri", emoji: "🔨" },
  { value: "contractor", label: "Thekedar", emoji: "🏗️" },
];

function validateIndianMobile(raw: string): string | null {
  const digits = raw.replace(/\D/g, "");
  const mobile =
    digits.length === 12 && digits.startsWith("91") ? digits.slice(2) : digits;
  if (mobile.length !== 10 || !/^[6-9]\d{9}$/.test(mobile)) return null;
  return mobile;
}

export default function WelcomeRegistrationForm() {
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [selectedType, setSelectedType] = useState("");
  const [consent, setConsent] = useState(false);
  const [phoneError, setPhoneError] = useState("");

  function handlePhoneBlur(e: React.FocusEvent<HTMLInputElement>) {
    const val = e.currentTarget.value.trim();
    if (val && !validateIndianMobile(val)) {
      setPhoneError("Kripya sahi 10-digit Indian mobile number enter karein.");
    } else {
      setPhoneError("");
    }
  }

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    const form = new FormData(event.currentTarget);
    const name = String(form.get("name") || "").trim();
    const rawPhone = String(form.get("phone") || "").trim();
    const mobile = validateIndianMobile(rawPhone);

    // if (!name || name.length < 2) {
    //   setError("Please apna poora naam enter karein.");
    //   return;
    // }
    if (!mobile) {
      setError("Please sahi 10-digit Indian mobile number enter karein.");
      return;
    }
    if (!selectedType) {
      setError("Please select karein ki aap kis type ke customer hain.");
      return;
    }

    setBusy(true);
    try {
      const res = await fetch("/api/customer-registration", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          phone: mobile,
          customer_type: selectedType,
          whatsapp_consent: consent,
          source: "QR Welcome Page",
        }),
      });
      const result = await res.json();
      if (!res.ok)
        throw new Error(
          result.error ||
            "Details submit nahi ho saki. Please dobara try karein.",
        );

      // Redirect to /welcome/feedback as specified in requirement
      const params = new URLSearchParams({
        id: result.id || "",
        name: encodeURIComponent(name),
      });
      router.push(`/welcome/feedback?${params.toString()}`);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Details submit nahi ho saki. Please dobara try karein.",
      );
      setBusy(false);
    }
  }

  return (
    <form onSubmit={submit} className="grid gap-5" noValidate>
      {/* 1. Customer Name */}
      <div className="grid gap-1.5">
        <label
          className="text-sm font-bold text-gray-800 flex items-center gap-1.5"
          htmlFor="customer-name"
        >
          <FaUser className="text-orange-500 text-xs" aria-hidden="true" />
          Customer Name <span className="text-grey-50">(optional)</span>
        </label>
        <input
          id="customer-name"
          className="field text-base py-3"
          name="name"
          type="text"
          autoComplete="name"
          required
          minLength={2}
          maxLength={40}
          placeholder="Apna poora naam enter karein"
        />
      </div>

      {/* 2. Mobile Number */}
      <div className="grid gap-1.5">
        <label
          className="text-sm font-bold text-gray-800 flex items-center gap-1.5"
          htmlFor="customer-phone"
        >
          <FaPhone className="text-orange-500 text-xs" aria-hidden="true" />
          Mobile Number <span className="text-red-500">*</span>
        </label>
        <div className="flex gap-2">
          <span className="field flex w-4 items-center justify-center bg-gray-100 font-bold text-gray-700 select-none text-sm max-w-16">
            +91
          </span>
          <input
            id="customer-phone"
            className="field flex-1 text-base py-3 font-medium min-w-44"
            name="phone"
            type="tel"
            inputMode="numeric"
            autoComplete="tel-national"
            required
            placeholder="Apna 10-digit mobile number enter karein"
            onBlur={handlePhoneBlur}
          />
        </div>
        {phoneError && (
          <p className="text-xs text-red-600 font-medium" role="alert">
            {phoneError}
          </p>
        )}
      </div>

      {/* 3. Customer Type */}
      <fieldset className="grid gap-2">
        <legend className="text-sm font-bold text-gray-800 mb-1">
          Aap kis type ke customer hain? <span className="text-red-500">*</span>
        </legend>
        <div className="grid grid-cols-2 gap-2.5">
          {customerTypes.map(({ value, label, emoji }) => {
            const selected = selectedType === value;
            return (
              <label key={value} className="cursor-pointer select-none">
                <input
                  className="sr-only"
                  type="radio"
                  name="customer_type"
                  value={value}
                  required
                  checked={selected}
                  onChange={() => setSelectedType(value)}
                />
                <div
                  className={`flex items-center gap-2.5 p-3 rounded-xl border transition-all ${
                    selected
                      ? "border-orange-500 bg-orange-50/80 text-orange-950 font-bold shadow-xs"
                      : "border-gray-200 bg-white text-gray-700 hover:border-orange-200 font-medium"
                  }`}
                >
                  <span className="text-lg">{emoji}</span>
                  <span className="text-xs sm:text-sm leading-tight flex-1">
                    {label}
                  </span>
                  {selected && (
                    <span className="size-4 shrink-0 rounded-full bg-orange-500 text-white flex items-center justify-center text-[9px]">
                      <FaCheck aria-hidden="true" />
                    </span>
                  )}
                </div>
              </label>
            );
          })}
        </div>
      </fieldset>

      {/* 4. Optional Consent */}
      <label className="flex cursor-pointer items-start gap-3 rounded-xl border border-gray-200 bg-gray-50/80 p-3.5 hover:border-orange-300 transition-colors">
        <div className="relative mt-0.5">
          <input
            type="checkbox"
            className="sr-only"
            checked={consent}
            onChange={(e) => setConsent(e.target.checked)}
          />
          <span
            className={`flex size-5 items-center justify-center rounded-md border-2 transition-colors ${
              consent
                ? "border-orange-500 bg-orange-500 text-white"
                : "border-gray-300 bg-white"
            }`}
          >
            {consent && <FaCheck className="text-[10px]" aria-hidden="true" />}
          </span>
        </div>
        <span className="text-xs text-gray-600 leading-snug select-none">
          <FaWhatsapp
            className="inline mr-1 text-green-600 text-sm align-middle"
            aria-hidden="true"
          />
          Main Krishna Building Material se business-related updates aur
          WhatsApp messages receive karne ke liye sahmat hoon.
          <span className="block mt-0.5 text-gray-400 font-normal">
            (Optional)
          </span>
        </span>
      </label>

      {/* Error alert */}
      {error && (
        <div
          role="alert"
          className="rounded-xl bg-red-50 border border-red-200 p-3 text-xs sm:text-sm text-red-700 font-medium"
        >
          {error}
        </div>
      )}

      {/* Submit Button */}
      <button
        type="submit"
        disabled={busy}
        className="btn-primary w-full justify-center py-3.5 text-base font-bold shadow-md hover:shadow-lg transition-all disabled:opacity-60"
      >
        {busy ? (
          <span className="flex items-center gap-2">
            <span
              className="size-4 rounded-full border-2 border-white border-t-transparent animate-spin"
              aria-hidden="true"
            />
            Please wait...
          </span>
        ) : (
          "Chaliye, Shuru Karte Hain"
        )}
      </button>

      <p className="text-center text-xs text-gray-500 leading-relaxed">
        Aapki details surakshit rakhi jayengi aur sirf business communication ke
        liye use hongi.
      </p>
    </form>
  );
}

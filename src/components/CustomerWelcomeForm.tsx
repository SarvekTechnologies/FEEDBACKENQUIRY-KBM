"use client";

import { FormEvent, useState } from "react";
import { FaCheck } from "react-icons/fa";

const customerTypes = [
  { value: "first_time", label: "First-time customer" },
  { value: "regular", label: "Regular customer" },
  { value: "mistri", label: "Mistri" },
  { value: "contractor", label: "Thekedar" },
];

export default function CustomerWelcomeForm() {
  const [status, setStatus] = useState("");
  const [busy, setBusy] = useState(false);
  const [selectedCustomerType, setSelectedCustomerType] = useState("");

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setBusy(true);
    setStatus("");
    const formElement = event.currentTarget;
    const form = new FormData(formElement);

    try {
      const response = await fetch("/api/customer-registration", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          phone: String(form.get("phone") || ""),
          customer_type: String(form.get("customer_type") || ""),
        }),
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || "Details submit nahi ho saki. Please dobara try karein.");
      setStatus("Dhanyavaad! Aapki details successfully submit ho gayi hain.");
      formElement.reset();
      setSelectedCustomerType("");
    } catch (error) {
      setStatus(error instanceof Error ? error.message : "Please dobara try karein.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <form onSubmit={submit} className="grid gap-5">
      <label className="grid gap-2 text-sm font-semibold">
        Mobile number
        <input className="field" name="phone" type="tel" inputMode="tel" autoComplete="tel" required maxLength={20} placeholder="Apna mobile number enter karein" />
      </label>
      <fieldset className="grid gap-3">
        <legend className="text-sm font-semibold">Aap kis type ke customer hain?</legend>
        <div className="grid gap-2 sm:grid-cols-2">
          {customerTypes.map(({ value, label }) => {
            const selected = selectedCustomerType === value;
            return (
              <label key={value} className="cursor-pointer">
                <input
                  className="peer sr-only"
                  type="radio"
                  name="customer_type"
                  value={value}
                  required
                  checked={selected}
                  onChange={() => setSelectedCustomerType(value)}
                />
                <span className={`flex min-h-12 items-center gap-3 rounded-xl border px-4 py-3 text-sm font-semibold transition-colors peer-focus-visible:ring-2 peer-focus-visible:ring-orange-500 ${selected ? "border-orange-500 bg-orange-50 text-orange-800" : "border-gray-200 hover:border-orange-300"}`}>
                  <span className={`flex size-5 items-center justify-center rounded border ${selected ? "border-orange-500 bg-orange-500 text-white" : "border-gray-400 bg-white"}`}>
                    {selected && <FaCheck aria-hidden="true" className="text-xs" />}
                  </span>
                  {label}
                </span>
              </label>
            );
          })}
        </div>
      </fieldset>
      <button disabled={busy} className="btn-primary w-fit disabled:opacity-50">
        {busy ? "Submitting..." : "Submit"}
      </button>
      {status && <p role="status" className="text-sm">{status}</p>}
    </form>
  );
}

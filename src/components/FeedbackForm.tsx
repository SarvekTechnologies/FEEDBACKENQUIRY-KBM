"use client";
import { FormEvent, useState } from "react";

export default function FeedbackForm() {
  const [kind, setKind] = useState("feedback");
  const [status, setStatus] = useState("");
  const [busy, setBusy] = useState(false);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setBusy(true); setStatus("");
    const form = new FormData(event.currentTarget);
    const payload = {
      kind,
      customer_name: String(form.get("name") || ""),
      phone: String(form.get("phone") || ""),
      rating: Number(form.get("rating") || 0),
      category: String(form.get("category") || "General"),
      message: String(form.get("message") || ""),
    };
    try {
      const response = await fetch("/api/feedback", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || "Submission failed.");
      setStatus("Thank you. Your message has been submitted.");
      event.currentTarget.reset();
    } catch (error) {
      setStatus(error instanceof Error ? error.message : "Could not submit. Please try again.");
    } finally { setBusy(false); }
  }

  return <form onSubmit={submit} className="grid gap-5">
    <div><h2 className="text-xl font-bold">Send us a message</h2><p className="muted mt-1 text-sm">Fields marked required must be completed.</p></div>
    <div className="flex gap-3"><button type="button" onClick={()=>setKind("feedback")} className={`rounded-full px-5 py-2 text-sm font-semibold ${kind==="feedback"?"bg-orange-500 text-white":"bg-gray-100"}`}>Feedback</button><button type="button" onClick={()=>setKind("enquiry")} className={`rounded-full px-5 py-2 text-sm font-semibold ${kind==="enquiry"?"bg-orange-500 text-white":"bg-gray-100"}`}>Enquiry</button></div>
    <label className="grid gap-2 text-sm font-semibold">Your name<input className="field" name="name" required maxLength={100} placeholder="Enter your name"/></label>
    <label className="grid gap-2 text-sm font-semibold">Phone number<input className="field" name="phone" required inputMode="tel" maxLength={20} placeholder="Enter your phone number"/></label>
    {kind==="feedback" ? <label className="grid gap-2 text-sm font-semibold">Your rating<select className="field" name="rating" defaultValue="5"><option value="5">5 – Excellent</option><option value="4">4 – Good</option><option value="3">3 – Average</option><option value="2">2 – Poor</option><option value="1">1 – Very poor</option></select></label> : <label className="grid gap-2 text-sm font-semibold">Enquiry category<select className="field" name="category"><option>Product availability</option><option>Pricing</option><option>Bulk order</option><option>Other</option></select></label>}
    <label className="grid gap-2 text-sm font-semibold">Message<textarea className="field min-h-32" name="message" required maxLength={2000} placeholder="Write your message..."/></label>
    <button disabled={busy} className="btn-primary w-fit disabled:opacity-50">{busy?"Submitting...":"Submit "+(kind==="feedback"?"Feedback":"Enquiry")}</button>
    {status && <p role="status" className="text-sm">{status}</p>}
  </form>;
}

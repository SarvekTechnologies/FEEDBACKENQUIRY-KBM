"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import {
  FaStar,
  FaCheck,
  FaWhatsapp,
  FaGoogle,
  FaFacebook,
  FaGlobe,
  FaMapMarkerAlt,
  FaArrowRight,
} from "react-icons/fa";
import { business, whatsappLink, whatsappWelcomeLink } from "@/config/business";

const feedbackCategories = [
  "Product Quality",
  "Staff Behaviour",
  "Pricing",
  "Product Variety",
  "Overall Experience",
];

export default function WelcomeFeedbackSection() {
  const searchParams = useSearchParams();
  const registrationId = searchParams.get("id") || "";
  const rawName = searchParams.get("name") || "";

  let customerName = "Ji";
  try {
    customerName = decodeURIComponent(rawName).trim() || "Ji";
  } catch {
    customerName = rawName.trim() || "Ji";
  }

  // Form states
  const [rating, setRating] = useState<number>(5);
  const [hoverRating, setHoverRating] = useState<number>(0);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([
    "Overall Experience",
  ]);
  const [message, setMessage] = useState("");
  const [busy, setBusy] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");

  const toggleCategory = (cat: string) => {
    setSelectedCategories((prev) =>
      prev.includes(cat) ? prev.filter((c) => c !== cat) : [...prev, cat],
    );
  };

  const handleFeedbackSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!registrationId) {
      setError("Registration ID missing. Please register from welcome page.");
      return;
    }
    if (rating < 1 || rating > 5) {
      setError("Please 1 se 5 star rating select karein.");
      return;
    }

    setBusy(true);
    setError("");

    try {
      const res = await fetch("/api/welcome/feedback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          registration_id: registrationId,
          rating,
          categories: selectedCategories,
          message,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Feedback submit nahi ho saki.");
      }
      setSubmitted(true);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Feedback submit nahi ho saki. Please try again.",
      );
    } finally {
      setBusy(false);
    }
  };

  // Recovery state if no registrationId
  if (!registrationId) {
    return (
      <div className="max-w-xl mx-auto py-8 sm:py-12 px-4">
        <div className="bg-white border border-stone-200 rounded-2xl p-8 sm:p-10 text-center shadow-xs">
          <div className="size-14 rounded-2xl bg-stone-100 text-stone-700 flex items-center justify-center mx-auto text-xl mb-5">
            <FaMapMarkerAlt />
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-stone-900 tracking-tight">
            Namaste! Krishna Building Material mein swagat hai.
          </h2>
          <p className="mt-3 text-stone-600 leading-relaxed text-sm sm:text-base">
            Lagta hai aap yahan direct aaye hain. Agar aapne showroom par visit
            kiya hai, toh kripya pehle welcome page par apni details share
            karein taaki hum aapka swagat kar sakein.
          </p>
          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link
              href="/welcome"
              className="w-full sm:w-auto min-h-[48px] px-6 py-3 rounded-xl bg-[#EA580C] hover:bg-[#c2410c] text-white text-sm font-semibold inline-flex items-center justify-center gap-2 shadow-xs transition-colors"
            >
              <span>Welcome Page par Jayein</span>
              <FaArrowRight className="text-xs" />
            </Link>
            <Link
              href="/"
              className="w-full sm:w-auto min-h-[48px] px-6 py-3 rounded-xl border border-stone-200 bg-white hover:bg-stone-50 text-stone-700 hover:text-stone-900 text-sm font-semibold inline-flex items-center justify-center gap-2 shadow-xs transition-colors"
            >
              <span>Website Explore Karein</span>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* 1. Full-width Personalized Welcome Card */}
      <section className="bg-white border border-stone-200 rounded-2xl p-6 sm:p-8 shadow-xs">
        <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
          <div className="inline-flex items-center gap-2 rounded-full bg-emerald-50 border border-emerald-200/80 px-3 py-1 text-xs font-semibold text-emerald-800">
            <FaCheck className="text-[10px] text-emerald-600" />
            Details successfully received
          </div>
          <span className="text-xs font-mono text-stone-400">
            Ref: <span className="text-stone-700 font-semibold">{registrationId}</span>
          </span>
        </div>
        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-stone-900 tracking-tight">
          Dhanyavaad, {customerName}!
        </h1>
        <p className="mt-2 text-sm sm:text-base text-stone-600 leading-relaxed max-w-2xl">
          Krishna Building Material par aane ke liye aapka bahut-bahut dhanyavaad.
          Aapka experience humare liye bahut important hai. Humein batayein ki
          humari service kaisi rahi.
        </p>
      </section>

      {/* 2-Column Responsive Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-[1.15fr_0.85fr] gap-6 items-start">
        {/* Left Column (1.15fr): Primary 30-second Feedback Form */}
        <section className="bg-white border border-stone-200 rounded-2xl p-6 sm:p-8 shadow-xs">
          <div className="mb-6">
            <h2 className="text-xl sm:text-2xl font-bold text-stone-900 tracking-tight">
              Aapka experience kaisa raha?
            </h2>
            <p className="mt-1 text-xs sm:text-sm text-stone-500">
              Apna feedback share karein — isme sirf 30 seconds lagenge.
            </p>
          </div>

          {submitted ? (
            <div className="rounded-2xl bg-stone-50 border border-stone-200 p-6 sm:p-8 text-center space-y-4">
              <div className="size-12 rounded-full bg-emerald-600 text-white flex items-center justify-center mx-auto text-lg shadow-xs">
                <FaCheck />
              </div>
              <div className="space-y-1.5">
                <h3 className="text-xl font-bold text-stone-900">
                  Aapka Feedback Successfully Save Ho Gaya!
                </h3>
                <p className="text-sm text-stone-600 max-w-md mx-auto leading-relaxed">
                  Aapke kimti sujhav ke liye Krishna Building Material parivar ki
                  taraf se dher saara dhanyavaad.
                </p>
              </div>

              {rating >= 4 ? (
                <div className="pt-4 border-t border-stone-200/80 mt-4 space-y-3">
                  <p className="text-xs text-stone-500 max-w-sm mx-auto">
                    Aapka anubhav accha raha! Kripya Google par bhi 1 minute nikaal
                    kar apna review share karein:
                  </p>
                  <div>
                    <a
                      href={business.googleReviewUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="w-full sm:w-auto min-h-[48px] px-7 py-3 rounded-xl bg-[#EA580C] hover:bg-[#c2410c] text-white text-sm font-semibold inline-flex items-center justify-center gap-2 shadow-xs hover:shadow transition-all cursor-pointer"
                    >
                      <FaGoogle className="text-xs" />
                      <span>Google par bhi Review Dein</span>
                      <FaArrowRight className="text-xs" />
                    </a>
                  </div>
                </div>
              ) : (
                <div className="pt-4 border-t border-stone-200/80 mt-4 space-y-3">
                  <p className="text-xs text-stone-500 max-w-sm mx-auto">
                    Humein dukh hai ki aapka anubhav poori tarah santushtijanak nahi
                    raha. Kripya humari team se seedhe connect karein taaki hum ise
                    theek kar sakein:
                  </p>
                  <div>
                    <a
                      href={whatsappLink(
                        `Namaste Krishna Building Material team, maine feedback submit kiya tha (${rating}/5). Mai aapse baat karna chahta hoon.`
                      )}
                      target="_blank"
                      rel="noreferrer"
                      className="w-full sm:w-auto min-h-[48px] px-7 py-3 rounded-xl bg-[#0F4C3A] hover:bg-[#0c3c2e] text-white text-sm font-semibold inline-flex items-center justify-center gap-2 shadow-xs hover:shadow transition-all cursor-pointer"
                    >
                      <FaWhatsapp className="text-base" />
                      <span>Team se WhatsApp par Baat Karein</span>
                    </a>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <form onSubmit={handleFeedbackSubmit} className="space-y-6">
              {/* Star Rating */}
              <div className="space-y-2">
                <label className="text-sm font-semibold text-stone-800">
                  Rating dein (1 se 5 stars) <span className="text-red-500">*</span>
                </label>
                <div className="p-2 sm:p-2.5 bg-stone-50 border border-stone-200/80 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div
                    className="flex items-center gap-1"
                    role="radiogroup"
                    aria-label="Star rating"
                  >
                    {[1, 2, 3, 4, 5].map((star) => {
                      const filled = (hoverRating || rating) >= star;
                      return (
                        <button
                          key={star}
                          type="button"
                          role="radio"
                          aria-checked={rating === star}
                          aria-label={`${star} star${star > 1 ? "s" : ""}`}
                          className="size-12 rounded-xl flex items-center justify-center transition-all hover:scale-105 hover:bg-stone-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#EA580C]/40 cursor-pointer"
                          onMouseEnter={() => setHoverRating(star)}
                          onMouseLeave={() => setHoverRating(0)}
                          onClick={() => setRating(star)}
                        >
                          <FaStar
                            className={`text-2xl transition-colors ${
                              filled ? "text-amber-400" : "text-stone-300"
                            }`}
                          />
                        </button>
                      );
                    })}
                  </div>
                  <div className="text-xs sm:text-sm font-semibold text-stone-700 px-3 py-1.5 bg-white sm:bg-transparent rounded-xl border border-stone-200/80 sm:border-0 text-center sm:text-right">
                    {rating === 5 && "Shandar · 5/5"}
                    {rating === 4 && "Bahut Accha · 4/5"}
                    {rating === 3 && "Theek Thaak · 3/5"}
                    {rating === 2 && "Sudhar Chahiye · 2/5"}
                    {rating === 1 && "Santusht Nahi · 1/5"}
                  </div>
                </div>
              </div>

              {/* Category Chips */}
              <div className="space-y-2">
                <label className="text-sm font-semibold text-stone-800">
                  Feedback category select karein:
                </label>
                <div className="grid grid-cols-2 sm:flex sm:flex-wrap gap-2.5">
                  {feedbackCategories.map((cat) => {
                    const active = selectedCategories.includes(cat);
                    return (
                      <button
                        key={cat}
                        type="button"
                        onClick={() => toggleCategory(cat)}
                        className={`min-h-[44px] px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-medium transition-all flex items-center justify-center sm:justify-start gap-2 border text-center cursor-pointer ${
                          active
                            ? "bg-stone-900 text-white border-stone-900 shadow-xs"
                            : "bg-white text-stone-700 border-stone-200 hover:border-stone-300 hover:bg-stone-50"
                        }`}
                      >
                        {active && <FaCheck className="text-[11px] shrink-0" />}
                        <span>{cat}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Written Message + Character Counter */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label
                    htmlFor="feedback-message"
                    className="text-sm font-semibold text-stone-800"
                  >
                    Optional written feedback:
                  </label>
                  <span className="text-xs font-mono text-stone-400">
                    {message.length} / 2000
                  </span>
                </div>
                <textarea
                  id="feedback-message"
                  className="w-full min-h-[110px] rounded-xl border border-stone-200 bg-stone-50/40 p-3.5 text-sm text-stone-900 placeholder:text-stone-400 focus:border-[#EA580C] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#EA580C]/20 transition-all resize-y"
                  maxLength={2000}
                  placeholder="Apna experience humare saath share karein..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                />
              </div>

              {error && (
                <div
                  role="alert"
                  className="rounded-xl bg-red-50 border border-red-200 p-3.5 text-sm text-red-700 font-medium"
                >
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={busy}
                className="w-full sm:w-auto min-h-[48px] px-8 py-3 rounded-xl bg-[#EA580C] hover:bg-[#c2410c] text-white text-sm font-semibold shadow-xs hover:shadow transition-all disabled:opacity-50 disabled:cursor-not-allowed inline-flex items-center justify-center gap-2 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#EA580C]/40"
              >
                {busy ? "Submit ho raha hai..." : "Feedback Submit Karein"}
              </button>
            </form>
          )}
        </section>

        {/* Right Column (0.85fr): Secondary Action Stack */}
        <div className="space-y-6">
          {/* 1. WhatsApp Welcome Card */}
          <section className="bg-[#0F4C3A] text-white rounded-2xl p-6 border border-[#0F4C3A] shadow-xs">
            <div className="inline-flex items-center gap-2 text-xs font-medium text-emerald-200 mb-2">
              <FaWhatsapp className="text-base text-emerald-300" />
              <span>Official Business WhatsApp</span>
            </div>
            <h3 className="text-lg sm:text-xl font-bold tracking-tight">
              WhatsApp par Welcome Message Dekhein
            </h3>
            <p className="mt-1.5 text-xs sm:text-sm text-emerald-100/80 leading-relaxed">
              Showroom details, catalogue aur kisi bhi sahayata ke liye seedhe
              WhatsApp par connect karein.
            </p>
            <a
              href={whatsappWelcomeLink(customerName)}
              target="_blank"
              rel="noreferrer"
              className="mt-5 w-full min-h-[44px] inline-flex items-center justify-center gap-2 rounded-xl bg-white text-[#0F4C3A] hover:bg-emerald-50 px-5 py-2.5 text-sm font-semibold shadow-xs transition-colors"
            >
              <FaWhatsapp className="text-base text-[#0F4C3A]" />
              <span>WhatsApp par Dekhein</span>
            </a>
          </section>

          {/* 2. Unified Google & Facebook Review List with hairline divider */}
          <section className="bg-white border border-stone-200 rounded-2xl shadow-xs divide-y divide-stone-100 overflow-hidden">
            {/* Google Review Item */}
            <div className="p-6">
              <div className="flex items-start gap-3.5">
                <span className="size-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center text-lg shrink-0 mt-0.5">
                  <FaGoogle />
                </span>
                <div className="flex-1 min-w-0">
                  <h3 className="font-bold text-stone-900 text-sm sm:text-base">
                    Google par apna experience share karein
                  </h3>
                  <p className="text-xs text-stone-500 leading-relaxed mt-1">
                    Aapka review doosre customers ko hum par bharosa karne mein madad
                    karta hai.
                  </p>
                  <a
                    href={business.googleReviewUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="mt-3.5 inline-flex items-center gap-1.5 text-xs font-semibold text-stone-800 hover:text-[#EA580C] transition-colors group"
                  >
                    <span>Google par Review Dein</span>
                    <FaArrowRight className="text-[10px] transition-transform group-hover:translate-x-0.5" />
                  </a>
                </div>
              </div>
            </div>

            {/* Facebook Item */}
            <div className="p-6">
              <div className="flex items-start gap-3.5">
                <span className="size-10 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center text-lg shrink-0 mt-0.5">
                  <FaFacebook />
                </span>
                <div className="flex-1 min-w-0">
                  <h3 className="font-bold text-stone-900 text-sm sm:text-base">
                    Facebook par humse judein
                  </h3>
                  <p className="text-xs text-stone-500 leading-relaxed mt-1">
                    Apna experience Facebook par bhi share karein.
                  </p>
                  <a
                    href={business.facebookUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="mt-3.5 inline-flex items-center gap-1.5 text-xs font-semibold text-stone-800 hover:text-[#EA580C] transition-colors group"
                  >
                    <span>Facebook par Visit Karein</span>
                    <FaArrowRight className="text-[10px] transition-transform group-hover:translate-x-0.5" />
                  </a>
                </div>
              </div>
            </div>
          </section>

          {/* 3. Showroom Info & Links Card */}
          <section className="bg-[#1B1F24] text-white rounded-2xl p-6 border border-stone-800 shadow-xs">
            <h3 className="text-lg sm:text-xl font-bold tracking-tight">
              Humare baare mein aur jaaniye
            </h3>
            <p className="mt-2 text-xs sm:text-sm text-stone-300 leading-relaxed">
              Krishna Building Material mein aapko tiles, granite, marble,
              bathroom fittings aur building materials ki quality range milti hai.
            </p>
            <div className="mt-5 flex flex-col gap-2.5">
              <a
                href={business.websiteUrl}
                target="_blank"
                rel="noreferrer"
                className="w-full min-h-[40px] inline-flex items-center justify-between rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 px-4 py-2.5 text-xs font-medium text-stone-200 hover:text-white transition-colors"
              >
                <span className="inline-flex items-center gap-2">
                  <FaGlobe className="text-stone-400" />
                  Visit Our Website
                </span>
                <FaArrowRight className="text-[10px] text-stone-400" />
              </a>
              <a
                href={whatsappLink()}
                target="_blank"
                rel="noreferrer"
                className="w-full min-h-[40px] inline-flex items-center justify-between rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 px-4 py-2.5 text-xs font-medium text-stone-200 hover:text-white transition-colors"
              >
                <span className="inline-flex items-center gap-2">
                  <FaWhatsapp className="text-emerald-400" />
                  WhatsApp par Baat Karein
                </span>
                <FaArrowRight className="text-[10px] text-stone-400" />
              </a>
              <Link
                href="/location"
                className="w-full min-h-[40px] inline-flex items-center justify-between rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 px-4 py-2.5 text-xs font-medium text-stone-200 hover:text-white transition-colors"
              >
                <span className="inline-flex items-center gap-2">
                  <FaMapMarkerAlt className="text-orange-400" />
                  Shop Location Dekhein
                </span>
                <FaArrowRight className="text-[10px] text-stone-400" />
              </Link>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}

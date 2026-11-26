"use client";

import { useState, useMemo } from "react";
import {
  FaSearch,
  FaFilter,
  FaStar,
  FaWhatsapp,
  FaTimes,
  FaPhoneAlt,
  FaCalendarAlt,
} from "react-icons/fa";

export interface CustomerRegistrationRecord {
  id: string;
  name: string;
  phone: string;
  customer_type: string;
  whatsapp_consent: boolean;
  source: string;
  created_at: string | null;
  rating?: number | null;
  feedback_categories?: string[];
  feedback_message?: string | null;
}

const typeLabels: Record<string, { label: string; badge: string }> = {
  first_time: {
    label: "First-time Customer",
    badge: "bg-blue-50 text-blue-700 border-blue-200",
  },
  regular: {
    label: "Regular Customer",
    badge: "bg-green-50 text-green-700 border-green-200",
  },
  mistri: {
    label: "Mistri",
    badge: "bg-amber-50 text-amber-700 border-amber-200",
  },
  contractor: {
    label: "Thekedar",
    badge: "bg-purple-50 text-purple-700 border-purple-200",
  },
};

export default function StaffCustomersTable({
  customers,
}: {
  customers: CustomerRegistrationRecord[];
}) {
  const [search, setSearch] = useState("");
  const [filterType, setFilterType] = useState<string>("all");
  const [filterRating, setFilterRating] = useState<string>("all");

  const filtered = useMemo(() => {
    return customers.filter((c) => {
      // Search by name or phone
      const q = search.toLowerCase().trim();
      const matchSearch =
        !q ||
        c.name.toLowerCase().includes(q) ||
        c.phone.includes(q);

      // Filter by customer type
      const matchType =
        filterType === "all" || c.customer_type === filterType;

      // Filter by rating
      const matchRating =
        filterRating === "all" ||
        (filterRating === "with_feedback" && typeof c.rating === "number") ||
        (filterRating === "5_star" && c.rating === 5) ||
        (filterRating === "low_rating" &&
          typeof c.rating === "number" &&
          c.rating <= 3);

      return matchSearch && matchType && matchRating;
    });
  }, [customers, search, filterType, filterRating]);

  return (
    <div className="panel bg-white rounded-3xl border border-gray-100 shadow-xl overflow-hidden">
      {/* Table Header & Controls */}
      <div className="p-6 border-b border-gray-100 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-extrabold text-[#20252b]">
            QR Welcome Registrations
          </h2>
          <p className="text-xs sm:text-sm text-gray-500 mt-0.5">
            Customers registered via showroom QR welcome portal ({filtered.length} of {customers.length})
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          {/* Search bar */}
          <div className="relative min-w-[200px] flex-1 sm:flex-initial">
            <FaSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 text-xs" />
            <input
              type="text"
              placeholder="Search by name / phone..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="field pl-9 pr-3 py-2 text-xs sm:text-sm rounded-xl w-full"
            />
          </div>

          {/* Type filter */}
          <div className="flex items-center gap-1.5 bg-gray-50 border border-gray-200 rounded-xl px-2.5 py-1 text-xs">
            <FaFilter className="text-gray-400 text-[10px]" />
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="bg-transparent text-gray-700 font-semibold outline-none cursor-pointer py-1 text-xs"
            >
              <option value="all">All Types</option>
              <option value="first_time">First-time</option>
              <option value="regular">Regular</option>
              <option value="mistri">Mistri</option>
              <option value="contractor">Thekedar</option>
            </select>
          </div>

          {/* Rating filter */}
          <select
            value={filterRating}
            onChange={(e) => setFilterRating(e.target.value)}
            className="bg-gray-50 border border-gray-200 text-gray-700 font-semibold rounded-xl px-2.5 py-2 outline-none cursor-pointer text-xs"
          >
            <option value="all">All Ratings</option>
            <option value="with_feedback">Has Feedback</option>
            <option value="5_star">5 Stars Only</option>
            <option value="low_rating">3 Stars or Less</option>
          </select>
        </div>
      </div>

      {/* Table view */}
      {filtered.length === 0 ? (
        <div className="p-12 text-center text-gray-500">
          <p className="text-base font-semibold">Koi customer record nahi mila.</p>
          <p className="text-xs text-gray-400 mt-1">
            Search query ya filter criteria change karke dobara dekhein.
          </p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs sm:text-sm">
            <thead>
              <tr className="bg-gray-50/80 border-b border-gray-100 text-gray-600 font-bold">
                <th className="py-3.5 px-4 sm:px-6">Customer</th>
                <th className="py-3.5 px-4">Contact</th>
                <th className="py-3.5 px-4">Category</th>
                <th className="py-3.5 px-4">Source</th>
                <th className="py-3.5 px-4">Feedback &amp; Rating</th>
                <th className="py-3.5 px-4">WhatsApp Consent</th>
                <th className="py-3.5 px-4 sm:px-6">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-gray-700">
              {filtered.map((c) => {
                const typeInfo = typeLabels[c.customer_type] || {
                  label: c.customer_type,
                  badge: "bg-gray-100 text-gray-700 border-gray-200",
                };
                const formattedDate = c.created_at
                  ? new Date(c.created_at).toLocaleDateString("en-IN", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })
                  : "—";

                return (
                  <tr
                    key={c.id}
                    className="hover:bg-gray-50/60 transition-colors"
                  >
                    {/* Name */}
                    <td className="py-4 px-4 sm:px-6 font-bold text-[#20252b]">
                      <div className="flex items-center gap-2">
                        <span className="size-7 rounded-full bg-orange-100 text-orange-600 flex items-center justify-center text-xs shrink-0 font-black">
                          {c.name.charAt(0).toUpperCase()}
                        </span>
                        <span className="truncate max-w-[140px] sm:max-w-none">
                          {c.name}
                        </span>
                      </div>
                    </td>

                    {/* Phone */}
                    <td className="py-4 px-4 font-mono font-medium">
                      <a
                        href={`tel:${c.phone}`}
                        className="hover:text-orange-600 inline-flex items-center gap-1.5"
                      >
                        <FaPhoneAlt className="text-[10px] text-gray-400" />
                        +91 {c.phone}
                      </a>
                    </td>

                    {/* Customer Category */}
                    <td className="py-4 px-4">
                      <span
                        className={`inline-block px-2.5 py-0.5 rounded-full text-[11px] font-bold border ${typeInfo.badge}`}
                      >
                        {typeInfo.label}
                      </span>
                    </td>

                    {/* Source */}
                    <td className="py-4 px-4">
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-gray-100 text-[11px] font-semibold text-gray-600">
                        📱 {c.source || "QR Portal"}
                      </span>
                    </td>

                    {/* Feedback & Rating */}
                    <td className="py-4 px-4">
                      {typeof c.rating === "number" ? (
                        <div className="grid gap-1">
                          <div className="flex items-center gap-1 text-amber-500 font-bold text-xs">
                            <span className="flex">
                              {[1, 2, 3, 4, 5].map((s) => (
                                <FaStar
                                  key={s}
                                  className={
                                    s <= (c.rating || 0)
                                      ? "text-amber-400"
                                      : "text-gray-200"
                                  }
                                />
                              ))}
                            </span>
                            <span className="text-[#20252b] ml-1">
                              ({c.rating}/5)
                            </span>
                          </div>
                          {c.feedback_categories &&
                            c.feedback_categories.length > 0 && (
                              <div className="flex flex-wrap gap-1">
                                {c.feedback_categories.map((cat) => (
                                  <span
                                    key={cat}
                                    className="text-[10px] bg-orange-50 text-orange-700 px-1.5 py-0.2 rounded font-medium"
                                  >
                                    {cat}
                                  </span>
                                ))}
                              </div>
                            )}
                          {c.feedback_message && (
                            <p
                              className="text-xs text-gray-500 italic truncate max-w-[200px]"
                              title={c.feedback_message}
                            >
                              &quot;{c.feedback_message}&quot;
                            </p>
                          )}
                        </div>
                      ) : (
                        <span className="text-gray-400 text-xs italic">
                          No feedback yet
                        </span>
                      )}
                    </td>

                    {/* WhatsApp Consent */}
                    <td className="py-4 px-4">
                      {c.whatsapp_consent ? (
                        <span className="inline-flex items-center gap-1 text-green-700 font-semibold text-xs bg-green-50 px-2 py-0.5 rounded-full border border-green-200">
                          <FaWhatsapp className="text-green-600 text-xs" /> Consented
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-gray-400 text-xs">
                          <FaTimes className="text-[10px]" /> Not given
                        </span>
                      )}
                    </td>

                    {/* Date */}
                    <td className="py-4 px-4 sm:px-6 text-gray-500 text-xs whitespace-nowrap">
                      <span className="inline-flex items-center gap-1.5">
                        <FaCalendarAlt className="text-gray-400 text-[10px]" />
                        {formattedDate}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

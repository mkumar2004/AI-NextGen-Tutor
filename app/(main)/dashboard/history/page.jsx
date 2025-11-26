"use client";

import React, { useState } from "react";
import { api } from "@/convex/_generated/api";
import { useQuery } from "convex/react";
import { staff } from "../../_components/UserInputDialong";
import { ChevronDown, ChevronUp } from "lucide-react";

/* Normalize feedback JSON */
function normalizeFeedback(item) {
  const raw = item.Feedback ?? item.feedback ?? {};
  const fb = raw?.Feedback ?? raw ?? {};

  return {
    recommended: fb.recommended ?? fb.Recommended ?? null,
    improvements: fb.improvements ?? fb.Improvement ?? null,
    summary: fb.summary ?? fb.Summary ?? null,
    rating: fb.rating ?? fb.Rating ?? null,
    ...fb,
  };
}

/* Single Feedback Card */
function FeedbackCard({ item }) {
  const [open, setOpen] = useState(false);
  const fb = normalizeFeedback(item);

  return (
    <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-200 hover:shadow-lg transition-all">
      <div className="flex gap-4 items-start">

        {/* Avatar */}
        <img
          src={item.staff?.pic ?? "/agent-placeholder.svg"}
          className="w-14 h-14 rounded-full object-cover"
        />

        {/* Content */}
        <div className="flex-1">
          <div className="flex justify-between items-start">
            <div>
              <p className="font-semibold text-lg">{item.Mentor}</p>
              <p className="text-gray-500 text-sm">{item.topic}</p>
            </div>

            <button
              onClick={() => setOpen((s) => !s)}
              className="p-1 text-gray-600 hover:text-black"
            >
              {open ? <ChevronUp size={22} /> : <ChevronDown size={22} />}
            </button>
          </div>

          {/* Summary */}
          {fb.summary && (
            <p className="mt-3 text-sm text-gray-700 italic">“{fb.summary}”</p>
          )}

          {/* Expandable Section */}
          {open && (
            <div className="mt-4 bg-gray-50 rounded-lg border border-gray-200 p-4 space-y-3 text-sm text-gray-700">

              {fb.recommended && (
                <p>
                  <span className="font-semibold">Recommended:</span>{" "}
                  {fb.recommended}
                </p>
              )}

              {fb.improvements && (
                <p>
                  <span className="font-semibold">Improvements:</span>{" "}
                  {fb.improvements}
                </p>
              )}

              {/* Rating */}
              {fb.rating && typeof fb.rating === "object" && (
                <div>
                  <p className="font-semibold mb-1">Rating</p>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    {Object.keys(fb.rating).map((key) => (
                      <p key={key}>
                        <span className="font-medium capitalize">{key}:</span>{" "}
                        {fb.rating[key]}
                      </p>
                    ))}
                  </div>
                </div>
              )}

              {/* Unknown / Extra keys */}
              {Object.keys(fb)
                .filter(
                  (k) =>
                    !["recommended", "improvements", "summary", "rating"].includes(k)
                )
                .map((k) => (
                  <p key={k}>
                    <span className="font-semibold">{k}:</span>{" "}
                    {typeof fb[k] === "object"
                      ? JSON.stringify(fb[k])
                      : String(fb[k])}
                  </p>
                ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

/* MAIN PAGE */
export default function FeedbackHistory() {
  const feedback = useQuery(api.DicussRoom.GetAllFeedback);
  const stats = useQuery(api.FullHistory.FeedbackAnalytics);

  if (!feedback) return null;

  /* FIXED STAFF MAPPING */
  const data = feedback.map((i) => ({
    ...i,
    staff:
      staff.find(
        (s) =>
          s.name.trim().toLowerCase() === i.Mentor.trim().toLowerCase()
      ) ?? { pic: "/agent-placeholder.svg" },
  }));

  return (
    <div className="h-screen flex flex-col overflow-hidden p-6 bg-gray-50">

      {/* Header */}
      <h2 className="font-bold text-3xl mb-6">Feedback History</h2>

      {/* PERFORMANCE ANALYTICS */}
      {stats && (
        <div className="bg-white shadow-md border border-gray-200 rounded-2xl p-6 mb-6">

          {/* Header */}
          <div className="mb-5">
            <h3 className="font-bold text-2xl bg-gradient-to-r from-indigo-600 to-purple-500 text-transparent bg-clip-text">
              Performance Analytics
            </h3>
            <p className="text-gray-500 text-sm mt-1">
              Based on all interview feedback
            </p>
          </div>

          {/* Average Score */}
          <div className="bg-gray-50 p-4 rounded-xl border flex items-center gap-4">
            <div className="text-3xl">⭐</div>
            <div>
              <p className="text-lg font-semibold">
                {stats.averageScore ?? 0} / 5
              </p>
              <p className="text-gray-500 text-sm">Average Rating</p>
            </div>
          </div>

          {/* Best / Worst */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-5">

            {/* Top */}
            <div className="bg-green-50 border border-green-200 p-4 rounded-xl">
              <p className="text-green-700 font-semibold text-sm flex items-center gap-2">
                🏆 Top Mentor
              </p>
              <p className="text-gray-700 font-semibold text-lg mt-1">
                {stats?.top?.mentor ?? "N/A"}
              </p>
              <p className="text-gray-500 text-sm">
                Score: {stats?.top?.score ?? "-"}
              </p>
            </div>

            {/* Worst */}
            <div className="bg-red-50 border border-red-200 p-4 rounded-xl">
              <p className="text-red-700 font-semibold text-sm flex items-center gap-2">
                ⚠ Needs Improvement
              </p>
              <p className="text-gray-700 font-semibold text-lg mt-1">
                {stats?.worst?.mentor ?? "N/A"}
              </p>
              <p className="text-gray-500 text-sm">
                Score: {stats?.worst?.score ?? "-"}
              </p>
            </div>

          </div>
        </div>
      )}

      {/* FEEDBACK LIST (INNER SCROLL) */}
      <div className="flex-1 min-h-0 overflow-y-auto pr-3 space-y-4">
        {data.length === 0 ? (
          <p className="text-center text-gray-400 mt-10">
            No feedback available.
          </p>
        ) : (
          data.map((item) => (
            <FeedbackCard key={item._id} item={item} />
          ))
        )}
      </div>
    </div>
  );
}

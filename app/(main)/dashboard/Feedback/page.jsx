"use client";

import React, { useState } from "react";
import { api } from "@/convex/_generated/api";
import { useQuery } from "convex/react";
import { staff } from "../../_components/UserInputDialong";
import { ChevronDown, ChevronUp } from "lucide-react";

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

function Pill({ children }) {
  return (
    <span className="px-2 py-1 text-xs bg-gray-100 text-gray-600 rounded-full border border-gray-200">
      {children}
    </span>
  );
}

function FeedbackCard({ item }) {
  const [open, setOpen] = useState(false);
  const fb = normalizeFeedback(item);

  return (
    <div className="relative bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-all overflow-hidden">

      {/* Left accent bar */}
      <div className="absolute left-0 top-0 h-full w-[4px] bg-blue-500 rounded-l-2xl opacity-70" />

      <div className="flex gap-4 items-start">
        {/* Avatar */}
        <img
          src={item.staff?.pic ?? "/agent-placeholder.svg"}
          className="w-16 h-16 rounded-xl object-cover border border-gray-200 shadow-sm"
        />

        {/* Content */}
        <div className="flex-1">
          <div className="flex justify-between items-start">
            <div>
              <p className="font-semibold text-lg text-gray-900">
                {item.Mentor}
              </p>

              <div className="flex gap-2 mt-1">
                <Pill>{item.topic}</Pill>
              </div>
            </div>

            <button
              onClick={() => setOpen((s) => !s)}
              className="p-2 text-gray-500 hover:text-gray-800 rounded-full hover:bg-gray-100 transition"
            >
              {open ? <ChevronUp size={22} /> : <ChevronDown size={22} />}
            </button>
          </div>

          {/* Summary */}
          {fb.summary && (
            <p className="mt-3 text-gray-700 text-[15px] leading-relaxed">
              “{fb.summary}”
            </p>
          )}

          {/* EXPANDED SECTION */}
          <div
            className={`transition-all duration-300 overflow-hidden ${
              open ? "max-h-[500px] mt-4" : "max-h-0"
            }`}
          >
            <div className="bg-gray-50 rounded-xl border border-gray-200 p-4 space-y-4 text-sm text-gray-700">

              {/* Recommended */}
              {fb.recommended && (
                <div>
                  <p className="font-semibold text-gray-900 mb-1">Recommended</p>
                  <p className="leading-relaxed">{fb.recommended}</p>
                </div>
              )}

              {/* Improvements */}
              {fb.improvements && (
                <div>
                  <p className="font-semibold text-gray-900 mb-1">Improvements</p>
                  <p className="leading-relaxed">{fb.improvements}</p>
                </div>
              )}

              {/* Rating structured as badges */}
              {fb.rating && typeof fb.rating === "object" && (
                <div>
                  <p className="font-semibold text-gray-900">Ratings</p>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {Object.keys(fb.rating).map((key) => (
                      <span
                        key={key}
                        className="px-3 py-1 text-xs rounded-full bg-blue-50 text-blue-700 border border-blue-200"
                      >
                        {key}: {fb.rating[key]}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Dynamic extra keys */}
              {Object.keys(fb)
                .filter(
                  (k) =>
                    !["recommended", "improvements", "summary", "rating"].includes(k)
                )
                .map((k) => (
                  <div key={k}>
                    <p className="font-semibold text-gray-900 capitalize">{k}</p>
                    <p>
                      {typeof fb[k] === "object"
                        ? JSON.stringify(fb[k])
                        : String(fb[k])}
                    </p>
                  </div>
                ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function FeedbackHistory() {
  const feedback = useQuery(api.DicussRoom.GetAllFeedback);

  if (!feedback) return null;

  const data = feedback.map((i) => ({
    ...i,
    staff: staff.find((s) => s.name === i.Mentor) ?? null,
  }));

  return (
    <div className="h-screen overflow-hidden p-6 bg-gray-50">
      <h2 className="font-bold text-3xl mb-6 text-gray-800">Feedback History</h2>

      <div className="h-[72vh] overflow-y-auto pr-3 space-y-5">
        {data.length === 0 ? (
          <p className="text-center text-gray-400 mt-10">
            No feedback available.
          </p>
        ) : (
          data.map((item) => (
            <FeedbackCard key={item._id ?? Math.random()} item={item} />
          ))
        )}
      </div>
    </div>
  );
}

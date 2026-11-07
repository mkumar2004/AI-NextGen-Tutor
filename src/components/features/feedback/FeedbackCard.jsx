'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { ChevronDown, ChevronUp } from 'lucide-react';

export function normalizeFeedback(item) {
  const raw = item?.Feedback ?? item?.feedback ?? {};
  const fb = raw?.Feedback ?? raw ?? {};

  return {
    recommended: fb.recommended ?? fb.Recommended ?? null,
    improvements: fb.improvements ?? fb.Improvement ?? null,
    summary: fb.summary ?? fb.Summary ?? null,
    rating: fb.rating ?? fb.Rating ?? null,
    ...fb,
  };
}

export function FeedbackCard({ item, variant = 'history' }) {
  const [open, setOpen] = useState(false);
  const fb = normalizeFeedback(item);

  if (variant === 'accent') {
    return (
      <div className="relative bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-all overflow-hidden">
        <div className="absolute left-0 top-0 h-full w-[4px] bg-blue-500 rounded-l-2xl opacity-70" />

        <div className="flex gap-4 items-start">
          <img
            src={item.staff?.pic ?? '/agent-placeholder.svg'}
            alt={item.Mentor || 'Mentor'}
            className="w-16 h-16 rounded-xl object-cover border border-gray-200 shadow-sm"
          />

          <div className="flex-1">
            <div className="flex justify-between items-start">
              <div>
                <p className="font-semibold text-lg text-gray-900">{item.Mentor}</p>
                <div className="flex gap-2 mt-1">
                  <span className="px-2 py-1 text-xs bg-gray-100 text-gray-600 rounded-full border border-gray-200">
                    {item.topic}
                  </span>
                </div>
              </div>

              <button
                onClick={() => setOpen((s) => !s)}
                className="p-2 text-gray-500 hover:text-gray-800 rounded-full hover:bg-gray-100 transition"
              >
                {open ? <ChevronUp size={22} /> : <ChevronDown size={22} />}
              </button>
            </div>

            {fb.summary && (
              <p className="mt-3 text-gray-700 text-[15px] leading-relaxed">
                “{fb.summary}”
              </p>
            )}

            <div
              className={`transition-all duration-300 overflow-hidden ${
                open ? 'max-h-[500px] mt-4' : 'max-h-0'
              }`}
            >
              <div className="bg-gray-50 rounded-xl border border-gray-200 p-4 space-y-4 text-sm text-gray-700">
                {fb.recommended && (
                  <div>
                    <p className="font-semibold text-gray-900 mb-1">Recommended</p>
                    <p className="leading-relaxed">{fb.recommended}</p>
                  </div>
                )}

                {fb.improvements && (
                  <div>
                    <p className="font-semibold text-gray-900 mb-1">Improvements</p>
                    <p className="leading-relaxed">{fb.improvements}</p>
                  </div>
                )}

                {fb.rating && typeof fb.rating === 'object' && (
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

                {Object.keys(fb)
                  .filter((k) => !['recommended', 'improvements', 'summary', 'rating'].includes(k))
                  .map((k) => (
                    <div key={k}>
                      <p className="font-semibold text-gray-900 capitalize">{k}</p>
                      <p>
                        {typeof fb[k] === 'object' ? JSON.stringify(fb[k]) : String(fb[k])}
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

  // Standard history feedback card
  return (
    <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-200 hover:shadow-lg transition-all">
      <div className="flex gap-4 items-start">
        <img
          src={item.staff?.pic ?? '/agent-placeholder.svg'}
          alt={item.Mentor || 'Mentor'}
          className="w-14 h-14 rounded-full object-cover"
        />

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

          {fb.summary && (
            <p className="mt-3 text-sm text-gray-700 italic">“{fb.summary}”</p>
          )}

          {open && (
            <div className="mt-4 bg-gray-50 rounded-lg border border-gray-200 p-4 space-y-3 text-sm text-gray-700">
              {fb.recommended && (
                <p>
                  <span className="font-semibold">Recommended:</span> {fb.recommended}
                </p>
              )}

              {fb.improvements && (
                <p>
                  <span className="font-semibold">Improvements:</span> {fb.improvements}
                </p>
              )}

              {fb.rating && typeof fb.rating === 'object' && (
                <div>
                  <p className="font-semibold mb-1">Rating</p>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    {Object.keys(fb.rating).map((key) => (
                      <p key={key}>
                        <span className="font-medium capitalize">{key}:</span> {fb.rating[key]}
                      </p>
                    ))}
                  </div>
                </div>
              )}

              {Object.keys(fb)
                .filter((k) => !['recommended', 'improvements', 'summary', 'rating'].includes(k))
                .map((k) => (
                  <p key={k}>
                    <span className="font-semibold">{k}:</span>{' '}
                    {typeof fb[k] === 'object' ? JSON.stringify(fb[k]) : String(fb[k])}
                  </p>
                ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}


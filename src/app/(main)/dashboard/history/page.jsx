'use client';

import React from 'react';
import { api } from '@/convex/_generated/api';
import { useQuery } from 'convex/react';
import { FeedbackCard } from '@/components/features/feedback/FeedbackCard';
import { STAFF_MEMBERS } from '@/constants';

export default function FeedbackHistory() {
  const feedback = useQuery(api.DicussRoom.GetAllFeedback);
  const stats = useQuery(api.FullHistory.FeedbackAnalytics);

  if (!feedback) return null;

  const data = feedback.map((i) => ({
    ...i,
    staff:
      STAFF_MEMBERS.find(
        (s) => s.name.trim().toLowerCase() === i.Mentor.trim().toLowerCase()
      ) ?? { pic: '/agent-placeholder.svg' },
  }));

  return (
    <div className="h-screen flex flex-col overflow-hidden p-6 bg-gray-50">
      {/* Header */}
      <h1 className="font-bold text-3xl mb-6">Feedback History</h1>

      {/* PERFORMANCE ANALYTICS */}
      {stats && (
        <div className="bg-white shadow-md border border-gray-200 rounded-2xl p-6 mb-6">
          <div className="mb-5">
            <h2 className="font-bold text-2xl bg-gradient-to-r from-indigo-600 to-purple-500 text-transparent bg-clip-text">
              Performance Analytics
            </h2>
            <p className="text-gray-500 text-sm mt-1">
              Based on all interview feedback
            </p>
          </div>

          <div className="bg-gray-50 p-4 rounded-xl border flex items-center gap-4">
            <div className="text-3xl">⭐</div>
            <div>
              <p className="text-lg font-semibold">
                {stats.averageScore ?? 0} / 5
              </p>
              <p className="text-gray-500 text-sm">Average Rating</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-5">
            <div className="bg-green-50 border border-green-200 p-4 rounded-xl">
              <p className="text-green-700 font-semibold text-sm flex items-center gap-2">
                🏆 Top Mentor
              </p>
              <p className="text-gray-700 font-semibold text-lg mt-1">
                {stats?.top?.mentor ?? 'N/A'}
              </p>
              <p className="text-gray-500 text-sm">
                Score: {stats?.top?.score ?? '-'}
              </p>
            </div>

            <div className="bg-red-50 border border-red-200 p-4 rounded-xl">
              <p className="text-red-700 font-semibold text-sm flex items-center gap-2">
                ⚠ Needs Improvement
              </p>
              <p className="text-gray-700 font-semibold text-lg mt-1">
                {stats?.worst?.mentor ?? 'N/A'}
              </p>
              <p className="text-gray-500 text-sm">
                Score: {stats?.worst?.score ?? '-'}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* FEEDBACK LIST */}
      <div className="flex-1 min-h-0 overflow-y-auto pr-3 space-y-4">
        {data.length === 0 ? (
          <p className="text-center text-gray-400 mt-10">
            No feedback available.
          </p>
        ) : (
          data.map((item) => (
            <FeedbackCard key={item._id} item={item} variant="history" />
          ))
        )}
      </div>
    </div>
  );
}

'use client';

import React from 'react';
import { api } from '@/convex/_generated/api';
import { useQuery } from 'convex/react';
import { FeedbackCard } from '@/components/features/feedback/FeedbackCard';
import { STAFF_MEMBERS } from '@/constants';

export default function FeedbackPage() {
  const feedback = useQuery(api.DicussRoom.GetAllFeedback);

  if (!feedback) return null;

  const data = feedback.map((i) => ({
    ...i,
    staff: STAFF_MEMBERS.find((s) => s.name === i.Mentor) ?? null,
  }));

  return (
    <div className="h-screen overflow-hidden p-6 bg-gray-50">
      <h1 className="font-bold text-3xl mb-6 text-gray-800">Feedback History</h1>

      <div className="h-[72vh] overflow-y-auto pr-3 space-y-5">
        {data.length === 0 ? (
          <p className="text-center text-gray-400 mt-10">
            No feedback available.
          </p>
        ) : (
          data.map((item, index) => (
            <FeedbackCard key={item._id ?? index} item={item} variant="accent" />
          ))
        )}
      </div>
    </div>
  );
}

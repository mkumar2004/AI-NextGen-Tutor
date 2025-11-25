"use client"
import React from "react";
import { api } from "@/convex/_generated/api";
import { useQuery } from "convex/react";
import { staff } from "../../_components/UserInputDialong";

function FeedbackHistory() {
  const feedback = useQuery(api.DicussRoom.Feedback);

  if (!feedback) return null;

  const data = feedback.map((item) => ({
    ...item,
    staff: staff.find((s) => s.name === item.Mentor),
  }));

  return (
    <div>
      <h2 className="font-bold text-xl">FeedBack</h2>

      {data.length === 0 ? (
        <p className="text-gray-400">You don't have any Interview Feedback</p>
      ) : (
        data.map((item) => (
          <div key={item._id} className="mt-3 flex items-center gap-3">
            <img
              src={item.staff?.pic}
              alt=""
              className="w-10 h-10 rounded-full object-cover"
            />
            <div>
              <p className="font-medium">{item.Mentor}</p>
              <p className="text-sm text-gray-500">{item.topic}</p>
            </div>
          </div>
        ))
      )}
    </div>
  );
}

export default FeedbackHistory;

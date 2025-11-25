'use client'
import React, { useState } from 'react'
import FeaturesAssistants from '../_components/FeaturesAssistants'
import MeetingUrl from '../_components/MeetingUrl'
import Link from 'next/link'
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { History, MessageSquare } from "lucide-react";
function Dashboard() {
  const [roomdata, setRoomdata] = useState(null);
  const [meetingdata, setMeetingdata] = useState(null);

  return (
    <div>
      <FeaturesAssistants Setroomid={setRoomdata} Setmeetingdata={setMeetingdata} />
      <MeetingUrl roomId={roomdata} meetingData={meetingdata} />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-10">

        {/* History Card */}
        <Link href="/dashboard/history">
          <Card className="cursor-pointer hover:shadow-xl hover:scale-[1.02] transition-all duration-200">
            <CardHeader>

              <div className="flex items-center justify-between">
                {/* Left Section */}
                <div className="flex items-center gap-3">
                  <div className="bg-blue-100 p-3 rounded-full">
                    <History className="w-6 h-6 text-blue-600" />
                  </div>

                  <div>
                    <CardTitle className="text-xl">History</CardTitle>
                    <CardDescription className="mt-1 text-sm">
                      View all previous discussions and meetings.
                    </CardDescription>
                  </div>
                </div>

                {/* Right Arrow */}
                <svg
                  className="w-6 h-6 text-gray-400 group-hover:text-blue-600 transition"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                >
                  <path d="M9 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>

            </CardHeader>
          </Card>
        </Link>

        {/* Feedback Card */}
        <Link href="/dashboard/Feedback">
          <Card className="cursor-pointer hover:shadow-xl hover:scale-[1.02] transition-all duration-200">
            <CardHeader>

              <div className="flex items-center justify-between">
                {/* Left Section */}
                <div className="flex items-center gap-3">
                  <div className="bg-green-100 p-3 rounded-full">
                    <MessageSquare className="w-6 h-6 text-green-600" />
                  </div>

                  <div>
                    <CardTitle className="text-xl">Feedback</CardTitle>
                    <CardDescription className="mt-1 text-sm">
                      Check feedback from mentors and assistants.
                    </CardDescription>
                  </div>
                </div>

                {/* Right Arrow */}
                <svg
                  className="w-6 h-6 text-gray-400 group-hover:text-green-600 transition"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                >
                  <path d="M9 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>

            </CardHeader>
          </Card>
        </Link>

      </div>

    </div>
  )
}

export default Dashboard
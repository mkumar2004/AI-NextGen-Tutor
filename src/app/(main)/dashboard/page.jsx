'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  History,
  MessageSquare,
  ArrowRight,
  TrendingUp,
  Award,
  Users,
  Target,
  FileCheck2,
} from 'lucide-react';
import FeaturesAssistants from '@/components/features/dashboard/FeaturesAssistants';
import MeetingUrl from '@/components/features/dashboard/MeetingUrl';

export default function Dashboard() {
  const [roomdata, setRoomdata] = useState(null);
  const [meetingdata, setMeetingdata] = useState(null);

  const interviewDomains = [
    {
      title: 'Technical Problem Solving',
      subtitle: 'LAST SESSION',
      engagement: '85%',
      score: '92%',
      color: 'bg-indigo-500',
    },
    {
      title: 'Communication & Verbal Clarity',
      subtitle: 'CONSISTENTLY HIGH',
      engagement: '92%',
      score: '88%',
      color: 'bg-emerald-500',
    },
  ];

  return (
    <div className="space-y-10">
      {/* 1. Coaching Tracks Section */}
      <FeaturesAssistants Setroomid={setRoomdata} Setmeetingdata={setMeetingdata} />

      {/* 2. Active Meeting Banner (shows when a session is created) */}
      <MeetingUrl roomId={roomdata} meetingData={meetingdata} />

      {/* 3. Main Split Section: Performance Summary & Goal Setting */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column (2 cols): Interview Domains / Analytics */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-sm font-bold uppercase tracking-wider text-slate-400">
                INTERVIEW DOMAINS & READINESS
              </h2>
            </div>
            <Link
              href="/dashboard/history"
              className="text-xs font-semibold text-indigo-600 hover:text-indigo-700 flex items-center gap-1"
            >
              View All History <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="space-y-3">
            {interviewDomains.map((domain) => (
              <div
                key={domain.title}
                className="p-5 rounded-3xl bg-white border border-slate-200/80 shadow-2xs hover:shadow-md transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4"
              >
                <div className="flex items-center gap-4">
                  <div className={`w-3.5 h-3.5 rounded-full ${domain.color} shadow-xs shrink-0`} />
                  <div>
                    <h3 className="text-sm font-bold text-slate-900">{domain.title}</h3>
                    <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wide">
                      {domain.subtitle}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-8">
                  <div>
                    <p className="text-xs text-slate-400">Engagement</p>
                    <p className="text-sm font-extrabold text-slate-800">{domain.engagement}</p>
                  </div>

                  <div>
                    <p className="text-xs text-slate-400">Score</p>
                    <p className="text-sm font-extrabold text-indigo-600">{domain.score}</p>
                  </div>

                  <Link href="/dashboard/history">
                    <button className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold tracking-wide transition-colors cursor-pointer">
                      ANALYTIC REPORT
                    </button>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Column (1 col): Goal Setting & Institution Stat Card (from reference) */}
        <div className="space-y-4">
          <h2 className="text-sm font-bold uppercase tracking-wider text-slate-400">
            TARGETS & STATS
          </h2>

          <div className="p-6 rounded-3xl bg-white border border-slate-200/80 shadow-2xs text-center space-y-2">
            <h3 className="text-4xl font-extrabold text-indigo-600">742</h3>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              PARTNER INTERVIEW TRACKS
            </p>
            <p className="text-xs text-slate-500 pt-1 leading-relaxed">
              Curated by top industry tech leads and corporate recruiters.
            </p>
          </div>

          <div className="p-6 rounded-3xl bg-gradient-to-br from-indigo-50/50 via-purple-50/30 to-pink-50/20 border border-indigo-100 shadow-2xs flex items-center justify-between">
            <div className="flex items-center gap-3.5">
              <div className="w-10 h-10 rounded-2xl bg-indigo-600 text-white flex items-center justify-center shadow-xs">
                <Target className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-slate-900">Weekly Goal</h4>
                <p className="text-xs text-slate-500">3 of 5 mock sessions done</p>
              </div>
            </div>
            <span className="text-xs font-extrabold text-indigo-600 bg-white px-2.5 py-1 rounded-full border border-indigo-100">
              60%
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

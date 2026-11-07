'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { useUser } from '@stackframe/stack';
import { BlurFade } from '@/components/ui/blur-fade';
import UserInputDialog from './UserInputDialog';
import { EXPERT_ASSISTANTS } from '@/constants';
import { Sparkles, ArrowUpRight, Play, CheckCircle2 } from 'lucide-react';

export default function FeaturesAssistants({ Setroomid, Setmeetingdata }) {
  const user = useUser();
  const [activeFilter, setActiveFilter] = useState('All');

  const filterTabs = ['All', 'Interview', 'Technical', 'Language', 'Wellness'];

  const getAssistantMetadata = (name) => {
    switch (name) {
      case 'Lecture on Topic':
        return {
          category: 'Technical',
          tag: 'Deep Dive',
          tagColor: 'bg-emerald-50 text-emerald-700 border-emerald-200/60',
          score: '9.8',
        };
      case 'Mock Interview':
        return {
          category: 'Interview',
          tag: 'Live Simulation',
          tagColor: 'bg-indigo-50 text-indigo-700 border-indigo-200/60',
          score: '9.9',
        };
      case 'Ques Ans Pre':
        return {
          category: 'Technical',
          tag: 'Rapid Q&A',
          tagColor: 'bg-amber-50 text-amber-700 border-amber-200/60',
          score: '9.5',
        };
      case 'Language Skill':
        return {
          category: 'Language',
          tag: 'Fluency',
          tagColor: 'bg-purple-50 text-purple-700 border-purple-200/60',
          score: '9.6',
        };
      case 'Medication':
        return {
          category: 'Wellness',
          tag: 'Health & Wellness',
          tagColor: 'bg-rose-50 text-rose-700 border-rose-200/60',
          score: '9.7',
        };
      default:
        return {
          category: 'All',
          tag: 'AI Coach',
          tagColor: 'bg-blue-50 text-blue-700 border-blue-200/60',
          score: '9.5',
        };
    }
  };

  const filteredAssistants = EXPERT_ASSISTANTS.filter((item) => {
    if (activeFilter === 'All') return true;
    const meta = getAssistantMetadata(item.name);
    return meta.category === activeFilter;
  });

  return (
    <div className="w-full">
      {/* 1. Header Banner & Readiness Stats (matching reference UI) */}
      <div className="mb-8 flex flex-col lg:flex-row lg:items-center justify-between gap-6 pb-6 border-b border-slate-200/80">
        <div>
          <p className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5">
            CAREER DASHBOARD
          </p>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900">
            Good Day,{' '}
            <span className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
              {user?.displayName || 'Scholar'}
            </span>
          </h1>
          <p className="mt-1 text-sm text-slate-500 max-w-xl">
            Select an AI coach to conduct interactive voice sessions, practice live interview questions, and receive feedback.
          </p>
        </div>

        {/* Right side stats from reference layout */}
        <div className="flex items-center gap-4 shrink-0">
          <div className="flex items-center gap-2.5 px-4 py-2.5 rounded-2xl bg-white border border-slate-200/80 shadow-2xs">
            <span className="text-xs font-semibold text-slate-600">Watch walkthrough</span>
            <div className="w-7 h-7 rounded-full bg-rose-500 text-white flex items-center justify-center shadow-xs">
              <Play className="w-3.5 h-3.5 fill-white ml-0.5" />
            </div>
          </div>

          <div className="flex items-center gap-3 px-5 py-2.5 rounded-2xl bg-white border border-slate-200/80 shadow-2xs">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                AVERAGE READINESS
              </p>
              <p className="text-xl font-extrabold text-slate-900">
                88 <span className="text-xs text-slate-400 font-normal">/ 100</span>
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Filter Pills (matching reference UI: Tech, Behavioral, Case Study...) */}
      <div className="flex items-center gap-2 mb-6 overflow-x-auto pb-1">
        {filterTabs.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveFilter(tab)}
            className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer ${
              activeFilter === tab
                ? 'bg-slate-900 text-white shadow-xs'
                : 'bg-white border border-slate-200/80 text-slate-600 hover:bg-slate-50 hover:text-slate-900'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* 3. Section Title */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-sm font-bold uppercase tracking-wider text-slate-400">
            COACHING SIMULATIONS
          </h2>
        </div>
      </div>

      {/* 4. Coaching Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 sm:gap-5">
        {filteredAssistants.map((item, index) => {
          const meta = getAssistantMetadata(item.name);
          return (
            <BlurFade key={item.name} delay={0.1 + index * 0.05} inView>
              <UserInputDialog
                options={item}
                Setroomid={Setroomid}
                SetData={Setmeetingdata}
              >
                <div
                  className="group relative flex flex-col justify-between p-5 bg-white rounded-3xl border border-slate-200/80 shadow-xs 
                    hover:shadow-xl hover:border-indigo-300 hover:-translate-y-1 transition-all duration-300 
                    h-68 cursor-pointer overflow-hidden text-left"
                >
                  {/* Subtle top indicator bar */}
                  <div className="flex items-center justify-between w-full">
                    <span
                      className={`px-2.5 py-0.5 rounded-full text-[11px] font-semibold border ${meta.tagColor}`}
                    >
                      {meta.tag}
                    </span>
                    <span className="text-xs font-bold text-slate-400 group-hover:text-indigo-600 transition-colors">
                      {meta.score}/10
                    </span>
                  </div>

                  {/* Centered Avatar Image with elevation */}
                  <div className="my-auto flex items-center justify-center w-full py-2">
                    <div className="w-20 h-20 rounded-2xl bg-gradient-to-tr from-slate-50 to-indigo-50/30 border border-slate-100 flex items-center justify-center p-2 shadow-2xs group-hover:scale-110 group-hover:shadow-md transition-all duration-300">
                      <Image
                        src={item.icon}
                        alt={item.name}
                        width={72}
                        height={72}
                        className="object-contain w-full h-full drop-shadow-xs"
                      />
                    </div>
                  </div>

                  {/* Bottom: Title & Progress Bar (from reference) */}
                  <div className="w-full pt-3 border-t border-slate-100">
                    <h3 className="text-sm font-bold text-slate-900 group-hover:text-indigo-600 transition-colors leading-tight">
                      {item.name}
                    </h3>
                    <div className="flex items-center justify-between mt-2">
                      <span className="text-[11px] text-slate-400 font-medium">
                        • Ready to start
                      </span>
                      <div className="w-16 h-1.5 rounded-full bg-slate-100 overflow-hidden">
                        <div className="w-3/4 h-full bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full" />
                      </div>
                    </div>
                  </div>
                </div>
              </UserInputDialog>
            </BlurFade>
          );
        })}
      </div>
    </div>
  );
}

export const Experlist = EXPERT_ASSISTANTS;

'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  History,
  MessageSquare,
  Sparkles,
  BarChart3,
  Bot,
  Calendar,
  X,
  Clock,
  ArrowRight,
} from 'lucide-react';
import { STAFF_MEMBERS } from '@/constants';
import Image from 'next/image';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

export default function AppSidebar() {
  const pathname = usePathname();
  const [openCoachesModal, setOpenCoachesModal] = useState(false);
  const [openAnalyticsModal, setOpenAnalyticsModal] = useState(false);

  const navItems = [
    { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
    { name: 'History', href: '/dashboard/history', icon: History },
    { name: 'Feedback', href: '/dashboard/Feedback', icon: MessageSquare },
  ];

  return (
    <>
      <aside className="hidden lg:flex flex-col justify-between w-20 xl:w-64 shrink-0 bg-white border-r border-slate-200/80 sticky top-16 h-[calc(100vh-4rem)] p-4 overflow-y-auto">
        <div className="space-y-6">
          {/* Navigation Category */}
          <div className="space-y-1">
            <p className="hidden xl:block text-[11px] font-bold text-slate-400 uppercase tracking-wider px-3 mb-2">
              Navigation
            </p>
            {navItems.map((item) => {
              const isActive = pathname === item.href;
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-3.5 px-3.5 py-3 rounded-2xl text-sm font-semibold transition-all group ${
                    isActive
                      ? 'bg-indigo-600 text-white shadow-md shadow-indigo-200'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/70'
                  }`}
                >
                  <div
                    className={`w-9 h-9 rounded-xl flex items-center justify-center transition-colors ${
                      isActive
                        ? 'bg-white/20 text-white'
                        : 'bg-slate-100 text-slate-500 group-hover:bg-indigo-50 group-hover:text-indigo-600'
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                  </div>
                  <span className="hidden xl:inline">{item.name}</span>
                </Link>
              );
            })}
          </div>

          {/* Interactive Workspace Features */}
          <div className="space-y-1 pt-4 border-t border-slate-100">
            <p className="hidden xl:block text-[11px] font-bold text-slate-400 uppercase tracking-wider px-3 mb-2">
              Features
            </p>

            {/* Voice Coaches Feature Button */}
            <div
              onClick={() => setOpenCoachesModal(true)}
              className="flex items-center gap-3.5 px-3.5 py-2.5 rounded-2xl text-sm font-medium text-slate-600 hover:bg-purple-50/60 hover:text-purple-700 cursor-pointer group transition-all"
            >
              <div className="w-9 h-9 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center group-hover:scale-105 transition-transform">
                <Bot className="w-5 h-5" />
              </div>
              <span className="hidden xl:inline font-semibold">Voice Coaches</span>
            </div>

            {/* Analytics Feature Button */}
            <div
              onClick={() => setOpenAnalyticsModal(true)}
              className="flex items-center gap-3.5 px-3.5 py-2.5 rounded-2xl text-sm font-medium text-slate-600 hover:bg-emerald-50/60 hover:text-emerald-700 cursor-pointer group transition-all"
            >
              <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center group-hover:scale-105 transition-transform">
                <BarChart3 className="w-5 h-5" />
              </div>
              <span className="hidden xl:inline font-semibold">Analytics</span>
            </div>
          </div>
        </div>

        {/* Bottom Promo / Readiness Card */}
        <div className="hidden xl:block p-4 mt-auto rounded-2xl bg-gradient-to-br from-indigo-500/10 via-purple-500/10 to-pink-500/10 border border-indigo-100 shrink-0">
          <div className="flex items-center gap-2 mb-1.5">
            <Sparkles className="w-4 h-4 text-indigo-600" />
            <span className="text-xs font-bold text-indigo-900">AI Powered</span>
          </div>
          <p className="text-xs text-slate-600 leading-relaxed">
            Practice mock interviews with real-time feedback & scoring.
          </p>
        </div>
      </aside>

      {/* Voice Coaches Feature Modal */}
      <Dialog open={openCoachesModal} onOpenChange={setOpenCoachesModal}>
        <DialogContent className="sm:max-w-2xl p-0 overflow-hidden rounded-3xl border border-slate-200 shadow-2xl bg-white">
          <div className="bg-gradient-to-r from-purple-600 to-indigo-600 px-6 py-6 text-white">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-white/20 text-xs font-medium text-white/95 mb-2">
              <Bot className="w-3.5 h-3.5 text-amber-300" /> Active AI Mentor Roster
            </div>
            <DialogTitle className="text-2xl font-bold tracking-tight text-white">
              AI Voice Coaches
            </DialogTitle>
            <DialogDescription className="text-xs sm:text-sm text-white/80 mt-1">
              Select any specialized coach to conduct technical simulations, behavioral drills, or language coaching.
            </DialogDescription>
          </div>

          <div className="p-6 grid grid-cols-1 sm:grid-cols-2 gap-4 max-h-[60vh] overflow-y-auto">
            {STAFF_MEMBERS.map((coach) => (
              <div
                key={coach.name}
                className="p-4 rounded-2xl border border-slate-200/90 hover:border-purple-300 bg-white hover:bg-purple-50/30 transition-all flex items-center gap-3.5"
              >
                <div className="relative w-14 h-14 rounded-2xl overflow-hidden border border-slate-200 shrink-0 bg-slate-50">
                  <Image
                    src={coach.pic}
                    alt={coach.name}
                    width={56}
                    height={56}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-900">{coach.name}</h4>
                  <p className="text-xs text-slate-500 capitalize">{coach.gender} Voice Model</p>
                  <span className="inline-block mt-1 text-[10px] font-semibold text-purple-700 bg-purple-100/70 px-2 py-0.5 rounded-full">
                    Real-time Voice Ready
                  </span>
                </div>
              </div>
            ))}
          </div>
        </DialogContent>
      </Dialog>

      {/* Analytics Feature Modal */}
      <Dialog open={openAnalyticsModal} onOpenChange={setOpenAnalyticsModal}>
        <DialogContent className="sm:max-w-xl p-0 overflow-hidden rounded-3xl border border-slate-200 shadow-2xl bg-white">
          <div className="bg-gradient-to-r from-emerald-600 to-teal-600 px-6 py-6 text-white">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-white/20 text-xs font-medium text-white/95 mb-2">
              <BarChart3 className="w-3.5 h-3.5 text-amber-300" /> Performance Metrics
            </div>
            <DialogTitle className="text-2xl font-bold tracking-tight text-white">
              Interview Readiness Analytics
            </DialogTitle>
            <DialogDescription className="text-xs sm:text-sm text-white/80 mt-1">
              Real-time telemetry and evaluator score trajectory across your mock sessions.
            </DialogDescription>
          </div>

          <div className="p-6 space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div className="p-4 rounded-2xl bg-emerald-50/60 border border-emerald-100">
                <span className="text-xs font-bold text-emerald-800 uppercase tracking-wider">Average Score</span>
                <p className="text-2xl font-extrabold text-emerald-900 mt-1">88%</p>
                <p className="text-[11px] text-emerald-700 mt-0.5">+4.2% from previous week</p>
              </div>
              <div className="p-4 rounded-2xl bg-indigo-50/60 border border-indigo-100">
                <span className="text-xs font-bold text-indigo-800 uppercase tracking-wider">Sessions Completed</span>
                <p className="text-2xl font-extrabold text-indigo-900 mt-1">12</p>
                <p className="text-[11px] text-indigo-700 mt-0.5">Top 10% scholar cohort</p>
              </div>
            </div>

            <div className="p-4 rounded-2xl border border-slate-200/90 bg-slate-50/50 space-y-2">
              <div className="flex justify-between text-xs font-semibold text-slate-700">
                <span>Technical Proficiency</span>
                <span>92%</span>
              </div>
              <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                <div className="bg-emerald-500 h-full rounded-full" style={{ width: '92%' }} />
              </div>
            </div>

            <div className="p-4 rounded-2xl border border-slate-200/90 bg-slate-50/50 space-y-2">
              <div className="flex justify-between text-xs font-semibold text-slate-700">
                <span>Verbal & Communication Clarity</span>
                <span>88%</span>
              </div>
              <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                <div className="bg-indigo-500 h-full rounded-full" style={{ width: '88%' }} />
              </div>
            </div>

            <div className="pt-2 flex justify-end">
              <Link
                href="/dashboard/history"
                onClick={() => setOpenAnalyticsModal(false)}
                className="text-xs font-bold text-emerald-700 hover:text-emerald-800 flex items-center gap-1"
              >
                View Full Historical Session Breakdown <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}

'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { useMutation } from 'convex/react';
import { api } from '@/convex/_generated/api';
import { Loader2, Sparkles, User, BookOpen, Clock, Calendar, Zap } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { STAFF_MEMBERS } from '@/constants';

export default function UserInputDialog({ children, options, Setroomid, SetData }) {
  const [selectStaff, setSelectStaff] = useState(STAFF_MEMBERS[0]?.name || null);
  const [topic, setTopic] = useState('');
  const [duration, setDuration] = useState(15); // Dynamic duration in minutes
  const [meetingMode, setMeetingMode] = useState('instant'); // 'instant' | 'scheduled'
  const [scheduledDateTime, setScheduledDateTime] = useState('');
  const [loading, setLoading] = useState(false);
  const [openDialogue, setOpenDialogue] = useState(false);
  const createDiscussionRoom = useMutation(api.DicussRoom.CreaatedRoom);

  const durationOptions = [
    { label: '15 Mins', value: 15, tag: 'Quick' },
    { label: '30 Mins', value: 30, tag: 'Standard' },
    { label: '45 Mins', value: 45, tag: 'Deep Dive' },
    { label: '60 Mins', value: 60, tag: 'Full Mock' },
  ];

  const handleNext = async () => {
    if (!topic.trim() || !selectStaff) return;
    setLoading(true);
    try {
      const isScheduled = meetingMode === 'scheduled' && !!scheduledDateTime;
      const scheduledTimestamp = isScheduled ? new Date(scheduledDateTime).getTime() : undefined;

      const res = await createDiscussionRoom({
        topic: topic.trim(),
        coachingOption: options?.name,
        Mentor: selectStaff,
        duration: Number(duration),
        isScheduled: isScheduled,
        scheduledFor: scheduledTimestamp,
      });

      Setroomid(res);
      SetData(selectStaff);
      setOpenDialogue(false);
    } catch (err) {
      console.error('Failed to create discussion room:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={openDialogue} onOpenChange={setOpenDialogue}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-xl p-0 overflow-hidden rounded-3xl border border-slate-200 shadow-2xl bg-white max-h-[92vh] flex flex-col">
        {/* Header Ribbon */}
        <div className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 px-6 py-6 text-white shrink-0">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-white/20 backdrop-blur-md text-xs font-medium text-white/95 mb-2">
            <Sparkles className="w-3 h-3 text-amber-300" /> Dynamic Meeting Setup
          </div>
          <DialogTitle className="text-2xl font-bold tracking-tight text-white">
            {options?.name}
          </DialogTitle>
          <p className="text-xs sm:text-sm text-white/80 mt-1">
            Configure your instant live call or schedule a future mock interview session.
          </p>
        </div>

        <DialogHeader className="sr-only">
          <DialogTitle>{options?.name}</DialogTitle>
          <DialogDescription>Configure your coaching session</DialogDescription>
        </DialogHeader>

        <div className="p-6 space-y-5 overflow-y-auto flex-1">
          {/* Mode Switcher: Instant vs Schedule */}
          <div className="flex items-center p-1 bg-slate-100 rounded-2xl">
            <button
              type="button"
              onClick={() => setMeetingMode('instant')}
              className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                meetingMode === 'instant'
                  ? 'bg-white text-indigo-600 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Zap className="w-3.5 h-3.5" /> Start Instant Session
            </button>
            <button
              type="button"
              onClick={() => setMeetingMode('scheduled')}
              className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                meetingMode === 'scheduled'
                  ? 'bg-white text-indigo-600 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Calendar className="w-3.5 h-3.5" /> Schedule Session
            </button>
          </div>

          {/* Schedule Date & Time Picker (if scheduled mode) */}
          {meetingMode === 'scheduled' && (
            <div className="p-4 rounded-2xl bg-indigo-50/60 border border-indigo-100 space-y-2 animate-in fade-in duration-200">
              <label className="text-xs font-bold uppercase tracking-wider text-indigo-900 flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-indigo-600" />
                Select Date & Time
              </label>
              <input
                type="datetime-local"
                value={scheduledDateTime}
                onChange={(e) => setScheduledDateTime(e.target.value)}
                min={new Date().toISOString().slice(0, 16)}
                className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
              />
              <p className="text-[11px] text-indigo-600">
                A reminder notification will be triggered in your notifications drawer.
              </p>
            </div>
          )}

          {/* Topic Input */}
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
              <BookOpen className="w-3.5 h-3.5 text-indigo-600" />
              1. Learning / Interview Topic
            </label>
            <Textarea
              placeholder="e.g. Java Concurrency, System Design of Netflix, Behavioral Star Method, React Hooks..."
              className="resize-none h-20 rounded-2xl border-slate-200 focus:border-indigo-500 focus:ring-indigo-500/20 text-sm p-3.5"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
            />
          </div>

          {/* Dynamic Duration Selection */}
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-indigo-600" />
              2. Session Duration
            </label>
            <div className="grid grid-cols-4 gap-2">
              {durationOptions.map((opt) => {
                const isSelected = duration === opt.value;
                return (
                  <button
                    type="button"
                    key={opt.value}
                    onClick={() => setDuration(opt.value)}
                    className={`py-2 px-2 rounded-xl border text-center transition-all cursor-pointer ${
                      isSelected
                        ? 'border-indigo-600 bg-indigo-50/80 ring-2 ring-indigo-500/20 shadow-xs'
                        : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                    }`}
                  >
                    <div className="text-xs font-bold text-slate-900">{opt.label}</div>
                    <div className="text-[10px] text-slate-500">{opt.tag}</div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Mentor Selection */}
          <div className="space-y-3">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
              <User className="w-3.5 h-3.5 text-indigo-600" />
              3. Select Your AI Coach
            </label>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {STAFF_MEMBERS.map((item) => {
                const isSelected = selectStaff === item.name;
                return (
                  <div
                    key={item.name}
                    onClick={() => setSelectStaff(item.name)}
                    className={`relative p-3 rounded-2xl border transition-all cursor-pointer flex flex-col items-center text-center gap-2 ${
                      isSelected
                        ? 'border-indigo-500 bg-indigo-50/50 shadow-sm ring-2 ring-indigo-500/20'
                        : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50/60'
                    }`}
                  >
                    <div className="relative w-14 h-14 rounded-xl overflow-hidden bg-white border border-slate-200/80 p-0.5">
                      <Image
                        src={item.pic}
                        alt={item.name}
                        width={56}
                        height={56}
                        className="w-full h-full object-cover rounded-lg"
                      />
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-slate-900">{item.name}</h4>
                      <p className="text-[10px] text-slate-400 capitalize">{item.gender} Voice</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
            <DialogClose asChild>
              <Button variant="ghost" className="rounded-xl text-slate-600 hover:bg-slate-100">
                Cancel
              </Button>
            </DialogClose>

            <Button
              disabled={
                !topic.trim() || 
                !selectStaff || 
                loading || 
                (meetingMode === 'scheduled' && !scheduledDateTime)
              }
              onClick={handleNext}
              className="rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-semibold shadow-md px-6"
            >
              {loading && <Loader2 className="animate-spin mr-2 h-4 w-4" />}
              {meetingMode === 'scheduled' ? 'Schedule Meeting' : 'Create Meeting'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export const staff = STAFF_MEMBERS;

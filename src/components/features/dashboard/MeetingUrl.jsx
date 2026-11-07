'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useQuery } from 'convex/react';
import { api } from '@/convex/_generated/api';
import { Button } from '@/components/ui/button';
import { STAFF_MEMBERS } from '@/constants';
import { Copy, Check, Clock, Radio, ArrowRight, ShieldCheck, Hourglass } from 'lucide-react';

export default function MeetingUrl({ roomId, meetingData }) {
  const [meetingUrl, setMeetingUrl] = useState('');
  const [copied, setCopied] = useState(false);
  const [timeLeft, setTimeLeft] = useState(900); // Default to 15m (900s)
  const [currentTime, setCurrentTime] = useState('');
  const [isVisible, setIsVisible] = useState(false);

  const data = useQuery(
    api.DicussRoom.GetDiscussionInfo,
    roomId ? { id: roomId } : 'skip'
  );

  const mentorInfo = STAFF_MEMBERS.find((s) => s.name === data?.Mentor);

  // Sync timer with Convex dynamic expiresAt / duration
  useEffect(() => {
    if (!roomId) return;
    setIsVisible(true);
    const url = `${window.location.origin}/dashboard/discussion-room/${roomId}`;
    setMeetingUrl(url);

    if (data?.expiresAt) {
      const remainingSeconds = Math.max(0, Math.floor((data.expiresAt - Date.now()) / 1000));
      setTimeLeft(remainingSeconds);
    } else if (data?.duration) {
      setTimeLeft(data.duration * 60);
    }
  }, [roomId, data?.expiresAt, data?.duration]);

  useEffect(() => {
    if (!isVisible) return;
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          setIsVisible(false);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isVisible]);

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setCurrentTime(
        now.toLocaleTimeString('en-US', {
          hour: '2-digit',
          minute: '2-digit',
        })
      );
    };

    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  const handleCopy = async () => {
    if (!meetingUrl) return;
    await navigator.clipboard.writeText(meetingUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2200);
  };

  if (!isVisible) return null;

  const minutes = String(Math.floor(timeLeft / 60)).padStart(2, '0');
  const seconds = String(timeLeft % 60).padStart(2, '0');

  return (
    <div className="mt-8 relative overflow-hidden rounded-3xl border border-indigo-200/80 bg-gradient-to-br from-white via-indigo-50/30 to-purple-50/20 p-6 md:p-7 shadow-lg shadow-indigo-100/50 transition-all animate-in fade-in zoom-in-95 duration-300">
      {/* Decorative top accent badge */}
      <div className="absolute top-0 right-0 transform translate-x-4 -translate-y-4 w-32 h-32 bg-indigo-500/5 rounded-full blur-2xl pointer-events-none" />

      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        {/* Left: Mentor avatar & details */}
        <div className="flex items-start sm:items-center gap-4">
          <div className="relative shrink-0">
            <div className="relative w-16 h-16 sm:w-20 sm:h-20 rounded-2xl overflow-hidden border-2 border-indigo-300 shadow-md bg-white p-1">
              {mentorInfo?.pic && (
                <Image
                  src={mentorInfo.pic}
                  alt={mentorInfo?.name || 'Mentor'}
                  width={80}
                  height={80}
                  className="w-full h-full object-cover rounded-xl"
                />
              )}
            </div>
            {/* Live pulsing indicator */}
            <span className="absolute -top-1 -right-1 flex h-4 w-4">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-4 w-4 bg-emerald-500 border-2 border-white" />
            </span>
          </div>

          <div className="space-y-1.5">
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                <Radio className="w-3 h-3 animate-pulse text-emerald-600" /> Session Active
              </span>
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-100 text-slate-600 border border-slate-200">
                <Clock className="w-3 h-3 text-slate-400" /> {currentTime}
              </span>
              {data?.duration && (
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-indigo-50 text-indigo-700 border border-indigo-200">
                  <Hourglass className="w-3 h-3 text-indigo-500" /> {data.duration} mins
                </span>
              )}
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-50 text-amber-700 border border-amber-200">
                Expires: {minutes}:{seconds}
              </span>
            </div>

            <h3 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
              Ready for your session with{' '}
              <span className="text-indigo-600">{data?.Mentor || 'Coach'}</span>
            </h3>

            <p className="text-xs sm:text-sm text-slate-600 flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-indigo-500" />
              Topic:{' '}
              <span className="font-semibold text-slate-800">
                {data?.topic || 'Interview preparation'}
              </span>
            </p>
          </div>
        </div>

        {/* Right: Join Room button */}
        <div className="flex shrink-0">
          <Link href={`/dashboard/discussion-room/${roomId}`} className="w-full sm:w-auto">
            <Button className="w-full sm:w-auto px-6 py-6 rounded-2xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-bold text-sm shadow-md hover:shadow-xl hover:scale-102 transition-all flex items-center justify-center gap-2">
              Join Discussion Room <ArrowRight className="w-4 h-4" />
            </Button>
          </Link>
        </div>
      </div>

      {/* Meeting URL bar with clean copy feedback */}
      <div className="mt-5 pt-4 border-t border-indigo-100/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <p className="text-xs text-slate-500 font-medium">
          Shareable Meeting Link:
        </p>

        <div className="flex items-center gap-2 flex-1 max-w-xl bg-white border border-slate-200 rounded-xl p-1.5 shadow-2xs">
          <span className="font-mono text-xs text-slate-700 px-3 truncate select-all flex-1">
            {meetingUrl}
          </span>

          <Button
            size="sm"
            onClick={handleCopy}
            className={`shrink-0 rounded-lg text-xs font-semibold px-3 py-1.5 transition-all ${
              copied
                ? 'bg-emerald-600 text-white hover:bg-emerald-600 shadow-xs'
                : 'bg-slate-100 hover:bg-indigo-50 text-slate-700 hover:text-indigo-700 border border-slate-200/80'
            }`}
          >
            {copied ? (
              <span className="flex items-center gap-1.5">
                <Check className="w-3.5 h-3.5" /> Copied!
              </span>
            ) : (
              <span className="flex items-center gap-1.5">
                <Copy className="w-3.5 h-3.5" /> Copy Link
              </span>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}

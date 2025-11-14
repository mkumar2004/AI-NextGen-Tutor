'use client'
import React, { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Copy, Link2 } from 'lucide-react'

function MeetingUrl({ roomId, meetingData }) {
  const [meetingUrl, setMeetingUrl] = useState("");
  const [copied, setCopied] = useState(false);
  const [timeLeft, setTimeLeft] = useState(1 * 60); // 1 minute (change to 10 * 60 later)
  const [currentTime, setCurrentTime] = useState("");
  const [isVisible, setIsVisible] = useState(true); 

  useEffect(() => {
    if (roomId) {
      const url = `${window.location.origin}/dashboard/discussion-room/${roomId}`;
      setMeetingUrl(url);
    }

    // Countdown Timer
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          setIsVisible(false); // 👈 auto-hide card
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    // Live System Time
    const clock = setInterval(() => {
      const now = new Date();
      const formatted = now.toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
      });
      setCurrentTime(formatted);
    }, 1000);

    return () => {
      clearInterval(timer);
      clearInterval(clock);
    };
  }, [roomId]);

  // Format time MM:SS
  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  };

  const handleCopy = async () => {
    if (!meetingUrl) return;
    await navigator.clipboard.writeText(meetingUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (!roomId || !isVisible) return null; // 👈 auto hide when expired

  return (
    <div className="p-6 mt-6 rounded-2xl shadow-xl border bg-white/70 backdrop-blur-md">

      {/* Header Row */}
      <div className="flex items-start justify-between w-full">

        {/* Left: Title */}
        <h2 className="text-xl font-semibold flex items-center gap-2 text-indigo-700">
          <Link2 size={22} className="text-indigo-600" />
          Meeting With {meetingData}
        </h2>

        {/* Right: Time + Countdown */}
        <div className="flex flex-col items-end">

          <div className="bg-gray-200 text-gray-800 px-4 py-1 rounded-full text-sm font-semibold shadow-sm mb-1">
            🕒 {currentTime}
          </div>

          <p className="text-sm font-semibold text-red-600">
            Expires in: {formatTime(timeLeft)}
          </p>
        </div>
      </div>

      {/* Description */}
      <p className="text-gray-600 mb-2">
        Click this link to join the meeting:
      </p>

      {/* Meeting URL Box */}
      <div className="bg-gradient-to-r from-indigo-500 to-purple-600 p-[2px] rounded-xl shadow-lg">
        <div className="flex items-center justify-between gap-3 p-3 rounded-xl bg-white/20 backdrop-blur-lg border border-white/30">

          <span className="font-mono text-sm text-white truncate">
            {meetingUrl}
          </span>

          <Button
            size="sm"
            onClick={handleCopy}
            className="flex gap-2 bg-white/20 hover:bg-white/30 backdrop-blur-md text-white border border-white/40"
          >
            <Copy size={16} />
            {copied ? "Copied!" : "Copy"}
          </Button>
        </div>
      </div>
    </div>
  );
}

export default MeetingUrl;

'use client'
import React, { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Copy, Link2 } from 'lucide-react'
import { api } from '@/convex/_generated/api';
import { useMutation, useQuery } from 'convex/react';
import { staff } from './UserInputDialong';

function MeetingUrl({ roomId, meetingData }) {
  const [meetingUrl, setMeetingUrl] = useState("");
  const [copied, setCopied] = useState(false);
  const [timeLeft, setTimeLeft] = useState(720); 
  const [currentTime, setCurrentTime] = useState("");
  const [isVisible, setIsVisible] = useState(false);
 
  const data = useQuery(
    api.DicussRoom.GetDiscussionInfo,
    roomId ? { id: roomId } : "skip"
  );
   const user = staff.find((s)=>s.name == data?.Mentor)

  useEffect(() => {
    if (!roomId) return;

    // Reset meeting UI
    setIsVisible(true);
    setTimeLeft(720);

    const url = `${window.location.origin}/dashboard/discussion-room/${roomId}`;
    setMeetingUrl(url);

  }, [roomId]); 


  useEffect(() => {
    if (!isVisible) return;

    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          setIsVisible(false); // Meeting expired
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isVisible]);

  
  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date();
      setCurrentTime(
        now.toLocaleTimeString('en-US', {
          hour: '2-digit',
          minute: '2-digit',
        })
      );
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  
  const handleCopy = async () => {
    if (!meetingUrl) return;
    await navigator.clipboard.writeText(meetingUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  
  if (!isVisible) return null;

 return (
  <div className="p-6 mt-6 rounded-2xl shadow-xl border bg-white/40 backdrop-blur-xl w-full 
                  animate-fadeSlide">

    <div className="flex flex-col md:flex-row md:items-center gap-6 w-full">

      {/* Image Animation */}
      <div className="w-full md:w-auto flex justify-center md:justify-start 
                      animate-scalePop">
        <img
          src={user?.pic}
          alt={user?.name}
          className="w-28 h-28 md:w-24 md:h-24 rounded-2xl object-cover 
                     shadow-lg border border-indigo-300"
        />
      </div>

      {/* Right Section */}
      <div className="flex-1 w-full space-y-3 animate-slideUp delay-150">

        {/* Title */}
        <h2 className="text-xl md:text-2xl font-bold bg-gradient-to-r 
                       from-indigo-600 to-purple-600 bg-clip-text text-transparent drop-shadow">
          Meeting With {data?.Mentor}
        </h2>

        {/* Time + Expire */}
        <div className="flex flex-wrap items-center gap-3 md:gap-4">
          <span className="bg-gradient-to-r from-indigo-400/60 to-purple-400/60
                           text-white px-3 py-1 rounded-full text-sm shadow">
            🕒 {currentTime}
          </span>

          <span className="text-red-600 text-sm font-bold">
            Expires in: {String(Math.floor(timeLeft / 60)).padStart(2, '0')}:
            {String(timeLeft % 60).padStart(2, '0')}
          </span>
        </div>

        <p className="text-gray-700 text-sm">Click the link to join:</p>

        {/* URL Box */}
        <div className="rounded-xl p-[2px] bg-gradient-to-r from-indigo-500 to-purple-600 
                        shadow-md shadow-purple-300/40 w-full animate-growIn delay-200">
          <div className="flex items-center gap-3 justify-between bg-white/20 backdrop-blur-lg 
                          px-4 py-3 rounded-xl border border-white/30 w-full">

            <span className="font-mono text-[12px] md:text-sm text-white truncate w-full md:w-auto">
              {meetingUrl}
            </span>

            <Button
              size="sm"
              onClick={handleCopy}
              className="shrink-0 bg-white/30 hover:bg-white/50 backdrop-blur-md 
                         text-indigo-900 font-semibold border border-white/40 shadow">
              {copied ? "Copied!" : "Copy"}
            </Button>

          </div>
        </div>

      </div>
    </div>
  </div>
);




}

export default MeetingUrl;

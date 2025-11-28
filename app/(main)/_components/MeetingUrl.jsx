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
  <div className="p-4  rounded-xl shadow-md border bg-white/50 backdrop-blur-md w-full">
    <div className="flex flex-col md:flex-row md:items-center gap-4 w-full">
      
      {/* Image */}
      <div className="w-full md:w-auto flex justify-center md:justify-start">
        <img
          src={user?.pic}
          alt={user?.name}
          className="w-16 h-16 md:w-18 md:h-18 rounded-xl object-cover shadow border border-indigo-200"
        />
      </div>

      {/* Right Section */}
      <div className="flex-1 w-full space-y-2">
        
        {/* Title */}
        <h2 className="text-lg md:text-xl font-semibold bg-gradient-to-r 
                       from-indigo-600 to-purple-600 bg-clip-text text-transparent">
          Meeting With {data?.Mentor}
        </h2>

        {/* Time + Expire */}
        <div className="flex flex-wrap items-center gap-2">
          <span className="bg-indigo-400/60 text-white px-2 py-[2px] rounded-full text-xs">
            🕒 {currentTime}
          </span>

          <span className="text-red-600 text-xs font-bold">
            Expires in: {String(Math.floor(timeLeft / 60)).padStart(2, '0')}:
            {String(timeLeft % 60).padStart(2, '0')}
          </span>
        </div>

        <p className="text-gray-700 text-xs">Click the link to join:</p>

        {/* URL Box */}
        <div className="rounded-lg p-[1.5px] bg-gradient-to-r from-indigo-500 to-purple-500 shadow-sm w-full">
          <div className="flex items-center gap-2 justify-between bg-white/20 backdrop-blur-lg px-3 py-2 rounded-lg border border-white/20">
            <span className="font-mono text-[10px] md:text-xs text-white truncate w-full">
              {meetingUrl}
            </span>

            <Button
              size="sm"
              onClick={handleCopy}
              className="shrink-0 bg-white/30 hover:bg-white/50 text-indigo-900 border border-white/40"
            >
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

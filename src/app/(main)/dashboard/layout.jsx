"use client";

import React from 'react';
import { usePathname } from 'next/navigation';
import AppHeader from '@/components/layout/AppHeader';
import AppSidebar from '@/components/layout/AppSidebar';

export default function DashboardLayout({ children }) {
  const pathname = usePathname();
  const isDiscussionRoom = pathname?.includes('/discussion-room');

  // If in discussion room, provide a clean, focused, full-width session workspace without the dashboard sidebar
  if (isDiscussionRoom) {
    return (
      <div className="h-screen flex flex-col bg-[#f8faff] text-slate-900 antialiased overflow-hidden selection:bg-indigo-500/10 selection:text-indigo-600">
        <AppHeader />
        <main className="flex-1 w-full max-w-[1700px] mx-auto px-3 sm:px-6 py-4 overflow-y-auto">
          {children}
        </main>
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col bg-[#f8faff] text-slate-900 antialiased overflow-hidden selection:bg-indigo-500/10 selection:text-indigo-600">
      <AppHeader />
      <div className="flex-1 flex w-full overflow-hidden">
        <AppSidebar />
        {/* Right panel scrolls independently with the slim custom scrollbar */}
        <main className="flex-1 px-4 sm:px-8 py-8 w-full max-w-[1550px] overflow-y-auto min-h-0">
          {children}
        </main>
      </div>
    </div>
  );
}

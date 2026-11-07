import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { UserButton } from '@stackframe/stack';
import { Sparkles } from 'lucide-react';
import NotificationDrawer from './NotificationDrawer';

export default function AppHeader() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-slate-200/80 bg-white/80 backdrop-blur-md transition-all">
      <div className="w-full px-4 sm:px-8 h-16 flex items-center justify-between">
        {/* Left: Branding aligned to the far left corner */}
        <div className="flex items-center gap-3">
          <Link href="/dashboard" className="flex items-center gap-3 group">
            <div className="relative flex items-center justify-center px-3 py-1.5 rounded-2xl bg-gradient-to-r from-amber-50/60 via-orange-50/40 to-pink-50/50 border border-slate-200/80 shadow-2xs group-hover:scale-102 transition-transform">
              <Image
                src="/homeicon.svg"
                alt="NextGen Tutor Logo"
                width={160}
                height={36}
                priority
                className="h-7 w-auto object-contain"
              />
            </div>
          </Link>

          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-indigo-50/80 text-indigo-700 border border-indigo-100/80 shadow-2xs">
            <Sparkles className="w-3.5 h-3.5 text-indigo-500" /> AI Workspace
          </span>
        </div>

        {/* Right: Notification Bell + User Profile Avatar */}
        <div className="flex items-center gap-3 sm:gap-4">
          <NotificationDrawer />

          <div className="flex items-center justify-center rounded-full p-0.5 bg-slate-50 border border-slate-200/90 shadow-xs hover:shadow-sm transition-all overflow-hidden [&_.stack-user-avatar]:rounded-full [&_img]:rounded-full">
            <UserButton />
          </div>
        </div>
      </div>
    </header>
  );
}

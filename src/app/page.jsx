"use client";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { UserButton } from "@stackframe/stack";
import { useEffect, useState } from "react";
import Image from "next/image";
import { 
  Sparkles, 
  ArrowRight, 
  Play, 
  Target, 
  BrainCircuit, 
  TrendingUp, 
  Mic, 
  CheckCircle2, 
  ShieldCheck,
  Bot
} from "lucide-react";

export default function Home() {
  const router = useRouter();
  const [cursorPos, setCursorPos] = useState({ x: -100, y: -100 });
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const move = (e) => setCursorPos({ x: e.clientX, y: e.clientY });
    window.addEventListener("mousemove", move);
    return () => window.removeEventListener("mousemove", move);
  }, []);

  const handleNavigate = () => {
    router.push("/dashboard");
  };

  return (
    <div className="min-h-screen w-full relative overflow-x-hidden bg-[#030712] text-white selection:bg-purple-500/30 selection:text-purple-200">
      
      {/* Interactive Cursor Glow */}
      {mounted && (
        <div
          className="pointer-events-none fixed w-[500px] h-[500px] rounded-full blur-[120px] opacity-25 transition-all duration-300 z-0"
          style={{
            background:
              "radial-gradient(circle, rgba(99,102,241,0.6) 0%, rgba(168,85,247,0.3) 40%, transparent 70%)",
            left: cursorPos.x - 250,
            top: cursorPos.y - 250,
          }}
        />
      )}

      {/* Atmospheric Ambient Lighting / Gradients */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[450px] bg-gradient-to-b from-indigo-600/15 via-purple-600/10 to-transparent blur-3xl pointer-events-none" />
      <div className="absolute top-20 -left-40 w-96 h-96 bg-blue-600/15 rounded-full blur-[140px] pointer-events-none animate-float" />
      <div className="absolute top-40 -right-40 w-96 h-96 bg-fuchsia-600/15 rounded-full blur-[140px] pointer-events-none animate-float2" />
      <div className="absolute bottom-10 left-1/3 w-[500px] h-[300px] bg-cyan-500/10 rounded-full blur-[140px] pointer-events-none animate-float3" />

      {/* Subtle Grid Backdrop */}
      <div 
        className="absolute inset-0 pointer-events-none opacity-20 [mask-image:radial-gradient(ellipse_at_center,black_30%,transparent_75%)]"
        style={{
          backgroundImage: `linear-gradient(rgba(255, 255, 255, 0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(255, 255, 255, 0.05) 1px, transparent 1px)`,
          backgroundSize: "64px 64px"
        }}
      />

      {/* FLOATING GLASS NAVIGATION BAR */}
      <header className="fixed top-5 left-1/2 -translate-x-1/2 z-50 w-[92%] max-w-5xl">
        <nav className="flex items-center justify-between px-4 sm:px-6 py-2.5 sm:py-3 rounded-full bg-slate-900/60 backdrop-blur-2xl border border-white/10 shadow-[0_8px_32px_0_rgba(0,0,0,0.36)] transition-all">
          
          {/* Logo & Brand */}
          <div 
            onClick={handleNavigate}
            className="flex items-center gap-2.5 cursor-pointer group"
          >
            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-indigo-500 via-purple-500 to-pink-500 p-[1.5px] shadow-sm shadow-indigo-500/50 group-hover:scale-105 transition-transform">
              <div className="w-full h-full rounded-full bg-[#030712] flex items-center justify-center">
                <Image 
                  src="/homeicon.svg" 
                  alt="NextGen Tutor" 
                  width={18} 
                  height={18} 
                  className="rounded-full"
                />
              </div>
            </div>
            <span className="font-bold tracking-tight text-sm sm:text-base bg-clip-text text-transparent bg-gradient-to-r from-white via-slate-100 to-slate-400">
              NextGen Tutor
            </span>
          </div>

          {/* Center Navigation Links (Hidden on mobile) */}
          <div className="hidden md:flex items-center gap-7 text-xs sm:text-sm font-medium text-slate-300">
            <span onClick={handleNavigate} className="cursor-pointer hover:text-white transition-colors">
              Features
            </span>
            <span onClick={handleNavigate} className="cursor-pointer hover:text-white transition-colors">
              Coaching Tracks
            </span>
            <span onClick={handleNavigate} className="cursor-pointer hover:text-white transition-colors">
              Feedback Engine
            </span>
            <span onClick={handleNavigate} className="cursor-pointer hover:text-white transition-colors">
              Analytics
            </span>
          </div>

          {/* Right Action Cluster */}
          <div className="flex items-center gap-2.5 sm:gap-3">
            {/* GitHub Link */}
            <a
              href="https://github.com/mkumar2004/AI-NextGen-Tutor"
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/[0.06] hover:bg-white/[0.12] border border-white/10 text-xs sm:text-sm text-slate-200 transition-all duration-200 shadow-sm"
              title="View on GitHub"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="currentColor"
                viewBox="0 0 24 24"
                className="w-4 h-4 text-slate-200"
              >
                <path d="M12 .5C5.65.5.5 5.65.5 12c0 5.1 3.3 9.4 7.9 10.9.6.1.8-.3.8-.6v-2.2c-3.2.7-3.9-1.4-3.9-1.4-.5-1.2-1.2-1.6-1.2-1.6-1-.7.1-.7.1-.7 1.1.1 1.7 1.1 1.7 1.1 1 .1.6 1.9 2.8 1.9 1.2 0 2.1-.4 2.6-.9-2.5-.3-5.2-1.3-5.2-5.8 0-1.2.4-2.2 1.1-3-.1-.3-.5-1.5.1-3.1 0 0 .9-.3 2.9 1.1a9.3 9.3 0 0 1 5.2 0c2-1.4 2.9-1.1 2.9-1.1.6 1.6.2 2.8.1 3 .7.8 1.1 1.8 1.1 3 0 4.6-2.7 5.5-5.2 5.8.5.5.9 1.3.9 2.6v3.2c0 .3.2.7.8.6A10.9 10.9 0 0 0 23.5 12C23.5 5.65 18.35.5 12 .5Z" />
              </svg>
              <span className="hidden sm:inline font-medium">Star</span>
            </a>

            {/* Stack Auth User Button */}
            <div className="flex items-center">
              <UserButton />
            </div>
          </div>
        </nav>
      </header>

      {/* HERO SECTION */}
      <main className="relative z-10 pt-36 sm:pt-44 md:pt-48 pb-20 px-4 sm:px-6 max-w-5xl mx-auto flex flex-col items-center text-center">
        
        {/* Pill Badge (Inspired by Nexora) */}
        <div 
          onClick={handleNavigate}
          className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-gradient-to-r from-indigo-500/10 via-purple-500/10 to-pink-500/10 border border-purple-500/30 text-purple-300 text-xs sm:text-sm font-medium mb-8 cursor-pointer hover:border-purple-500/60 transition-all shadow-[0_0_20px_rgba(168,85,247,0.15)] group"
        >
          <Sparkles className="w-3.5 h-3.5 text-purple-400 group-hover:rotate-12 transition-transform" />
          <span className="tracking-wide">NEXT-GEN INTELLIGENCE LAYER</span>
          <span className="text-white/40">|</span>
          <span className="text-indigo-200">v2.0 Voice AI Live</span>
          <ArrowRight className="w-3 h-3 text-purple-400 group-hover:translate-x-0.5 transition-transform" />
        </div>

        {/* Primary Headline */}
        <h1 className="text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-black tracking-tight leading-[1.08] mb-6">
          <span className="block text-white">Automate complexity.</span>
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-indigo-400 to-fuchsia-400 drop-shadow-[0_0_40px_rgba(129,140,248,0.35)]">
            Scale exponentially.
          </span>
        </h1>

        {/* Supporting Subtitle */}
        <p className="text-slate-300 text-base sm:text-lg md:text-xl max-w-2xl mx-auto mb-10 leading-relaxed font-normal">
          NextGen Tutor powers real-time voice AI coaching, adaptive mock interviews, and granular scoring metrics to accelerate your tech career.
        </p>

        {/* Action CTAs */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 w-full sm:w-auto mb-16">
          <Button
            onClick={handleNavigate}
            className="w-full sm:w-auto h-12 px-7 rounded-xl bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 hover:from-indigo-500 hover:via-purple-500 hover:to-pink-500 text-white font-semibold text-sm sm:text-base shadow-[0_0_30px_rgba(168,85,247,0.4)] hover:shadow-[0_0_45px_rgba(168,85,247,0.65)] hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2 border border-white/20"
          >
            <span>Get Started Free</span>
            <ArrowRight className="w-4 h-4" />
          </Button>

          <Button
            onClick={handleNavigate}
            variant="outline"
            className="w-full sm:w-auto h-12 px-7 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] text-slate-200 hover:text-white border border-white/15 backdrop-blur-md font-medium text-sm sm:text-base hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2"
          >
            <Play className="w-4 h-4 text-purple-400 fill-purple-400/20" />
            <span>View Demo</span>
          </Button>
        </div>

        {/* Social Proof / Trust Indicators */}
        <div className="flex flex-wrap items-center justify-center gap-6 sm:gap-10 text-xs sm:text-sm text-slate-400 mb-16 border-y border-white/5 py-4 w-full max-w-3xl">
          <div className="flex items-center gap-2">
            <Mic className="w-4 h-4 text-indigo-400" />
            <span>Low-Latency Real-Time Voice</span>
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>AI Multi-Persona Mentors</span>
          </div>
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-purple-400" />
            <span>Automated Scoring & Transcripts</span>
          </div>
        </div>

        {/* FEATURE CARDS (3 Cards Redesigned) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 w-full max-w-4xl text-left">
          
          {/* Card 1: Real Scenarios */}
          <div 
            onClick={handleNavigate}
            className="group relative p-6 rounded-2xl bg-white/[0.03] hover:bg-white/[0.06] border border-white/10 hover:border-indigo-500/40 backdrop-blur-xl transition-all duration-300 hover:-translate-y-1 cursor-pointer flex flex-col justify-between overflow-hidden shadow-lg"
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/10 rounded-full blur-2xl group-hover:bg-indigo-500/20 transition-all pointer-events-none" />
            <div>
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-500/20 to-blue-500/10 border border-indigo-500/30 flex items-center justify-center mb-4 text-indigo-400 group-hover:scale-110 group-hover:text-indigo-300 transition-all shadow-[0_0_15px_rgba(99,102,241,0.2)]">
                <Target className="w-6 h-6" />
              </div>
              <h3 className="text-white font-semibold text-lg mb-1.5 flex items-center justify-between">
                <span>Real Scenarios</span>
                <span className="text-xs px-2 py-0.5 rounded-full bg-indigo-500/10 text-indigo-300 border border-indigo-500/20 font-mono">
                  Live
                </span>
              </h3>
              <p className="text-slate-400 text-sm leading-relaxed">
                Simulate role-specific technical exams, system design deep dives, and behavioral interview loops.
              </p>
            </div>
            <div className="mt-6 flex items-center text-xs font-semibold text-indigo-400 group-hover:text-indigo-300 gap-1.5">
              <span>Start session</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>

          {/* Card 2: AI Feedback */}
          <div 
            onClick={handleNavigate}
            className="group relative p-6 rounded-2xl bg-white/[0.03] hover:bg-white/[0.06] border border-white/10 hover:border-purple-500/40 backdrop-blur-xl transition-all duration-300 hover:-translate-y-1 cursor-pointer flex flex-col justify-between overflow-hidden shadow-lg"
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/10 rounded-full blur-2xl group-hover:bg-purple-500/20 transition-all pointer-events-none" />
            <div>
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500/20 to-pink-500/10 border border-purple-500/30 flex items-center justify-center mb-4 text-purple-400 group-hover:scale-110 group-hover:text-purple-300 transition-all shadow-[0_0_15px_rgba(168,85,247,0.2)]">
                <BrainCircuit className="w-6 h-6" />
              </div>
              <h3 className="text-white font-semibold text-lg mb-1.5 flex items-center justify-between">
                <span>AI Feedback</span>
                <span className="text-xs px-2 py-0.5 rounded-full bg-purple-500/10 text-purple-300 border border-purple-500/20 font-mono">
                  Gemini
                </span>
              </h3>
              <p className="text-slate-400 text-sm leading-relaxed">
                Instant actionable recommendations on technical clarity, speech confidence, and architectural depth.
              </p>
            </div>
            <div className="mt-6 flex items-center text-xs font-semibold text-purple-400 group-hover:text-purple-300 gap-1.5">
              <span>Explore analysis</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>

          {/* Card 3: Track Progress */}
          <div 
            onClick={handleNavigate}
            className="group relative p-6 rounded-2xl bg-white/[0.03] hover:bg-white/[0.06] border border-white/10 hover:border-pink-500/40 backdrop-blur-xl transition-all duration-300 hover:-translate-y-1 cursor-pointer flex flex-col justify-between overflow-hidden shadow-lg"
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-pink-500/10 rounded-full blur-2xl group-hover:bg-pink-500/20 transition-all pointer-events-none" />
            <div>
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-pink-500/20 to-rose-500/10 border border-pink-500/30 flex items-center justify-center mb-4 text-pink-400 group-hover:scale-110 group-hover:text-pink-300 transition-all shadow-[0_0_15px_rgba(244,63,94,0.2)]">
                <TrendingUp className="w-6 h-6" />
              </div>
              <h3 className="text-white font-semibold text-lg mb-1.5 flex items-center justify-between">
                <span>Track Progress</span>
                <span className="text-xs px-2 py-0.5 rounded-full bg-pink-500/10 text-pink-300 border border-pink-500/20 font-mono">
                  Metrics
                </span>
              </h3>
              <p className="text-slate-400 text-sm leading-relaxed">
                Monitor your score trajectories over time with session history, readiness indices, and meeting recaps.
              </p>
            </div>
            <div className="mt-6 flex items-center text-xs font-semibold text-pink-400 group-hover:text-pink-300 gap-1.5">
              <span>View readiness</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>

        </div>

      </main>

      {/* FOOTER */}
      <footer className="relative z-10 border-t border-white/5 py-8 text-center text-xs text-slate-500">
        <p>© {new Date().getFullYear()} NextGen Tutor • Next-Generation AI Career Coaching Platform</p>
      </footer>

    </div>
  );
}

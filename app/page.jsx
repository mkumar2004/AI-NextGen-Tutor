"use client";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { UserButton } from "@stackframe/stack";
import { useEffect, useState } from "react";

export default function Home() {
  const route = useRouter();
  const [cursorPos, setCursorPos] = useState({ x: 0, y: 0 });

  const HandleNewState = () => {
    route.push("/dashboard");
  };

  // Cursor glow effect
  useEffect(() => {
    const move = (e) => setCursorPos({ x: e.clientX, y: e.clientY });
    window.addEventListener("mousemove", move);
    return () => window.removeEventListener("mousemove", move);
  }, []);

  return (
    <div className="w-screen min-h-screen relative overflow-hidden bg-gradient-to-br from-[#020617] via-[#0b1625] to-[#111827]">

      {/* Cursor glow */}
      <div
        className="pointer-events-none fixed w-64 h-64 md:w-96 md:h-96 rounded-full blur-3xl opacity-40 transition-all duration-300"
        style={{
          background:
            "radial-gradient(circle, rgba(56,189,248,0.35), rgba(59,130,246,0.05))",
          left: cursorPos.x - 150,
          top: cursorPos.y - 150,
        }}
      />

      {/* Soft noise overlay */}
      <div className="absolute inset-0 opacity-[0.05] bg-[url('https://www.transparenttextures.com/patterns/asfalt-light.png')]"></div>

      {/* Floating orbs */}
      <div className="absolute top-10 left-10 w-60 h-60 md:w-[30rem] md:h-[30rem] bg-blue-700/20 blur-3xl rounded-full animate-float"></div>
      <div className="absolute bottom-20 right-10 w-56 h-56 md:w-[26rem] md:h-[26rem] bg-purple-700/20 blur-3xl rounded-full animate-float2"></div>
      <div className="absolute top-1/3 right-1/4 w-52 h-52 md:w-[22rem] md:h-[22rem] bg-cyan-500/20 blur-3xl rounded-full animate-float3"></div>

      {/* Grid mask */}
      <div className="absolute inset-0 
        bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)]
        bg-[size:60px_60px] md:bg-[size:80px_80px]
        opacity-20
        [mask-image:radial-gradient(circle_70%_70%_at_50%_50%,black,transparent)]
      "></div>

      {/* NAVBAR */}
      <nav className="w-[90%] md:w-full flex justify-between items-center px-4 md:px-8 py-3 md:py-4 fixed top-4 md:top-6 left-1/2 transform -translate-x-1/2 z-50 bg-white/5 backdrop-blur-xl rounded-full shadow-[0_0_40px_rgba(59,130,246,0.3)] border border-white/10 max-w-5xl">

        {/* GitHub Button */}
        <a
          href="https://github.com/mkumar2004/AI-NextGen-Tutor"
          target="_blank"
          rel="noreferrer"
          className="flex items-center gap-2 md:gap-3 px-4 py-2 rounded-full backdrop-blur-xl
                     bg-white/5 border border-white/10
                     shadow-[0_0_30px_rgba(59,130,246,0.4)]
                     hover:bg-white/10 hover:shadow-[0_0_60px_rgba(59,130,246,0.7)]
                     hover:scale-105 transition-all duration-300"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="white"
            viewBox="0 0 24 24"
            className="w-5 h-5 opacity-80"
          >
            <path d="M12 .5C5.65.5.5 5.65.5 12c0 5.1 3.3 9.4 7.9 10.9.6.1.8-.3.8-.6v-2.2c-3.2.7-3.9-1.4-3.9-1.4-.5-1.2-1.2-1.6-1.2-1.6-1-.7.1-.7.1-.7 1.1.1 1.7 1.1 1.7 1.1 1 .1.6 1.9 2.8 1.9 1.2 0 2.1-.4 2.6-.9-2.5-.3-5.2-1.3-5.2-5.8 0-1.2.4-2.2 1.1-3-.1-.3-.5-1.5.1-3.1 0 0 .9-.3 2.9 1.1a9.3 9.3 0 0 1 5.2 0c2-1.4 2.9-1.1 2.9-1.1.6 1.6.2 2.8.1 3 .7.8 1.1 1.8 1.1 3 0 4.6-2.7 5.5-5.2 5.8.5.5.9 1.3.9 2.6v3.2c0 .3.2.7.8.6A10.9 10.9 0 0 0 23.5 12C23.5 5.65 18.35.5 12 .5Z" />
          </svg>

          <span className="text-white font-medium tracking-wide text-sm md:text-base">
            GitHub
          </span>
        </a>

        <UserButton className="px-4 md:px-6 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-medium rounded-full shadow-[0_0_30px_rgba(59,130,246,0.5)] border border-blue-400/20 hover:scale-105 transition-all" />
      </nav>

      {/* MAIN CONTENT */}
      <div className="w-full pt-32 md:pt-48 pb-10 flex flex-col items-center justify-center px-6 text-center relative z-10">

        {/* RESPONSIVE TITLE */}
        <h1 className="text-4xl sm:text-5xl md:text-7xl lg:text-8xl font-extrabold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 drop-shadow-[0_0_40px_rgba(59,130,246,0.8)] animate-pulse leading-tight">
          NextGen Tutor
        </h1>

        {/* Line under heading */}
        <div className="w-32 md:w-48 h-1 bg-gradient-to-r from-transparent via-blue-500 to-transparent mb-8 shadow-[0_0_20px_rgba(59,130,246,0.8)]"></div>

        {/* Paragraph */}
        <p className="text-gray-300 text-base sm:text-lg md:text-xl max-w-xl md:max-w-2xl mb-10 leading-relaxed">
          Master your interview skills with{" "}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400 font-semibold">
            real-world scenarios
          </span>
          . Get personalized AI-powered feedback and ace your next opportunity.
        </p>

        {/* Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 mb-12">
          <Button
            
            className="relative bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold px-6 py-3 sm:px-8 sm:py-4 rounded-xl shadow-[0_0_40px_rgba(59,130,246,0.6)] hover:scale-105 transition-all"
          >
            Getting Started
          </Button>

          <Button 
            onClick={HandleNewState}
            className="bg-white/10 backdrop-blur-sm text-white font-semibold px-6 py-3 sm:px-8 sm:py-4 rounded-xl hover:bg-white/20 hover:scale-105 transition-all">
            Demo
          </Button>
        </div>

        {/* Features grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 max-w-4xl mt-4 px-4">

          <div className="p-6 bg-gradient-to-br from-blue-600/10 to-purple-600/10 rounded-2xl border border-blue-500/20 backdrop-blur-sm hover:border-blue-500/40 transition-all">
            <div className="text-4xl mb-3">🎯</div>
            <h3 className="text-white font-semibold mb-2">Real Scenarios</h3>
            <p className="text-gray-400 text-sm">Industry-specific questions.</p>
          </div>

          <div className="p-6 bg-gradient-to-br from-purple-600/10 to-pink-600/10 rounded-2xl border border-purple-500/20 backdrop-blur-sm hover:border-purple-500/40 transition-all">
            <div className="text-4xl mb-3 drop-shadow-[0_0_25px_rgba(168,85,247,0.8)]">
              🧠
            </div>
            <h3 className="text-white font-semibold mb-2">AI Feedback</h3>
            <p className="text-gray-400 text-sm">Instant improvement tips.</p>
          </div>


          <div className="p-6 bg-gradient-to-br from-pink-600/10 to-cyan-600/10 rounded-2xl border border-pink-500/20 backdrop-blur-sm hover:border-pink-500/40 transition-all">
            <div className="text-4xl mb-3">📈</div>
            <h3 className="text-white font-semibold mb-2">Track Progress</h3>
            <p className="text-gray-400 text-sm">Monitor your journey.</p>
          </div>

        </div>

      </div>
    </div>
  );
}

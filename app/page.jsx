"use client"
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { UserButton } from '@stackframe/stack'

export default function Home() {
  const route = useRouter();

  const HandleNewState = () => {
    route.push('/dashboard');
  }

  return (
    <div className="w-screen h-screen relative overflow-hidden bg-gradient-to-br from-[#0f172a] via-[#1e293b] to-[#334155]">

      {/* Navbar */}
      <nav className="w-full flex justify-between items-center px-8 py-4 fixed top-6 left-1/2 transform -translate-x-1/2 z-50 bg-white/10 backdrop-blur-xl rounded-full shadow-lg max-w-5xl transition-all animate-fadeInDown">
        
        {/* Left side - Logo / GitHub */}
        <a 
          href={process.env.GITHUB_URL}
          target="_blank" 
          rel="AI NextGen Tutor"
          className="flex items-center gap-3 px-4 py-2 bg-white/20 rounded-full hover:bg-white/30 transition-all shadow-sm animate-bounce"
        >
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            fill="currentColor" 
            viewBox="0 0 24 24" 
            className="w-5 h-5 text-white"
          >
            <path d="M12 0C5.372 0 0 5.373 0 12c0 5.303 3.438 9.8 8.205 11.387.6.11.82-.26.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61-.546-1.387-1.333-1.756-1.333-1.756-1.09-.745.083-.73.083-.73 1.205.085 1.838 1.237 1.838 1.237 1.07 1.834 2.807 1.304 3.492.997.108-.775.418-1.304.76-1.604-2.665-.303-5.467-1.335-5.467-5.933 0-1.31.467-2.382 1.236-3.222-.124-.303-.536-1.523.117-3.176 0 0 1.008-.322 3.3 1.23a11.495 11.495 0 013.003-.404c1.02.005 2.047.138 3.003.404 2.29-1.552 3.296-1.23 3.296-1.23.655 1.653.243 2.873.12 3.176.77.84 1.235 1.912 1.235 3.222 0 4.61-2.807 5.625-5.48 5.922.43.37.814 1.096.814 2.21 0 1.595-.015 2.882-.015 3.273 0 .32.216.694.825.576C20.565 21.796 24 17.3 24 12c0-6.627-5.373-12-12-12z"/>
          </svg>
          <span className="text-white font-medium">GitHub</span>
        </a>

        {/* Right side - User Auth */}
        <UserButton className="px-6 py-2 bg-white text-blue-600 font-medium rounded-full shadow-md hover:scale-105 transition-transform animate-pulse" />
      </nav>

      {/* Background shapes with float animation */}
      <div className="absolute top-0 left-0 w-72 h-72 bg-blue-600/20 rounded-full blur-3xl animate-[pulse_8s_ease-in-out_infinite] animate-bounce-slow"></div>
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl animate-[pulse_10s_ease-in-out_infinite] animate-bounce-slow"></div>

      {/* Main content */}
      <div className="w-full h-full flex flex-col items-center justify-center px-6 text-center">
        <h1 className="text-6xl md:text-7xl font-extrabold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-blue-500 to-blue-600 drop-shadow-[0_0_25px_rgba(59,130,246,0.7)] animate-fadeInUp">
          NextGen Tutor
        </h1>

        <p className="text-blue-200 text-lg md:text-xl max-w-2xl mb-10 drop-shadow-sm animate-fadeInUp animate-delay-500">
          Master your interview skills with real-world scenarios. Get personalized AI-powered feedback and ace your next opportunity.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 animate-fadeInUp animate-delay-700">
          <Button 
            onClick={HandleNewState}
            className="bg-blue-500 text-white font-semibold px-6 py-3 rounded-lg shadow-lg hover:bg-blue-600 hover:scale-105 transition-transform animate-bounce"
          >
            Start Practicing
          </Button>

          <Button className="bg-white text-gray-800 font-semibold px-6 py-3 rounded-lg shadow-lg hover:bg-gray-200 hover:scale-105 transition-transform animate-bounce">
            Watch Demo
          </Button>
        </div>
      </div>
    </div>
  );
}

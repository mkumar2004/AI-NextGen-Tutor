// "use client";
// import { api } from '@/convex/_generated/api';
// import { useQuery } from 'convex/react';
// import { useParams } from 'next/navigation';
// import React, { useEffect, useRef, useState } from 'react';
// import { staff } from '@/app/(main)/_components/UserInputDialong';
// import Image from 'next/image';
// import { UserButton } from '@stackframe/stack';
// import { Button } from '@/components/ui/button';
// import { AiModel } from '@/Services/GlobalService';

// function DiscussionRoom() {
//   const { roomid } = useParams();
//   const Discussiondata = useQuery(api.DicussRoom.GetDiscussionInfo, { id: roomid });
//   const [expert, setExpert] = useState();
//   const [enablemic, setEnableMic] = useState(false);
//   const [transcript, setTranscript] = useState('');
//   const [interimText, setInterimText] = useState('');
//   const recognitionRef = useRef(null);

//   useEffect(() => {
//     if (Discussiondata) {
//       const data = staff.find(item => item.name === Discussiondata.Mentor);
//       setExpert(data);
//     }
//   }, [Discussiondata]);

//   const ConnectToServer = async () => {
//     try {
//       const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
//       if (!SpeechRecognition) {
//         alert('Speech recognition not supported in this browser.');
//         return;
//       }

//       setEnableMic(true);
//       setTranscript('');

      
//       setInterimText('');

//       const recognition = new SpeechRecognition();
//       recognitionRef.current = recognition;
//       recognition.continuous = true;
//       recognition.interimResults = true;
//       recognition.lang = 'en-US';

//       recognition.onresult = (event) => {
//         let interim = '';
//         let final = '';
//         for (let i = event.resultIndex; i < event.results.length; i++) {
//           const text = event.results[i][0].transcript;
//           if (event.results[i].isFinal) final += text + ' ';
//           else interim += text;
//         }
//         if (final) setTranscript(prev => prev + final);
//         if (interim) setInterimText(interim);

        
//       };

//       recognition.onerror = (event) => {
//         console.error('Speech error:', event.error);
//         if (event.error !== 'no-speech') {
//           alert('Error: ' + event.error);
//           setEnableMic(false);
//         }
//       };

//       recognition.onend = () => {
//         if (enablemic) recognition.start();
//       };

//       recognition.start();
//       console.log('🎙️ Speech recognition started');

//       setTimeout(async () => {
//         const aiResponse = await Aimodle(
//           Discussiondata.topic,
//           Discussiondata.coachingOption,
//           transcript
//         );
//         console.log('AI Response:', aiResponse);
        
//       }, 2000);

//     } catch (error) {
//       console.error('Failed to start:', error);
//       alert('Failed to start: ' + error.message);
//       setEnableMic(false);
//     }
//   };

//   const Disconnected = (e) => {
//     e.preventDefault();
//     if (recognitionRef.current) {
//       recognitionRef.current.stop();
//       recognitionRef.current = null;
//     }
//     setEnableMic(false);
//     setInterimText('');
//     console.log('✅ Stopped');
//   };

//   return (
//     <div>
//       <h2 className='text-lg font-bold'>{Discussiondata?.coachingOption}</h2>
//       <div className='mt-5 grid grid-cols-1 lg:grid-cols-3 gap-10'>
//         <div className='lg:col-span-2'>
//           <div className='h-[60vh] bg-gray-100 rounded-4xl border flex flex-col justify-center items-center relative'>
//             {expert?.pic && (
//               <Image
//                 src={expert.pic}
//                 height={200}
//                 width={200}
//                 alt={expert?.name || "Expert"}
//                 className="w-[80px] h-[80px] object-cover rounded-full animate-pulse"
//               />
//             )}
//             <h2 className='font-extralight text-gray-500'>{expert?.name}</h2>
//             <div className='bg-gray-200 px-10 py-5 rounded-lg absolute bottom-10 right-10'>
//               <UserButton />
//             </div>
//           </div>

//           <div className='mt-5 flex flex-col items-center gap-2'>
//             {!enablemic ? (
//               <Button onClick={ConnectToServer}>🎤 Connect</Button>
//             ) : (
//               <Button onClick={Disconnected} variant='destructive'>⏹️ Stop</Button>
//             )}
//           </div>
//         </div>

//         <div className='h-[60vh] bg-gray-100 rounded-4xl border flex flex-col overflow-hidden'>
//           <div className='p-5 border-b bg-white flex justify-between items-center'>
//             <h2 className='font-bold'>Live Transcript</h2>
//             {enablemic && (
//               <span className='text-xs bg-red-100 text-red-600 px-2 py-1 rounded-full'>
//                 🔴 LIVE
//               </span>
//             )}
//           </div>

//           <div className='flex-1 p-5 overflow-auto'>
//             {transcript && (
//               <p className='text-base text-gray-900 leading-relaxed whitespace-pre-wrap'>
//                 {transcript}
//               </p>
//             )}
//             {interimText && (
//               <p className='text-base text-blue-600 italic leading-relaxed'>
//                 {interimText}
//               </p>
//             )}
//             {!transcript && !interimText && (
//               <p className='text-sm text-gray-400'>
//                 {enablemic ? 'Speak now...' : 'Click Start to begin'}
//               </p>
//             )}
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }

// export default DiscussionRoom;



// "use client";
// import { api } from '@/convex/_generated/api';
// import { useQuery } from 'convex/react';
// import { useParams } from 'next/navigation';
// import React, { useEffect, useRef, useState } from 'react';
// import { staff } from '@/app/(main)/_components/UserInputDialong';
// import Image from 'next/image';
// import { UserButton } from '@stackframe/stack';
// import { Button } from '@/components/ui/button';
// import { Aimodle } from '@/Services/GlobalService';

// function DiscussionRoom() {
//   const { roomid } = useParams();
//   const Discussiondata = useQuery(api.DicussRoom.GetDiscussionInfo, { id: roomid });
//   const [expert, setExpert] = useState();
//   const [enablemic, setEnableMic] = useState(false);
//   const [isAiSpeaking, setIsAiSpeaking] = useState(false);
//   const [conversationHistory, setConversationHistory] = useState([]);
//   const [currentTranscript, setCurrentTranscript] = useState('');
//   const [interimText, setInterimText] = useState('');
//   const recognitionRef = useRef(null);
//   const synthRef = useRef(null);
//   const silenceTimerRef = useRef(null);
//   const isProcessingRef = useRef(false);

//   useEffect(() => {
//     if (Discussiondata) {
//       const data = staff.find(item => item.name === Discussiondata.Mentor);
//       setExpert(data);
//     }
//   }, [Discussiondata]);

//   useEffect(() => {
//     if (typeof window !== 'undefined') {
//       synthRef.current = window.speechSynthesis;
//     }
//     return () => {
//       if (synthRef.current) {
//         synthRef.current.cancel();
//       }
//     };
//   }, []);

//   const speakText = (text) => {
//     return new Promise((resolve) => {
//       if (!synthRef.current) {
//         resolve();
//         return;
//       }

//       synthRef.current.cancel();
//       const utterance = new SpeechSynthesisUtterance(text);
//       utterance.rate = 1.2; // Faster speech
//       utterance.pitch = 1.0;
//       utterance.volume = 1.0;

//       utterance.onstart = () => setIsAiSpeaking(true);
//       utterance.onend = () => {
//         setIsAiSpeaking(false);
//         resolve();
//       };
//       utterance.onerror = () => {
//         setIsAiSpeaking(false);
//         resolve();
//       };

//       synthRef.current.speak(utterance);
//     });
//   };

//   const processUserResponse = async (userText) => {
//     if (!userText.trim() || isProcessingRef.current) return;
    
//     isProcessingRef.current = true;

//     const newHistory = [...conversationHistory, { role: 'user', content: userText }];
//     setConversationHistory(newHistory);
//     setCurrentTranscript('');

//     // Don't stop recognition - keep it running
    
//     try {
//       const aiResponse = await Aimodle(
//         Discussiondata.topic,
//         Discussiondata.coachingOption,
//         userText,
//         newHistory
//       );

//       setConversationHistory([...newHistory, { role: 'assistant', content: aiResponse }]);

//       // Speak immediately without delays
//       await speakText(aiResponse);

//     } catch (error) {
//       console.error('Error processing response:', error);
//     } finally {
//       isProcessingRef.current = false;
//     }
//   };

//   const ConnectToServer = async () => {
//     try {
//       const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
//       if (!SpeechRecognition) {
//         alert('Speech recognition not supported in this browser.');
//         return;
//       }

//       setEnableMic(true);
//       setCurrentTranscript('');
//       setInterimText('');

//       const recognition = new SpeechRecognition();
//       recognitionRef.current = recognition;
//       recognition.continuous = true;
//       recognition.interimResults = true;
//       recognition.lang = 'en-US';

//       let accumulatedTranscript = '';

//       recognition.onresult = (event) => {
//         let interim = '';
//         let final = '';
        
//         for (let i = event.resultIndex; i < event.results.length; i++) {
//           const text = event.results[i][0].transcript;
//           if (event.results[i].isFinal) {
//             final += text + ' ';
//           } else {
//             interim += text;
//           }
//         }

//         if (final) {
//           accumulatedTranscript += final;
//           setCurrentTranscript(accumulatedTranscript);
//           setInterimText('');
          
//           if (silenceTimerRef.current) {
//             clearTimeout(silenceTimerRef.current);
//           }
          
//           // 1 second silence to submit
//           silenceTimerRef.current = setTimeout(() => {
//             if (accumulatedTranscript.trim() && !isProcessingRef.current) {
//               processUserResponse(accumulatedTranscript.trim());
//               accumulatedTranscript = ''; // Reset after processing
//             }
//           }, 1000);
//         }
        
//         if (interim) {
//           setInterimText(interim);
//         }
//       };

//       recognition.onerror = (event) => {
//         if (event.error !== 'no-speech' && event.error !== 'aborted') {
//           console.error('Speech error:', event.error);
//         }
//       };

//       recognition.onend = () => {
//         if (enablemic) {
//           try {
//             recognition.start();
//           } catch (e) {
//             console.log('Recognition restart:', e);
//           }
//         }
//       };

//       recognition.start();
//       console.log('🎙️ Speech recognition started');

//       // Start with first interview question
//       const openingMessage = `Hi, I'm ${expert?.name || 'your interviewer'}. Let's begin. Tell me about your background in ${Discussiondata?.topic}.`;
//       setConversationHistory([{ role: 'assistant', content: openingMessage }]);
//       speakText(openingMessage);

//     } catch (error) {
//       console.error('Failed to start:', error);
//       alert('Failed to start: ' + error.message);
//       setEnableMic(false);
//     }
//   };

//   const Disconnected = (e) => {
//     e.preventDefault();
    
//     if (silenceTimerRef.current) {
//       clearTimeout(silenceTimerRef.current);
//     }
    
//     if (recognitionRef.current) {
//       recognitionRef.current.stop();
//       recognitionRef.current = null;
//     }
    
//     if (synthRef.current) {
//       synthRef.current.cancel();
//     }
    
//     setEnableMic(false);
//     setIsAiSpeaking(false);
//     setInterimText('');
//     setCurrentTranscript('');
//     isProcessingRef.current = false;
//     console.log('✅ Stopped');
//   };

//   return (
//     <div>
//       <h2 className='text-lg font-bold'>{Discussiondata?.coachingOption}</h2>
//       <div className='mt-5 grid grid-cols-1 lg:grid-cols-3 gap-10'>
//         <div className='lg:col-span-2'>
//           <div className='h-[60vh] bg-gradient-to-br from-gray-50 to-gray-100 rounded-4xl border flex flex-col justify-center items-center relative'>
//             {expert?.pic && (
//               <div className='relative'>
//                 <Image
//                   src={expert.pic}
//                   height={200}
//                   width={200}
//                   alt={expert?.name || "Expert"}
//                   className={`w-[100px] h-[100px] object-cover rounded-full transition-all duration-200 ${
//                     isAiSpeaking ? 'ring-4 ring-blue-500 scale-110' : 'ring-2 ring-gray-300'
//                   }`}
//                 />
//                 {isAiSpeaking && (
//                   <div className='absolute -bottom-2 left-1/2 transform -translate-x-1/2'>
//                     <div className='flex gap-1'>
//                       <div className='w-2 h-2 bg-blue-500 rounded-full animate-bounce' style={{animationDelay: '0ms'}}></div>
//                       <div className='w-2 h-2 bg-blue-500 rounded-full animate-bounce' style={{animationDelay: '150ms'}}></div>
//                       <div className='w-2 h-2 bg-blue-500 rounded-full animate-bounce' style={{animationDelay: '300ms'}}></div>
//                     </div>
//                   </div>
//                 )}
//               </div>
//             )}
//             <h2 className='font-bold text-lg mt-4'>{expert?.name}</h2>
//             <p className='text-xs text-gray-500 mt-1'>
//               {isAiSpeaking ? '🔊 Speaking...' : enablemic ? '👂 Listening...' : 'Ready to start'}
//             </p>
            
//             <div className='bg-white/80 backdrop-blur px-6 py-3 rounded-lg absolute bottom-10 right-10 shadow-sm'>
//               <UserButton />
//             </div>
//           </div>

//           <div className='mt-5 flex flex-col items-center gap-2'>
//             {!enablemic ? (
//               <Button onClick={ConnectToServer} size="lg" className='px-8'>
//                 🎤 Start Fast Interview
//               </Button>
//             ) : (
//               <Button onClick={Disconnected} variant='destructive' size="lg" className='px-8'>
//                 ⏹️ End Interview
//               </Button>
//             )}
//             {enablemic && (
//               <p className='text-xs text-gray-600 bg-gray-100 px-3 py-1 rounded-full'>
//                 ⚡ Fast Mode: 1s pause to respond
//               </p>
//             )}
//           </div>
//         </div>

//         <div className='h-[60vh] bg-white rounded-4xl border shadow-sm flex flex-col overflow-hidden'>
//           <div className='p-4 border-b bg-gradient-to-r from-blue-50 to-purple-50 flex justify-between items-center'>
//             <h2 className='font-bold'>Live Conversation</h2>
//             {enablemic && (
//               <div className='flex items-center gap-2'>
//                 <div className='w-2 h-2 bg-red-500 rounded-full animate-pulse'></div>
//                 <span className='text-xs font-semibold text-red-600'>LIVE</span>
//               </div>
//             )}
//           </div>

//           <div className='flex-1 p-4 overflow-auto flex flex-col gap-3'>
//             {conversationHistory.map((msg, idx) => (
//               <div
//                 key={idx}
//                 className={`p-3 rounded-2xl animate-fade-in ${
//                   msg.role === 'user'
//                     ? 'bg-blue-500 text-white ml-auto max-w-[85%] rounded-br-sm'
//                     : 'bg-gray-100 text-gray-900 mr-auto max-w-[85%] rounded-bl-sm'
//                 }`}
//               >
//                 <p className='text-xs font-medium mb-1 opacity-70'>
//                   {msg.role === 'user' ? 'You' : expert?.name || 'AI'}
//                 </p>
//                 <p className='text-sm leading-relaxed'>{msg.content}</p>
//               </div>
//             ))}

//             {currentTranscript && (
//               <div className='p-3 rounded-2xl bg-blue-400 text-white ml-auto max-w-[85%] rounded-br-sm border-2 border-blue-300 animate-pulse'>
//                 <p className='text-xs font-medium mb-1 opacity-70'>You</p>
//                 <p className='text-sm'>{currentTranscript}</p>
//               </div>
//             )}

//             {interimText && (
//               <div className='p-2 rounded-xl bg-blue-50 ml-auto max-w-[85%] border border-blue-200'>
//                 <p className='text-xs text-blue-600 italic'>{interimText}</p>
//               </div>
//             )}

//             {!conversationHistory.length && (
//               <div className='flex-1 flex items-center justify-center'>
//                 <p className='text-sm text-gray-400 text-center'>
//                   {enablemic ? '🎤 Start speaking...' : 'Click Start to begin'}
//                 </p>
//               </div>
//             )}
//           </div>
//         </div>
//       </div>

//       <style jsx>{`
//         @keyframes fade-in {
//           from {
//             opacity: 0;
//             transform: translateY(10px);
//           }
//           to {
//             opacity: 1;
//             transform: translateY(0);
//           }
//         }
//         .animate-fade-in {
//           animation: fade-in 0.3s ease-out;
//         }
//       `}</style>
//     </div>
//   );
// }

// export default DiscussionRoom;
"use client";
import { api } from "@/convex/_generated/api";
import { useQuery } from "convex/react";
import { useParams } from "next/navigation";
import React, { useEffect, useRef, useState } from "react";
import { staff } from "@/app/(main)/_components/UserInputDialong";
import Image from "next/image";
import { UserButton } from "@stackframe/stack";
import { Button } from "@/components/ui/button";
import { AiModel } from "@/Services/GlobalService";

function DiscussionRoom() {
  const { roomid } = useParams();
  const Discussiondata = useQuery(api.DicussRoom.GetDiscussionInfo, { id: roomid });
  const [expert, setExpert] = useState();
  const [enablemic, setEnableMic] = useState(false);
  const [transcript, setTranscript] = useState([]);
  const [interimText, setInterimText] = useState("");
  const recognitionRef = useRef(null);
  const micEnabledRef = useRef(false);

  useEffect(() => {
    micEnabledRef.current = enablemic;
  }, [enablemic]);

  useEffect(() => {
    if (Discussiondata) {
      const data = staff.find((item) => item.name === Discussiondata.Mentor);
      setExpert(data);
    }
  }, [Discussiondata]);

  const ConnectToServer = async () => {
    try {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      if (!SpeechRecognition) {
        alert("Speech recognition not supported in this browser.");
        return;
      }

      setEnableMic(true);
      setTranscript([]);
      setInterimText("");

      const recognition = new SpeechRecognition();
      recognitionRef.current = recognition;
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = "en-US";

      recognition.onresult = (event) => {
        let interim = "";
        let final = "";

        for (let i = event.resultIndex; i < event.results.length; i++) {
          const text = event.results[i][0].transcript;
          if (event.results[i].isFinal) final += text + " ";
          else interim += text;
        }

        if (final) {
          setTranscript((prev) => [...prev, { role: "user", content: final.trim() }]);
          setInterimText("");
        }
        if (interim) setInterimText(interim);
      };

      recognition.onerror = (event) => {
        console.error("Speech error:", event.error);
        if (event.error !== "no-speech") {
          alert("Error: " + event.error);
          setEnableMic(false);
        }
      };

      recognition.onend = () => {
        if (micEnabledRef.current) recognition.start();
      };

      recognition.start();
      console.log("🎙️ Speech recognition started");

      // Send transcript to AI every few seconds
      setInterval(async () => {
        if (Discussiondata && transcript.length > 0) {
          try {
            const userText = transcript.map((t) => t.content).join(" ");
            const aiResponse = await AiModel(
              Discussiondata.topic,
              Discussiondata.coachingOption,
              userText
            );
            console.log("AI Response:", aiResponse);
            setTranscript((prev) => [...prev, { role: "ai", content: aiResponse }]);
          } catch (err) {
            console.error("AI Model Error:", err);
          }
        }
      }, 3000);
    } catch (error) {
      console.error("Failed to start:", error);
      alert("Failed to start: " + error.message);
      setEnableMic(false);
    }
  };

  const Disconnected = (e) => {
    e.preventDefault();
    if (recognitionRef.current) {
      recognitionRef.current.stop();
      recognitionRef.current = null;
    }
    setEnableMic(false);
    setInterimText("");
    console.log("✅ Mic stopped");
  };

  if (!Discussiondata) return <p>Loading...</p>;

  return (
    <div>
      <h2 className="text-lg font-bold">{Discussiondata?.coachingOption}</h2>
      <div className="mt-5 grid grid-cols-1 lg:grid-cols-3 gap-10">
        <div className="lg:col-span-2">
          <div className="h-[60vh] bg-gray-100 rounded-3xl border flex flex-col justify-center items-center relative">
            {expert?.pic && (
              <Image
                src={expert.pic}
                height={200}
                width={200}
                alt={expert?.name || "Expert"}
                className="w-[80px] h-[80px] object-cover rounded-full animate-pulse"
              />
            )}
            <h2 className="font-extralight text-gray-500">{expert?.name}</h2>
            <div className="bg-gray-200 px-10 py-5 rounded-lg absolute bottom-10 right-10">
              <UserButton />
            </div>
          </div>

          <div className="mt-5 flex flex-col items-center gap-2">
            {!enablemic ? (
              <Button onClick={ConnectToServer}>🎤 Connect</Button>
            ) : (
              <Button onClick={Disconnected} variant="destructive">
                ⏹️ Stop
              </Button>
            )}
          </div>
        </div>

        <div className="h-[60vh] bg-gray-100 rounded-3xl border flex flex-col overflow-hidden">
          <div className="p-5 border-b bg-white flex justify-between items-center">
            <h2 className="font-bold">Live Transcript</h2>
            {enablemic && (
              <span className="text-xs bg-red-100 text-red-600 px-2 py-1 rounded-full">
                🔴 LIVE
              </span>
            )}
          </div>

          <div className="flex-1 p-5 overflow-auto space-y-3">
            {transcript.map((msg, i) => (
              <p
                key={i}
                className={`text-base leading-relaxed whitespace-pre-wrap ${
                  msg.role === "user"
                    ? "text-gray-900"
                    : "text-green-700 italic"
                }`}
              >
                <strong>{msg.role === "user" ? "You: " : "AI: "}</strong>
                {msg.content}
              </p>
            ))}

            {interimText && (
              <p className="text-base text-blue-600 italic leading-relaxed">
                {interimText}
              </p>
            )}

            {!transcript.length && !interimText && (
              <p className="text-sm text-gray-400">
                {enablemic ? "Speak now..." : "Click Start to begin"}
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default DiscussionRoom;


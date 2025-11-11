"use client";
import { api } from '@/convex/_generated/api';
import { useMutation, useQuery } from 'convex/react';
import { useParams } from 'next/navigation';
import React, { useEffect, useRef, useState } from 'react';
import { staff } from '@/app/(main)/_components/UserInputDialong';
import Image from 'next/image';
import { UserButton } from '@stackframe/stack';
import { Button } from '@/components/ui/button';
import Vapi from '@vapi-ai/web';

function DiscussionRoom() {
  const { roomid } = useParams();
  const Discussiondata = useQuery(api.DicussRoom.GetDiscussionInfo, { id: roomid });
  const [expert, setExpert] = useState();
  const [enablemic, setEnableMic] = useState(false);
  const [messages, setMessages] = useState([]);
  const [interimText, setInterimText] = useState('');
  const [micPermission, setMicPermission] = useState(null);
  const [isConnecting, setIsConnecting] = useState(false);
  const messagesEndRef = useRef(null);
  const vapiRef = useRef(null);
  const UpdateConversion = useMutation(api.DicussRoom.UpdateConversation)
  const [feedback, setFeedBack] = useState([]);
  const [isFeedbackMode, setIsFeedbackMode] = useState(false);
  console.log(feedback);

  useEffect(() => {
    if (Discussiondata) {
      const data = staff.find(item => item.name === Discussiondata.Mentor);
      setExpert(data);
    }
  }, [Discussiondata]);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, interimText]);

  // Check microphone permissions on mount
  useEffect(() => {
    checkMicrophonePermission();
  }, []);

  const checkMicrophonePermission = async () => {
    try {
      // Check if browser supports mediaDevices
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {

        setMicPermission(false);
        return;
      }

      // Try to get microphone permission
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      //console.log(' Microphone permission granted');
      setMicPermission(true);

      // Stop the stream immediately (we just needed to check permission)
      stream.getTracks().forEach(track => track.stop());
    } catch (error) {
      //console.error(' Microphone permission denied or unavailable:', error);
      setMicPermission(false);
    }
  };

  // Initialize Vapi
  useEffect(() => {
    if (!vapiRef.current && typeof window !== 'undefined') {
      const apiKey = process.env.NEXT_PUBLIC_VAPI_PUBLIC_KEY;

      if (!apiKey) {
        // console.warn(' Vapi API key not found');
        return;
      }

      try {
        vapiRef.current = new Vapi(apiKey);
        //console.log(' Vapi initialized');

        vapiRef.current.on('call-start', () => {
          //console.log(' Vapi call started');
          setEnableMic(true);
          setIsConnecting(false); // Stop loading when call starts
        });


        vapiRef.current.on('call-end', () => {
          //console.log(' Vapi call ended');
          setEnableMic(false);
          setIsConnecting(false); // Stop loading if call ends unexpectedly
        });

        vapiRef.current.on('speech-start', () => {
          //console.log('👂 User speaking...');
        });

        vapiRef.current.on('speech-end', () => {
          //console.log(' User finished speaking');
        });

        vapiRef.current.on('message', (message) => {
          //console.log(' Vapi Message:', message);


          if (message.type === 'transcript' && message.transcriptType === 'final' && message.role === 'user') {
            setMessages(prev => [...prev, {
              role: 'user',
              text: message.transcript,
              timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
            }]);
            setInterimText('');
          }

          // Capture interim transcripts
          if (message.type === 'transcript' && message.transcriptType === 'partial' && message.role === 'user') {
            setInterimText(message.transcript);
          }

          // Capture AI responses
          if (message.type === 'transcript' && message.role === 'assistant') {
            //console.log(' AI Response:', message.transcript);
            setMessages(prev => [...prev, {
              role: 'assistant',
              text: message.transcript,
              timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
            }]);
          }
        });

        vapiRef.current.on('error', (error) => {
          //console.error('Vapi error:', error);
          setEnableMic(false);
          setIsConnecting(false); // Stop loading on error
        });
      } catch (error) {
        //console.error('Failed to initialize Vapi:', error);
      }
    }

    return () => {
      if (vapiRef.current) {
        vapiRef.current.stop();
      }
    };
  }, []);

  const getVoiceId = () => {
    if (!expert?.gender) return 'EXAVITQu4vr4xnSDxMaL'; // Default female voice

    // ElevenLabs voice IDs
    const voices = {
      male: 'pNInz6obpgDQGcFmaJgB', // Adam - Deep male voice
      female: 'EXAVITQu4vr4xnSDxMaL' // Sarah - Professional female voice
    };

    return voices[expert.gender.toLowerCase()] || voices.female;
  };

  const ConnectToServer = async () => {
    try {
      setIsConnecting(true);

      // Check microphone permission first
      if (micPermission === false) {
        alert('Microphone access is required. Please enable microphone permissions in your browser settings.');
        setIsConnecting(false);
        return;
      }

      if (micPermission === null) {
        // Try to request permission
        await checkMicrophonePermission();
        if (micPermission === false) {
          alert('Unable to access microphone. Please check your browser settings.');
          setIsConnecting(false);
          return;
        }
      }

      if (!vapiRef.current) {
        alert('Vapi not initialized');
        setIsConnecting(false);
        return;
      }

      // Check if API key exists
      if (!process.env.NEXT_PUBLIC_VAPI_PUBLIC_KEY) {
        alert('Vapi API key not found. Please add NEXT_PUBLIC_VAPI_PUBLIC_KEY to your .env.local file');
        setIsConnecting(false);
        return;
      }

      setInterimText('');
      setMessages([]);

      //console.log(' Starting Vapi call...');

      const assistantConfig = {
        name: expert?.name || 'Career Coach',
        model: {
          provider: 'openai',
          model: 'gpt-3.5-turbo',
          messages: [
            {
              role: 'system',
              content: `You are ${expert?.name || 'a professional career coach'}, an expert career coach. 
                        Topic: ${Discussiondata?.topic || 'career guidance'}
                        Coaching focus: ${Discussiondata?.coachingOption || 'general coaching'}
                        
                        IMPORTANT CONVERSATION RULES:
                        - Wait for the user to completely finish their thought before responding
                        - If the user pauses briefly, they may be thinking - give them time
                        - Only respond when you're certain the user has finished speaking
                        - Keep responses concise (2 sentences) and conversational
                        - Ask follow-up questions to ensure understanding`
            }
          ],
          temperature: 0.7,
          maxTokens: 150
        },
        voice: {
          provider: '11labs',
          voiceId: getVoiceId()
        },
        firstMessage: `Hello! I'm ${expert?.name || 'your career coach'}. I'm here to help you with ${Discussiondata?.topic || 'your career'}. What would you like to discuss today?`,
        transcriber: {
          provider: 'deepgram',
          model: 'nova-2',
          language: 'en-US'
        },
        // Add these settings to improve audio handling
        clientMessages: [
          'transcript',
          'hang',
          'function-call',
          'speech-update',
          'metadata',
          'conversation-update'
        ]
      };

      // console.log(' Calling Vapi with config');

      await vapiRef.current.start(assistantConfig);

      //console.log(' Vapi call initiated');


    } catch (error) {
      console.error('Failed to start Vapi:', error);
      setIsConnecting(false);

      // More helpful error messages
      if (error.name === 'NotAllowedError') {
        alert('Microphone access denied. Please allow microphone access and try again.');
      } else if (error.name === 'NotFoundError') {
        alert('No microphone found. Please connect a microphone and try again.');
      } else if (error.name === 'NotReadableError') {
        alert('Microphone is already in use by another application.');
      } else {
        alert('Failed to start: ' + (error?.message || 'Unknown error'));
      }

      setEnableMic(false);
    }
  };

  const Disconnected = (e) => {
    e.preventDefault();

    if (vapiRef.current) {
      vapiRef.current.stop();
    }

    setEnableMic(false);
    feedbackHandler();
    UpdateConversion({
      id: Discussiondata._id,
      coversation: messages
    })

    // console.log(' Stopped');
    setInterimText('');
  };

const feedbackHandler = async () => {
  if (messages.length === 0) {
    alert("No conversation to provide feedback on");
    return;
  }
  
  try {
    if (!vapiRef.current) {
      alert("Vapi not initialized");
      return;
    }

    // Stop any existing call first
    try {
      await vapiRef.current.stop();
      // Wait a bit for cleanup
      await new Promise(resolve => setTimeout(resolve, 500));
    } catch (e) {
      console.log('No active call to stop');
    }

    // Format the conversation summary
    const Summary = messages
      .map(msg => `${msg.role === 'user' ? 'User' : 'Coach'}: ${msg.text}`)
      .join('\n');

    console.log(' Conversation Summary:');
    console.log(Summary);

    // Set up feedback message listener
    const feedbackListener = (message) => {
      console.log(' Feedback Message:', message);
      
      if (message.type === 'transcript' && message.role === 'assistant') {
        console.log(' FEEDBACK RESPONSE:', message.transcript);
        setFeedBack(prev => prev + ' ' + message.transcript);
      }
    };

    // Add the listener
    vapiRef.current.on('message', feedbackListener);

    const feedbackConfig = {
      name: 'Feedback Analyst',
      model: {
        provider: 'openai',
        model: 'gpt-4',
        feedback: [  
          {
            role: 'system',
            content: `You are an expert career coaching analyst providing detailed feedback on coaching sessions.

Conversation Transcript:
${Summary}

Your task is to provide comprehensive feedback covering:
1. Overall session quality and engagement
2. Key strengths demonstrated by the user
3. Areas for improvement
4. Specific insights and observations
5. Actionable next steps

Start by giving an overall assessment, then provide detailed feedback. Keep your initial response under 10 seconds. Be conversational, constructive, and encouraging.

After giving feedback, ask if the user has any questions about the feedback or wants clarification on any points.`
          }
        ],
        temperature: 0.7,
        maxTokens: 500
      }, 
      voice: {
        provider: '11labs',
        voiceId: getVoiceId()
      },
      transcriber: {
        provider: 'deepgram',
        model: 'nova-2',
        language: 'en-US'
      },
      clientMessages: [
        'transcript',
        'hang',
        'function-call',
        'speech-update',
        'metadata',
        'conversation-update'
      ]
    };

    console.log(' Starting feedback session...');
    await vapiRef.current.start(feedbackConfig);
    setEnableMic(true);
    setIsFeedbackMode(true);
    console.log(' Feedback session started');
    
  } catch (error) {
    console.error(' Failed to start feedback session:', error);

    setEnableMic(false);
  }
};

  return (

    <div
    >
      <h2 className='text-lg font-bold'>{Discussiondata?.coachingOption}</h2>

      {/* Microphone Permission Warning */}
      {micPermission === false && (
        <div className='mt-3 p-3 bg-yellow-50 border border-yellow-200 rounded-lg'>
          <p className='text-sm text-yellow-800'>
            Microphone access is required for voice chat.
            <button
              onClick={checkMicrophonePermission}
              className='ml-2 underline font-medium'
            >
              Grant Permission
            </button>
          </p>
        </div>
      )}



      <div className='mt-5 grid grid-cols-1 lg:grid-cols-3 gap-10'>


        <div className='lg:col-span-2 '>
          <div className='h-[60vh] bg-gray-100 rounded-4xl border flex flex-col justify-center items-center relative border-blue-300 '
            style={{ backgroundImage: "url('/InterviewBackground.svg')" }}
          >
            {expert?.pic && (
              <Image
                src={expert.pic}
                height={200}
                width={200}
                alt={expert?.name || "Expert"}
                className="w-[80px] h-[80px] object-cover rounded-full animate-pulse"
              />
            )}
            <h2 className='font-extralight text-gray-500'>{expert?.name}</h2>
            <div className=' px-10 py-5 rounded-lg absolute bottom-10 right-10 border border-blue-400 bg-gray/30 backdrop-blur-md' >
              <UserButton />
            </div>
          </div>

          <div className='mt-5 flex flex-col items-center gap-2 '>
            {!enablemic && !isConnecting ? (
              <Button
                onClick={ConnectToServer}
                disabled={micPermission === false}
              >
                🎤 Connect
              </Button>
            ) : isConnecting ? (
              <Button disabled className="relative">
                <span className="flex items-center gap-2">
                  <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Connecting...
                </span>
              </Button>
            ) : (
              <Button onClick={Disconnected} variant='destructive'>⏹️ Stop</Button>
            )}

            {/* Microphone status indicator */}
            {micPermission === true && !enablemic && !isConnecting && (
              <span className='text-xs text-green-600'>
                ✓ Microphone ready
              </span>
            )}

            {/* Connecting status */}
            {isConnecting && (
              <span className='text-xs text-blue-600'>
                ⏳ Initializing voice connection...
              </span>
            )}

            {/* Speaking indicator */}
            {enablemic && interimText && (
              <span className='text-xs bg-blue-100 text-blue-600 px-3 py-1 rounded-full animate-pulse'>
                🎙️ Listening...
              </span>
            )}
          </div>
        </div>

        <div className='h-[60vh] bg-gray-100 rounded-4xl border flex flex-col overflow-hidden'>
          <div className='p-5 border-b bg-white flex justify-between items-center'>
            <h2 className='font-bold'>Live Transcript</h2>
            {enablemic && (
              <span className='text-xs bg-red-100 text-red-600 px-2 py-1 rounded-full'>
                🔴 LIVE
              </span>
            )}
          </div>

          <div className='flex-1 p-5 overflow-auto space-y-4'>
            {messages.length === 0 && !interimText && (
              <p className='text-sm text-gray-400 text-center mt-10'>
                {enablemic ? 'Speak now...' : 'Click Connect to begin'}
              </p>
            )}

            {messages.map((msg, index) => (
              <div
                key={index}
                className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div className={`max-w-[80%] ${msg.role === 'user'
                  ? 'bg-blue-500 text-white'
                  : 'bg-white border border-gray-200'
                  } rounded-2xl px-4 py-3 shadow-sm`}>
                  <div className='flex items-center gap-2 mb-1'>
                    <span className='text-xs font-medium opacity-70'>
                      {msg.role === 'user' ? 'You' : expert?.name || 'Coach'}
                    </span>
                    <span className='text-xs opacity-50'>{msg.timestamp}</span>
                  </div>
                  <p className='text-sm leading-relaxed'>{msg.text}</p>
                </div>
              </div>
            ))}

            {/* Interim (typing) text */}
            {interimText && (
              <div className='flex justify-end'>
                <div className='max-w-[80%] bg-blue-100 text-blue-800 rounded-2xl px-4 py-3 shadow-sm border border-blue-200'>
                  <div className='flex items-center gap-2 mb-1'>
                    <span className='text-xs font-medium'>You</span>
                    <span className='text-xs opacity-50'>typing...</span>
                  </div>
                  <p className='text-sm italic leading-relaxed'>{interimText}</p>
                </div>
              </div>
            )}

            {/* Auto-scroll anchor */}
            <div ref={messagesEndRef} />
          </div>
        </div>


      </div>
    </div>

  );
}

export default DiscussionRoom;



// "use client";

// import React, { useEffect, useRef, useState } from "react";
// import { useParams } from "next/navigation";
// import { useQuery, useMutation } from "convex/react";
// import { api } from "@/convex/_generated/api";
// import Image from "next/image";
// import { UserButton } from "@stackframe/stack";
// import { Button } from "@/components/ui/button";
// import Vapi from "@vapi-ai/web";

// export default function DiscussionRoom() {
//   const { roomid } = useParams();
//   const Discussiondata = useQuery(api.DicussRoom.GetDiscussionInfo, { id: roomid });
//   const UpdateConversion = useMutation(api.DicussRoom.UpdateConversation);

//   const [expert, setExpert] = useState(null);
//   const [enableMic, setEnableMic] = useState(false);
//   const [isConnecting, setIsConnecting] = useState(false);
//   const [messages, setMessages] = useState([]); // live conversation messages
//   const [interimText, setInterimText] = useState("");
//   const [micPermission, setMicPermission] = useState(null);

//   const [feedback, setFeedback] = useState([]); // array of assistant transcript segments (strings)
//   const [isGeneratingFeedback, setIsGeneratingFeedback] = useState(false);

//   const vapiRef = useRef(null);
//   const messagesEndRef = useRef(null);

//   useEffect(() => {
//     if (Discussiondata) {
//       const mentor = Discussiondata?.Mentor || "Career Coach";
//       // if you have staff list, you can find pic/gender there; here we set defaults
//       setExpert({ name: mentor, gender: "female", pic: null });
//     }
//   }, [Discussiondata]);

//   // auto scroll
//   useEffect(() => {
//     messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
//   }, [messages, interimText, feedback]);

//   // Check mic permission on mount
//   useEffect(() => {
//     checkMicrophonePermission();
//   }, []);

//   const checkMicrophonePermission = async () => {
//     try {
//       if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
//         setMicPermission(false);
//         return;
//       }
//       const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
//       setMicPermission(true);
//       stream.getTracks().forEach((t) => t.stop());
//     } catch (e) {
//       setMicPermission(false);
//     }
//   };

//   // Initialize Vapi once
//   useEffect(() => {
//     if (!vapiRef.current && typeof window !== "undefined") {
//       const key = process.env.NEXT_PUBLIC_VAPI_PUBLIC_KEY;
//       if (!key) {
//         console.warn("Vapi public key missing (NEXT_PUBLIC_VAPI_PUBLIC_KEY). Vapi will not initialize.");
//         return;
//       }
//       try {
//         vapiRef.current = new Vapi(key);

//         // Live interview handlers
//         vapiRef.current.on("call-start", () => {
//           setEnableMic(true);
//           setIsConnecting(false);
//         });

//         vapiRef.current.on("call-end", () => {
//           setEnableMic(false);
//           setIsConnecting(false);
//         });

//         vapiRef.current.on("message", (message) => {
//           // Live transcripts come here too; we add to messages only for user & assistant in live session
//           if (message.type === "transcript") {
//             if (message.transcriptType === "partial" && message.role === "user") {
//               setInterimText(message.transcript);
//             } else if (message.transcriptType === "final" && message.role === "user") {
//               setMessages((prev) => [
//                 ...prev,
//                 {
//                   role: "user",
//                   text: message.transcript,
//                   timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
//                 },
//               ]);
//               setInterimText("");
//             } else if (message.role === "assistant") {
//               setMessages((prev) => [
//                 ...prev,
//                 {
//                   role: "assistant",
//                   text: message.transcript,
//                   timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
//                 },
//               ]);
//             }
//           }
//         });

//         vapiRef.current.on("error", (err) => {
//           console.error("Vapi error:", err);
//           setEnableMic(false);
//           setIsConnecting(false);
//           setIsGeneratingFeedback(false);
//         });
//       } catch (err) {
//         console.error("Failed to initialize Vapi:", err);
//       }
//     }

//     return () => {
//       // cleanup on unmount
//       if (vapiRef.current) {
//         try {
//           vapiRef.current.stop();
//         } catch (e) { /* ignore */ }
//       }
//     };
//   }, []);

//   const getVoiceId = () => {
//     if (!expert?.gender) return "EXAVITQu4vr4xnSDxMaL";
//     const voices = {
//       male: "pNInz6obpgDQGcFmaJgB",
//       female: "EXAVITQu4vr4xnSDxMaL",
//     };
//     return voices[expert.gender?.toLowerCase()] || voices.female;
//   };

//   // Start live interview session
//   const startInterview = async () => {
//     if (!vapiRef.current) return alert("Vapi not initialized (missing NEXT_PUBLIC_VAPI_PUBLIC_KEY).");
//     if (micPermission === false) {
//       return alert("Microphone access denied. Please enable microphone permission.");
//     }

//     try {
//       setIsConnecting(true);
//       setMessages([]);
//       setInterimText("");
//       setFeedback([]);

//       const assistantConfig = {
//         name: expert?.name || "Career Coach",
//         model: {
//           provider: "openai",
//           model: "gpt-3.5-turbo",
//           messages: [
//             {
//               role: "system",
//               content: `You are ${expert?.name || "a professional career coach"}. Topic: ${Discussiondata?.topic || "career guidance"}. Keep responses concise and ask clarifying questions.`,
//             },
//           ],
//           temperature: 0.6,
//           maxTokens: 200,
//         },
//         voice: {
//           provider: "11labs",
//           voiceId: getVoiceId(),
//         },
//         firstMessage: `Hello! I'm ${expert?.name || "your career coach"}. What would you like to discuss today?`,
//         transcriber: {
//           provider: "deepgram",
//           model: "nova-2",
//           language: "en-US",
//         },
//         clientMessages: ["transcript", "hang", "function-call", "speech-update", "metadata", "conversation-update"],
//       };

//       await vapiRef.current.start(assistantConfig);
//     } catch (err) {
//       console.error("Failed to start interview:", err);
//       alert("Failed to start interview: " + (err?.message || "Unknown"));
//       setIsConnecting(false);
//       setEnableMic(false);
//     }
//   };

//   // Stop live interview and save conversation to Convex
//   const stopInterview = async () => {
//     try {
//       if (vapiRef.current) {
//         try {
//           await vapiRef.current.stop();
//         } catch (e) {
//           console.log("vapi stop error:", e);
//         }
//       }
//     } catch (err) {
//       console.error("Error stopping interview:", err);
//     } finally {
//       setEnableMic(false);
//     }

//     // Update conversation in Convex if you want
//     try {
//       if (Discussiondata?._id) {
//         await UpdateConversion({
//           id: Discussiondata._id,
//           coversation: messages,
//         });
//       }
//     } catch (err) {
//       console.error("Convex update failed:", err);
//     }
//   };

//   // Generate feedback using Vapi (no direct OpenAI): voice + transcript
//   // This will:
//   // 1) ensure the live interview is stopped
//   // 2) attach a single message listener to capture assistant transcripts
//   // 3) start a Vapi session with a system prompt that asks for feedback
//   // 4) collect transcripts into `feedback` array and cleanup on call-end
//   const generateFeedbackWithVapi = async () => {
//     if (!vapiRef.current) return alert("Vapi not initialized.");
//     if (!messages.length) return alert("No conversation available for feedback.");

//     // Prevent duplicate runs
//     if (isGeneratingFeedback) return;

//     setIsGeneratingFeedback(true);
//     setFeedback([]);

//     try {
//       // Ensure we are not in an active interview session
//       try {
//         await vapiRef.current.stop();
//       } catch (e) {
//         console.log("stop before feedback:", e);
//       }
//       setEnableMic(false);

//       // give small delay so engine can clean up
//       await new Promise((r) => setTimeout(r, 600));

//       // build conversation summary for system prompt
//       const Summary = messages.map((m) => `${m.role === "user" ? "User" : "Coach"}: ${m.text}`).join("\n");

//       // listener to gather assistant transcripts during feedback session
//       const feedbackListener = (message) => {
//         if (message.type === "transcript" && message.role === "assistant") {
//           // we append partials/finals as they come; prefer final transcripts
//           if (message.transcript) {
//             setFeedback((prev) => {
//               // push new segment as single string item (keeps order)
//               return [...prev, message.transcript];
//             });
//           }
//         }
//       };

//       // attach listener
//       vapiRef.current.on("message", feedbackListener);

//       // ensure we remove listener and flags once call ends
//       const onCallEnd = () => {
//         try {
//           vapiRef.current?.off("message", feedbackListener);
//           vapiRef.current?.off("call-end", onCallEnd);
//         } catch (e) {
//           console.log("cleanup error", e);
//         } finally {
//           setEnableMic(false);
//           setIsGeneratingFeedback(false);
//         }
//       };
//       vapiRef.current.on("call-end", onCallEnd);

//       // Build feedback assistant config (system prompt asks for structured feedback)
//       const feedbackConfig = {
//         name: "Feedback Analyst",
//         model: {
//           provider: "openai", // Vapi will use configured provider internally
//           model: "gpt-4",
//           messages: [
//             {
//               role: "system",
//               content: `You are an expert career-coaching feedback analyst.
// Read the conversation transcript below and produce:
// 1) A one-line overall assessment.
// 2) 3 concise strengths the user showed.
// 3) 3 clear areas to improve.
// 4) 3 actionable next steps (short).
// Format as short bullet points. Conversation transcript:\n\n${Summary}`
//             }
//           ],
//           temperature: 0.6,
//           maxTokens: 500,
//         },
//         voice: {
//           provider: "11labs",
//           voiceId: getVoiceId(),
//         },
//         transcriber: {
//           provider: "deepgram",
//           model: "nova-2",
//           language: "en-US",
//         },
//         clientMessages: ["transcript", "hang", "function-call", "speech-update", "metadata", "conversation-update"],
//       };

//       // start feedback call (this will produce audio and assistant transcripts)
//       await vapiRef.current.start(feedbackConfig);

//       // At this point, transcripts will arrive via feedbackListener and be saved to `feedback`.
//       // When the assistant finishes speaking, call-end will fire and cleanup will run.

//     } catch (err) {
//       console.error("Feedback generation failed:", err);
//       alert("Feedback generation failed: " + (err?.message || "Unknown"));
//       // cleanup attempt
//       try {
//         vapiRef.current?.off("message");
//         vapiRef.current?.off("call-end");
//       } catch (e) {}
//       setIsGeneratingFeedback(false);
//       setEnableMic(false);
//     }
//   };

//   return (
//     <div className="p-5 space-y-6">
//       <h2 className="text-lg font-bold">{Discussiondata?.coachingOption || "Discussion"}</h2>

//       {/* Mic permission notice */}
//       {micPermission === false && (
//         <div className="p-3 bg-yellow-50 border border-yellow-200 rounded">
//           <p className="text-sm text-yellow-800">
//             Microphone access is required for voice chat.{" "}
//             <button onClick={checkMicrophonePermission} className="underline">
//               Grant Permission
//             </button>
//           </p>
//         </div>
//       )}

//       <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
//         <div className="lg:col-span-2">
//           <div className="h-[60vh] rounded-2xl border bg-gray-50 flex flex-col items-center justify-center relative">
//             {expert?.pic ? (
//               <Image src={expert.pic} height={120} width={120} alt={expert.name} className="rounded-full" />
//             ) : (
//               <div className="w-[80px] h-[80px] rounded-full bg-gray-200 mb-3" />
//             )}
//             <h3 className="text-lg text-gray-700">{expert?.name}</h3>
//             <div className="absolute bottom-6 right-6">
//               <UserButton />
//             </div>
//           </div>

//           <div className="mt-4 flex items-center gap-3">
//             {!enableMic && !isConnecting ? (
//               <Button onClick={startInterview} disabled={micPermission === false}>
//                 🎤 Start Interview
//               </Button>
//             ) : isConnecting ? (
//               <Button disabled>Connecting…</Button>
//             ) : (
//               <Button onClick={stopInterview} variant="destructive">
//                 ⏹️ Stop Interview
//               </Button>
//             )}

//             <span className="text-sm text-gray-500">
//               {micPermission === true && !enableMic && "✓ Microphone ready"}
//             </span>
//           </div>
//         </div>

//         <div className="h-[60vh] rounded-2xl border bg-white overflow-auto p-4">
//           <div className="flex justify-between items-center mb-3">
//             <h4 className="font-semibold">Live Transcript</h4>
//             {enableMic && <span className="text-xs px-2 py-1 rounded bg-red-100 text-red-600">🔴 LIVE</span>}
//           </div>

//           <div className="space-y-3">
//             {messages.length === 0 && !interimText && (
//               <p className="text-sm text-gray-400 text-center mt-6">{enableMic ? "Speak now…" : "Click Start Interview"}</p>
//             )}

//             {messages.map((m, idx) => (
//               <div key={idx} className={`p-3 rounded-xl ${m.role === "user" ? "ml-auto bg-blue-500 text-white max-w-[80%]" : "bg-gray-100 max-w-[80%]"}`}>
//                 <div className="flex items-center justify-between mb-1 text-xs opacity-70">
//                   <span>{m.role === "user" ? "You" : expert?.name || "Coach"}</span>
//                   <span>{m.timestamp}</span>
//                 </div>
//                 <div className="text-sm">{m.text}</div>
//               </div>
//             ))}

//             {interimText && (
//               <div className="p-3 rounded-xl ml-auto bg-blue-100 text-blue-800 max-w-[80%] italic">
//                 {interimText}
//               </div>
//             )}

//             <div ref={messagesEndRef} />
//           </div>
//         </div>
//       </div>

//       {/* Feedback controls */}
//       <div className="flex items-center gap-3">
//         <Button onClick={generateFeedbackWithVapi} disabled={isGeneratingFeedback || messages.length === 0}>
//           {isGeneratingFeedback ? "Generating Feedback…" : "🧾 Generate Feedback (Vapi)"}
//         </Button>

//         <Button onClick={() => { setFeedback([]); }} variant="ghost">Clear Feedback</Button>
//       </div>

//       {/* Feedback display */}
//       <div>
//         <h4 className="font-semibold mb-2">Feedback</h4>
//         {isGeneratingFeedback && <p className="text-sm text-gray-500">Listening for feedback response...</p>}

//         {feedback.length === 0 && !isGeneratingFeedback && (
//           <p className="text-sm text-gray-400">No feedback yet.</p>
//         )}

//         <div className="space-y-2 mt-2">
//           {feedback.map((f, idx) => (
//             <div key={idx} className="p-3 rounded border bg-green-50">
//               <p className="text-sm">{f}</p>
//             </div>
//           ))}
//         </div>
//       </div>
//     </div>
//   );
// }

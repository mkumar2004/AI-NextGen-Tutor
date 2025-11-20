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
import axios from 'axios';
export const runtime = "nodejs";
import { useUser } from '@stackframe/stack'

function DiscussionRoom() {
  const { roomid } = useParams();
  const Discussiondata = useQuery(api.DicussRoom.GetDiscussionInfo, { id: roomid });
  const [expert, setExpert] = useState();
  const [enablemic, setEnableMic] = useState(false);
  const [messages, setMessages] = useState([]);
  const [feedback, setFeedBack] = useState([]);
  const [interimText, setInterimText] = useState('');
  const [micPermission, setMicPermission] = useState(null);
  const [isConnecting, setIsConnecting] = useState(false);
  const messagesEndRef = useRef(null);
  const vapiRef = useRef(null);
  const UpdateConversion = useMutation(api.DicussRoom.UpdateConversation)
  const user = useUser();
  


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
                        user's name: ${user?.displayName || 'User'}
                        IMPORTANT CONVERSATION RULES:
                        - Wait for the user to completely finish their thought before responding
                        - If the user pauses briefly, they may be thinking - give them time
                        - Only respond when you're certain the user has finished speaking
                        - Keep responses concise (1 sentence) and conversational
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
        firstMessage: `Hello! I'm ${expert?.name || 'your career coach'}.Welcome ${user?.displayName || 'User'}. I'm here to help you with ${Discussiondata?.topic || 'your career'}. What would you like to discuss today?`,
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
    
    UpdateConversion({
      id: Discussiondata._id,
      coversation: messages,
      Feedback:feedback
    })
    feedbackHandler();
    // console.log(' Stopped');
    setInterimText('');
  };

const feedbackHandler = async()=>{
  try {
  const res = await axios.post("/api/feedback", {
    conversation: messages,
  });
  
  setFeedBack(res.data.feedback);
  
} catch (err) {
  console.log(" Feedback API error:", err.response?.data || err);
}}


  return (

    <div
    >
      <h2 className='text-lg font-bold'>{Discussiondata?.coachingOption}</h2>
       <h2 className='text-lg font-bold'>{Discussiondata?.topic}</h2>
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
                ✓ OnGoing
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

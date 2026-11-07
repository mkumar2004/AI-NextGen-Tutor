"use client";

import React, { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import { useParams } from 'next/navigation';
import { useMutation, useQuery } from 'convex/react';
import { UserButton, useUser } from '@stackframe/stack';
import { api } from '@/convex/_generated/api';
import { Button } from '@/components/ui/button';
import Pdf from '@/components/features/discussion/Pdf';
import { STAFF_MEMBERS } from '@/constants';

function DiscussionRoom() {
  const { roomid } = useParams();
  const Discussiondata = useQuery(api.DicussRoom.GetDiscussionInfo, { id: roomid });
  const [expert, setExpert] = useState();
  const [enablemic, setEnableMic] = useState(false);
  const [messages, setMessages] = useState([]);
  const [feedback, setFeedBack] = useState(false);
  const [interimText, setInterimText] = useState('');
  const [micPermission, setMicPermission] = useState(null);
  const [isConnecting, setIsConnecting] = useState(false);
  const [isAiThinking, setIsAiThinking] = useState(false);
  const [isAiSpeaking, setIsAiSpeaking] = useState(false);

  const messagesEndRef = useRef(null);
  const recognitionRef = useRef(null);
  const isCallActiveRef = useRef(false);
  const isAiSpeakingRef = useRef(false);
  const messagesRef = useRef([]);

  const UpdateConversion = useMutation(api.DicussRoom.UpdateConversation);
  const user = useUser();

  // Keep refs in sync for event callbacks
  useEffect(() => {
    messagesRef.current = messages;
  }, [messages]);

  useEffect(() => {
    isAiSpeakingRef.current = isAiSpeaking;
  }, [isAiSpeaking]);

  useEffect(() => {
    if (Discussiondata) {
      const data = STAFF_MEMBERS.find((item) => item.name === Discussiondata.Mentor);
      setExpert(data);
    }
  }, [Discussiondata]);

  // Auto-scroll on new messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, interimText]);

  // Check microphone permissions on mount
  useEffect(() => {
    checkMicrophonePermission();
    return () => {
      stopVoiceSession();
    };
  }, []);

  const checkMicrophonePermission = async () => {
    try {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        setMicPermission(false);
        return;
      }
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      setMicPermission(true);
      stream.getTracks().forEach((track) => track.stop());
    } catch {
      setMicPermission(false);
    }
  };

  // Text-To-Speech for AI voice response
  const speakText = (text) => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
      return;
    }

    // Stop recognition while speaking so AI's voice is not picked up as user speech
    if (recognitionRef.current) {
      try {
        recognitionRef.current.abort();
      } catch {}
      recognitionRef.current = null;
    }

    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 1.0;
    utterance.pitch = expert?.gender?.toLowerCase() === 'male' ? 0.9 : 1.1;

    // Pick natural voice if available
    const voices = window.speechSynthesis.getVoices();
    const preferredVoice =
      voices.find(
        (v) =>
          v.lang.startsWith('en') &&
          (expert?.gender?.toLowerCase() === 'male'
            ? /male|david|george|alex|guy|james/i.test(v.name)
            : /female|zira|samantha|karen|victoria|jenny/i.test(v.name))
      ) || voices.find((v) => v.lang.startsWith('en'));

    if (preferredVoice) {
      utterance.voice = preferredVoice;
    }

    // Chrome bugfix: speech synthesis can pause silently on long utterances
    const ttsInterval = setInterval(() => {
      if (window.speechSynthesis.speaking) {
        window.speechSynthesis.pause();
        window.speechSynthesis.resume();
      } else {
        clearInterval(ttsInterval);
      }
    }, 10000);

    const onDoneSpeaking = () => {
      clearInterval(ttsInterval);
      setIsAiSpeaking(false);
      // Small buffer (350ms) to ensure audio reverberation ends before mic listens
      setTimeout(() => {
        if (isCallActiveRef.current) {
          startSpeechRecognition();
        }
      }, 350);
    };

    utterance.onstart = () => {
      setIsAiSpeaking(true);
    };

    utterance.onend = onDoneSpeaking;
    utterance.onerror = onDoneSpeaking;

    window.speechSynthesis.speak(utterance);
  };

  // Send transcription to Gemini AI API
  const sendToGemini = async (userText) => {
    if (!userText || !userText.trim()) return;

    const userMessage = {
      role: 'user',
      text: userText.trim(),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    const updatedMessages = [...messagesRef.current, userMessage];
    setMessages(updatedMessages);
    setInterimText('');
    setIsAiThinking(true);

    try {
      const response = await fetch('/api/gemini-voice', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          topic: Discussiondata?.topic,
          option: Discussiondata?.coachingOption,
          expertName: expert?.name,
          messages: updatedMessages,
          userText: userText.trim(),
        }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || 'Gemini response error');
      }

      const aiReply = data.reply;
      const aiMessage = {
        role: 'assistant',
        text: aiReply,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      const finalMessages = [...updatedMessages, aiMessage];
      setMessages(finalMessages);
      setIsAiThinking(false);

      if (UpdateConversion && roomid) {
        try {
          await UpdateConversion({
            id: roomid,
            coversation: finalMessages.map((m) => `${m.role === 'user' ? 'User' : expert?.name || 'Coach'}: ${m.text}`).join('\n'),
          });
        } catch (dbErr) {
          console.warn('Convex update notice:', dbErr);
        }
      }

      speakText(aiReply);
    } catch (err) {
      setIsAiThinking(false);
      console.error('Failed to get Gemini response:', err);
      const fallbackReply = "I had a momentary glitch, but I'm right here with you. What else were you thinking?";
      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          text: fallbackReply,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
      speakText(fallbackReply);
    }
  };

  // Setup Browser Speech Recognition (STT)
  const startSpeechRecognition = () => {
    if (typeof window === 'undefined' || !isCallActiveRef.current || isAiSpeakingRef.current) return;

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert('Speech recognition is not supported in this browser. Please use Google Chrome or Microsoft Edge.');
      stopVoiceSession();
      return;
    }

    if (recognitionRef.current) {
      try {
        recognitionRef.current.abort();
      } catch {}
      recognitionRef.current = null;
    }

    const recognition = new SpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = 'en-US';

    recognition.onresult = (event) => {
      if (isAiSpeakingRef.current) return;

      let interim = '';
      let finalTranscript = '';

      for (let i = event.resultIndex; i < event.results.length; ++i) {
        const item = event.results[i];
        if (item.isFinal) {
          finalTranscript += item[0].transcript;
        } else {
          interim += item[0].transcript;
        }
      }

      if (interim) {
        setInterimText(interim);
      }

      if (finalTranscript && finalTranscript.trim().length > 1) {
        setInterimText('');
        try {
          recognition.abort();
        } catch {}
        sendToGemini(finalTranscript.trim());
      }
    };

    recognition.onerror = (event) => {
      if (event.error !== 'no-speech' && event.error !== 'aborted') {
        console.warn('Speech recognition notice:', event.error);
      }
    };

    recognition.onend = () => {
      if (isCallActiveRef.current && !isAiSpeakingRef.current) {
        setTimeout(() => {
          if (isCallActiveRef.current && !isAiSpeakingRef.current) {
            try {
              recognition.start();
            } catch {}
          }
        }, 200);
      }
    };

    try {
      recognition.start();
      recognitionRef.current = recognition;
    } catch {
      setTimeout(() => {
        if (isCallActiveRef.current && !isAiSpeakingRef.current) {
          try {
            recognition.start();
            recognitionRef.current = recognition;
          } catch {}
        }
      }, 300);
    }
  };

  const ConnectToServer = async () => {
    try {
      setIsConnecting(true);

      if (micPermission === false) {
        alert('Microphone access is required. Please enable microphone permissions in your browser.');
        setIsConnecting(false);
        return;
      }

      isCallActiveRef.current = true;
      setEnableMic(true);
      setIsConnecting(false);
      setInterimText('');

      const welcomeText = `Hello! I'm ${expert?.name || 'your career coach'}. Welcome ${user?.displayName || 'there'}. I'm here to help you with ${Discussiondata?.topic || 'your career'}. What would you like to discuss today?`;

      const initialMessage = {
        role: 'assistant',
        text: welcomeText,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      setMessages([initialMessage]);
      speakText(welcomeText);
    } catch (error) {
      console.error('Failed to start session:', error);
      setIsConnecting(false);
      setEnableMic(false);
    }
  };

  const stopVoiceSession = () => {
    isCallActiveRef.current = false;
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    if (recognitionRef.current) {
      try {
        recognitionRef.current.abort();
      } catch {}
      recognitionRef.current = null;
    }
    setEnableMic(false);
    setIsAiSpeaking(false);
    setIsAiThinking(false);
    setInterimText('');
  };

  const Disconnected = (e) => {
    e?.preventDefault();
    stopVoiceSession();
    setFeedBack(true);
  };

  return (
    <div>
      <div className="relative w-full flex justify-between items-start">
        {/* Card */}
        <div className="w-64 px-4 py-3 rounded-xl bg-gradient-to-r from-[#6a11cb] to-[#ff4ecb] shadow-sm overflow-hidden relative">
          <svg
            className="absolute top-1/2 left-1/2 w-16 h-16 -translate-x-1/2 -translate-y-1/2 opacity-10"
            fill="currentColor"
            viewBox="0 0 24 24"
          >
            <path d="M12 2l2.39 6.91h7.27l-5.88 4.28 2.25 6.81L12 15.82 6.97 20.1l2.25-6.81-5.88-4.28h7.27L12 2z" />
          </svg>

          <svg
            className="absolute top-2 right-2 w-6 h-6 opacity-20"
            fill="currentColor"
            viewBox="0 0 24 24"
          >
            <path d="M12 2l2.39 6.91h7.27l-5.88 4.28 2.25 6.81L12 15.82 6.97 20.1l2.25-6.81-5.88-4.28h7.27L12 2z" />
          </svg>

          <p className="relative text-base font-bold text-white">
            {Discussiondata?.coachingOption}
          </p>
          <p className="relative text-xs text-white/90">
            {Discussiondata?.topic}
          </p>
        </div>

        {/* PDF button outside card, aligned to right */}
        <div className="flex items-start">
          {feedback && messages.length > 0 && (
            <Pdf message={messages} Discoussdata={Discussiondata} />
          )}
        </div>
      </div>

      {/* Microphone Permission Warning */}
      {micPermission === false && (
        <div className="mt-3 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
          <p className="text-sm text-yellow-800">
            Microphone access is required for voice chat.
            <button
              onClick={checkMicrophonePermission}
              className="ml-2 underline font-medium"
            >
              Grant Permission
            </button>
          </p>
        </div>
      )}

      <div className="mt-5 grid grid-cols-1 lg:grid-cols-3 gap-10">
        <div className="lg:col-span-2">
          <div
            className="h-[60vh] bg-gray-100 rounded-4xl border flex flex-col justify-center items-center relative border-blue-300"
            style={{ backgroundImage: "url('/InterviewBackground.svg')" }}
          >
            {expert?.pic && (
              <Image
                src={expert.pic}
                height={200}
                width={200}
                alt={expert?.name || 'Expert'}
                className={`w-[80px] h-[80px] object-cover rounded-full transition-all duration-300 ${
                  isAiSpeaking ? 'ring-4 ring-pink-500 scale-105 animate-pulse' : ''
                }`}
              />
            )}
            <h2 className="font-extralight text-gray-500 mt-2">{expert?.name}</h2>
            <div className="px-10 py-5 rounded-lg absolute bottom-10 right-10 border border-blue-400 bg-gray/30 backdrop-blur-md">
              <UserButton />
            </div>
          </div>

          <div className="mt-5 flex flex-col items-center gap-2">
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
              <Button onClick={Disconnected} variant="destructive">
                ⏹️ Stop
              </Button>
            )}

            {/* Status indicators */}
            {micPermission === true && !enablemic && !isConnecting && (
              <span className="text-xs text-green-600">✓ Ready to Connect</span>
            )}

            {isAiThinking && (
              <span className="text-xs bg-amber-100 text-amber-700 px-3 py-1 rounded-full animate-pulse">
                ⚡ {expert?.name || 'Coach'} is thinking...
              </span>
            )}

            {isAiSpeaking && (
              <span className="text-xs bg-purple-100 text-purple-700 px-3 py-1 rounded-full animate-pulse">
                🗣️ {expert?.name || 'Coach'} is speaking...
              </span>
            )}

            {enablemic && !isAiSpeaking && !interimText && (
              <span className="text-xs bg-green-100 text-green-700 px-3 py-1 rounded-full">
                👂 Listening for your voice...
              </span>
            )}

            {enablemic && interimText && (
              <span className="text-xs bg-blue-100 text-blue-600 px-3 py-1 rounded-full animate-pulse">
                🎙️ Hearing you...
              </span>
            )}
          </div>
        </div>

        <div className="h-[60vh] bg-gray-100 rounded-4xl border flex flex-col overflow-hidden">
          <div className="p-5 border-b bg-white flex justify-between items-center">
            <h2 className="font-bold">Live Transcript</h2>
            {enablemic && (
              <span className="text-xs bg-red-100 text-red-600 px-2 py-1 rounded-full">
                🔴 LIVE
              </span>
            )}
          </div>

          <div className="flex-1 p-5 overflow-auto space-y-4">
            {messages.length === 0 && !interimText && (
              <p className="text-sm text-gray-400 text-center mt-10">
                {enablemic ? 'Speak now...' : 'Click Connect to begin'}
              </p>
            )}

            {messages.map((msg, index) => (
              <div
                key={index}
                className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[80%] ${
                    msg.role === 'user'
                      ? 'bg-blue-500 text-white'
                      : 'bg-white border border-gray-200'
                  } rounded-2xl px-4 py-3 shadow-sm`}
                >
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs font-medium opacity-70">
                      {msg.role === 'user' ? 'You' : expert?.name || 'Coach'}
                    </span>
                    <span className="text-xs opacity-50">{msg.timestamp}</span>
                  </div>
                  <p className="text-sm leading-relaxed">{msg.text}</p>
                </div>
              </div>
            ))}

            {interimText && (
              <div className="flex justify-end">
                <div className="max-w-[80%] bg-blue-100 text-blue-800 rounded-2xl px-4 py-3 shadow-sm border border-blue-200">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs font-medium">You</span>
                    <span className="text-xs opacity-50">listening...</span>
                  </div>
                  <p className="text-sm italic leading-relaxed">{interimText}</p>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>
        </div>
      </div>
    </div>
  );
}

export default DiscussionRoom;

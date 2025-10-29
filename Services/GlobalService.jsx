
// "use client";

// import { Experlist } from "@/app/(main)/_components/FeaturesAssistants";

// export const Aimodle = async (topic, coachingOption, msg, conversationHistory = []) => {
//   try {
//     const option = Experlist.find((item) => item.name === coachingOption);
//     if (!option) throw new Error("Invalid coaching option");

//     const PROMPT = option.prompt.replace("{user_topic}", topic);

//     const res = await fetch("/api/ai", {
//       method: "POST",
//       headers: { "Content-Type": "application/json" },
//       body: JSON.stringify({ 
//         topic, 
//         coachingOption, 
//         msg, 
//         prompt: PROMPT,
//         conversationHistory 
//       }),
//     });

//     if (!res.ok) {
//       throw new Error("AI request failed");
//     }

//     const data = await res.json();
//     return data.message || "Could you repeat that?";
//   } catch (err) {
//     console.error("Aimodle error:", err);
//     return "Let me ask that again.";
//   }
// };


// // app/api/ai/route.js
// import { NextResponse } from "next/server";

// export async function POST(req) {
//   try {
//     const { topic, coachingOption, msg, prompt, conversationHistory = [] } = await req.json();

//     const messages = [
//       { 
//         role: "system", 
//         content: `${prompt}

// CRITICAL INSTRUCTIONS FOR FAST INTERVIEW:
// - Keep responses SHORT (1-2 sentences ONLY)
// - Ask ONE direct question immediately
// - No pleasantries, no explanations
// - Be quick and direct
// - Move to next topic fast
// - Example: "Got it. What's your experience with X?"
// - NO delays, NO long responses`
//       },
//       ...conversationHistory.slice(-8).map(msg => ({
//         role: msg.role === 'user' ? 'user' : 'assistant',
//         content: msg
//       })),
//       { role: "user", content: msg }
//     ];

//     const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
//       method: "POST",
//       headers: {
//         "Authorization": `Bearer ${process.env.GROQ_API_KEY}`,
//         "Content-Type": "application/json",
//       },
//       body: JSON.stringify({
//         model: "llama-3.1-8b-instant", // Fast model
//         messages: messages,
//         max_tokens: 60, // Short responses
//         temperature: 0.8,
//         stream: false // No streaming for speed
//       }),
//     });

//     if (!response.ok) {
//       const errorText = await response.text();
//       console.error("Groq API Error:", errorText);
//       return NextResponse.json({ 
//         message: "Next question?" 
//       }, { status: 500 });
//     }

//     const data = await response.json();
//     const aiMessage = data.choices?.[0]?.message?.content || "Continue?";

//     return NextResponse.json({ message: aiMessage.trim() });
//   } catch (err) {
//     console.error("Server Error:", err);
//     return NextResponse.json({ 
//       message: "What else?"
//     }, { status: 500 });
//   }
// }

// "use client";

// import { Experlist } from "@/app/(main)/_components/FeaturesAssistants";

// export const Aimodle = async (topic, coachingOption, msg, conversationHistory = []) => {
//   try {
//     const option = Experlist.find((item) => item.name === coachingOption);
//     if (!option) throw new Error("Invalid coaching option");

//     const PROMPT = option.prompt.replace("{user_topic}", topic);

//     const res = await fetch("/api/ai", {
//       method: "POST",
//       headers: { "Content-Type": "application/json" },
//       body: JSON.stringify({ 
//         topic, 
//         coachingOption, 
//         msg, 
//         prompt: PROMPT,
//         conversationHistory 
//       }),
//     });

//     if (!res.ok) {
//       throw new Error("AI request failed");
//     }

//     const data = await res.json();
//     return data.message || "Could you repeat that?";
//   } catch (err) {
//     console.error("Aimodle error:", err);
//     return "Let me ask that again.";
//   }
// };
"use client";

import { Experlist } from "@/app/(main)/_components/FeaturesAssistants";

/**
 * Aimodle - client wrapper to call /api/ai
 * - topic: string
 * - coachingOption: string (must match Experlist name)
 * - msg: current user message (string)
 * - conversationHistory: [{role:'user'|'assistant', content: '...'}]
 */
export const Aimodle = async (topic, coachingOption, msg, conversationHistory = []) => {
  try {
    const option = Experlist.find((item) => item.name === coachingOption);
    if (!option) {
      console.warn("Aimodle: coaching option not found, falling back to default prompt");
    }

    const PROMPT = option?.prompt?.replace("{user_topic}", topic) || `You are a professional mock interviewer for the topic: ${topic}`;

    const res = await fetch("/api/ai", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        topic,
        coachingOption,
        msg,
        prompt: PROMPT,
        conversationHistory
      }),
    });

    if (!res.ok) {
      console.error("Aimodle: server returned not ok", res.status);
      const text = await res.text();
      console.error("Aimodle server text:", text);
      throw new Error("AI request failed");
    }

    const data = await res.json();
    return data.message || "Could you repeat that?";
  } catch (err) {
    console.error("Aimodle error:", err);
    return "Let me ask that again.";
  }
};

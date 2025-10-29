// import { NextResponse } from "next/server";

// export async function POST(req) {
//   try {
//     const { topic, coachingOption, msg, prompt } = await req.json();

//     const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
//       method: "POST",
//       headers: {
//         "Authorization": `Bearer ${process.env.GROQ_API_KEY}`,
//         "Content-Type": "application/json",
//       },
//       body: JSON.stringify({
//         model: "llama-3.1-8b-instant",
//         messages: [
//           { role: "assistant", content: prompt },
//           { role: "user", content: msg },
//         ],
//         max_tokens: 20,
//       }),
//     });

//     if (!response.ok) {
//       const errorText = await response.text();
//       console.error("Groq API Error:", errorText);
//       return NextResponse.json({ message: "AI request failed", error: errorText }, { status: 500 });
//     }

//     const data = await response.json();
//     const aiMessage = data.choices?.[0]?.message?.content || "No response from AI";

//     return NextResponse.json({ message: aiMessage });
//   } catch (err) {
//     console.error("Server Error:", err);
//     return NextResponse.json({ message: "Server error", error: err.message }, { status: 500 });
//   }
// }
// import { NextResponse } from "next/server";

// export async function POST(req) {
//   try {
//     const { topic, coachingOption, msg, prompt, conversationHistory = [] } = await req.json();

//     // Build proper message array with conversation history
//     const messages = [
//       { 
//         role: "system", 
//         content: `${prompt}

// You are conducting a REAL INTERVIEW about "${topic}". 

// INTERVIEW RULES:
// 1. Listen carefully to what the user just said
// 2. Acknowledge their answer briefly (1-2 words like "Good", "I see", "Interesting")
// 3. Ask the NEXT relevant question based on their response
// 4. Keep questions SHORT and DIRECT (one question only)
// 5. Progress through the interview naturally
// 6. Don't repeat questions
// 7. Build on what they've already told you

// Response format: "[Brief acknowledgment]. [Next specific question]?"

// Example flow:
// - If they mention experience → Ask about specific projects
// - If they describe a project → Ask about challenges faced
// - If they explain a solution → Ask about results/impact
// - Keep it conversational but focused`
//       }
//     ];

//     // Add conversation history properly
//     if (conversationHistory.length > 0) {
//       // Only include last 6 exchanges to keep context manageable
//       const recentHistory = conversationHistory.slice(-12);
//       recentHistory.forEach(msg => {
//         messages.push({
//           role: msg.role === 'user' ? 'user' : 'assistant',
//           content: msg.content
//         });
//       });
//     }

//     // Add current user message
//     messages.push({ 
//       role: "user", 
//       content: msg 
//     });

//     console.log('Sending to AI:', messages); // Debug log

//     const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
//       method: "POST",
//       headers: {
//         "Authorization": `Bearer ${process.env.GROQ_API_KEY}`,
//         "Content-Type": "application/json",
//       },
//       body: JSON.stringify({
//         model: "llama-3.1-8b-instant",
//         messages: messages,
//         max_tokens: 80, // Slightly more for natural responses
//         temperature: 0.7, // Balanced creativity
//         top_p: 0.9,
//         stream: false
//       }),
//     });

//     if (!response.ok) {
//       const errorText = await response.text();
//       console.error("Groq API Error:", errorText);
//       return NextResponse.json({ 
//         message: "Could you say that again?" 
//       }, { status: 500 });
//     }

//     const data = await response.json();
//     const aiMessage = data.choices?.[0]?.message?.content || "What do you think?";

//     console.log('AI Response:', aiMessage); // Debug log

//     return NextResponse.json({ message: aiMessage.trim() });
//   } catch (err) {
//     console.error("Server Error:", err);
//     return NextResponse.json({ 
//       message: "Tell me more about that."
//     }, { status: 500 });
//   }
// }
// app/api/ai/route.js
import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    const { topic = "", coachingOption = "", msg = "", prompt = "", conversationHistory = [] } = await req.json();

    // Build system prompt - instruct the assistant to always respond as:
    // "Ack. Next question?"
    const systemPrompt = `${prompt}

You are conducting a REALISTIC MOCK INTERVIEW about "${topic}".
Follow these rules strictly:
1) Start with a very brief acknowledgment (1-3 words) of the user's prior answer (e.g., "Good", "I see", "Interesting").
2) Then ask exactly ONE direct question that follows naturally from the user's answer.
3) Keep the question short and specific (no multi-part questions).
4) Do not repeat previous questions. Build on conversation history.
5) If user answer lacks details, ask for a specific example or result.
6) Respond format exactly as: "Acknowledgment. Next specific question?"

Return just the short response — no explanations, no meta-text.
`;

    // Compose messages: system, recent history, current user message.
    const history = (Array.isArray(conversationHistory) ? conversationHistory : []).slice(-12);
    const messages = [
      { role: "user", content: prompt },
      // Convert your history to message objects in the proper shape
      ...history.map(h => ({
        role: h.role === "assistant" ? "assistant" : "user",
        content: h.content
      })),
      { role: "assistant", content: msg }
    ];

    // Prefer OpenAI key if present
    const OPENAI_API_KEY = process.env.OOPENROUTER_API_KEY;
    const GROQ_API_KEY = process.env.GROQ_API_KEY;

    if (OPENAI_API_KEY) {
      // Use OpenAI Chat Completions (v1)
      const resp = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${OPENAI_API_KEY}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          model: "gpt-4o-mini", // fallback candidate; if unavailable change to "gpt-4o" or "gpt-3.5-turbo"
          messages,
          max_tokens: 120,
          temperature: 0.4,
          top_p: 0.95
        })
      });

      if (!resp.ok) {
        const txt = await resp.text();
        console.error("OpenAI API error:", resp.status, txt);
        return NextResponse.json({ message: "Could you elaborate?" }, { status: 500 });
      }

      const data = await resp.json();
      const aiMessage = data.choices?.[0]?.message?.content?.trim() || "Could you tell me more?";
      return NextResponse.json({ message: aiMessage });

    } 
    else if (GROQ_API_KEY) {
      // Fallback to GROQ API as you had earlier (example)
      const resp = await fetch("https://api.groq.com/openai/v1/chat/completions", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${GROQ_API_KEY}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          model: "llama-3.1-8b-instant",
          messages,
          max_tokens: 100,
          temperature: 0.6,
          top_p: 0.95
        })
      });

      if (!resp.ok) {
        const txt = await resp.text();
        console.error("GROQ API error:", resp.status, txt);
        return NextResponse.json({ message: "Could you elaborate?" }, { status: 500 });
      }

      const data = await resp.json();
      const aiMessage = data.choices?.[0]?.message?.content?.trim() || "Could you tell me more?";
      return NextResponse.json({ message: aiMessage });
    }
     else {
      console.error("No API key configured (OPENAI_API_KEY or GROQ_API_KEY required).");
      return NextResponse.json({ message: "AI backend not configured. Please set OPENAI_API_KEY." }, { status: 500 });
    }

  } catch (err) {
    console.error("Server error in /api/ai:", err);
    return NextResponse.json({ message: "Please continue — tell me more about that." }, { status: 500 });
  }
}

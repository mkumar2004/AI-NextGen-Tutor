import { NextResponse } from "next/server";
import OpenAI from "openai";

export async function POST(req) {
  try {
    const { topic, option, expertName, messages = [], userText } = await req.json();

    if (!process.env.OPENROUTER_API_KEY) {
      return NextResponse.json(
        { error: "OPENROUTER_API_KEY is not configured" },
        { status: 500 }
      );
    }

    const openai = new OpenAI({
      baseURL: "https://openrouter.ai/api/v1",
      apiKey: process.env.OPENROUTER_API_KEY,
      defaultHeaders: {
        "HTTP-Referer": process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000",
        "X-Title": "AI Mentor App",
      },
    });

    const systemPrompt = `You are ${expertName || "an expert career mentor"} in an interactive voice call.
Topic: ${topic || "Career coaching"}
Style: ${option || "Direct, encouraging, conversational"}

RULES:
1. Speak in 1 or 2 concise, spoken sentences.
2. No bullet points, lists, or markdown.`;

    const chatHistory = messages
      .filter((m) => m.role === "user" || m.role === "assistant")
      .slice(-4)
      .map((m) => ({
        role: m.role,
        content: m.text || m.content || "",
      }));

    if (userText) {
      chatHistory.push({ role: "user", content: userText });
    }

    // Top high-speed models on OpenRouter with instant Time-To-First-Token
    const modelsToTry = [
      "google/gemini-2.5-flash",
      "openai/gpt-4o-mini",
      "openrouter/free",
    ];

    let response = null;
    let lastError = null;

    for (const model of modelsToTry) {
      try {
        response = await openai.chat.completions.create({
          model,
          messages: [
            { role: "system", content: systemPrompt },
            ...chatHistory,
          ],
          max_tokens: 65,
          temperature: 0.3,
        });

        const reply = response?.choices?.[0]?.message?.content?.trim();
        if (reply) {
          return NextResponse.json({ reply });
        }
      } catch (err) {
        console.warn(`Model ${model} failed: ${err.message}. Trying next model...`);
        lastError = err;
      }
    }

    if (lastError) {
      throw lastError;
    }

    return NextResponse.json({
      reply: "I understand. Let's move forward to the next part.",
    });
  } catch (error) {
    console.error("Voice route error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to generate response" },
      { status: 500 }
    );
  }
}

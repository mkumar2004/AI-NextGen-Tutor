import { FEEDBACK_PROMPT } from "@/constants";
import { NextResponse } from "next/server";
import { OpenAI } from "openai";

export const runtime = "nodejs";

export async function POST(req) {
  try {
    const body = await req.json();
    const { conversation } = body;

    if (!conversation) {
      return NextResponse.json(
        { error: "conversation missing" },
        { status: 400 }
      );
    }

    const PROMPT = FEEDBACK_PROMPT.replace(
      "{{converstion}}",
      JSON.stringify(conversation)
    );

    const openai = new OpenAI({
      baseURL: "https://openrouter.ai/api/v1",
      apiKey: process.env.OPENROUTER_API_KEY,
    });

    const candidateModels = [
      "google/gemini-2.5-flash",
      "openai/gpt-4o-mini",
      "openrouter/free",
    ];

    let completion = null;
    let lastError = null;

    for (const model of candidateModels) {
      try {
        completion = await openai.chat.completions.create({
          model,
          messages: [{ role: "user", content: PROMPT }],
        });
        if (completion?.choices?.[0]?.message?.content) {
          break;
        }
      } catch (err) {
        console.warn(`Feedback model ${model} failed: ${err.message}. Trying next candidate...`);
        lastError = err;
      }
    }

    if (!completion && lastError) {
      throw lastError;
    }

    const content =
      completion?.choices?.[0]?.message?.content || "No response";

    return NextResponse.json({ feedback: content }, { status: 200 });
  } catch (error) {
    console.error("API ERROR:", error);

    return NextResponse.json(
      { error: error?.message || "Internal error" },
      { status: 500 }
    );
  }
}

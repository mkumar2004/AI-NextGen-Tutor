import { FEEDBACK_PROMOT } from "@/Services/ConstantHelper";
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

    const PROMOT = FEEDBACK_PROMOT.replace(
      "{{converstion}}",
      JSON.stringify(conversation)
    );

    const openai = new OpenAI({
      baseURL: "https://openrouter.ai/api/v1",
      apiKey: process.env.OPENROUTER_API_KEY,
    });

    const completion = await openai.chat.completions.create({
      model: "google/gemini-2.0-flash-exp:free",
      messages: [{ role: "user", content: PROMOT }],
    });

    console.log(" AI Raw Response:", completion); 

    const content =
      completion?.choices?.[0]?.message?.content || "No response";

    return NextResponse.json({ feedback: content }, { status: 200 });
  } catch (error) {
    console.error(" API ERROR:", error); 

    return NextResponse.json(
      { error: error?.message || "Internal error" },
      { status: 500 }
    );
  }
}
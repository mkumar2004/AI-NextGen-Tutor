import OpenAI from "openai";

export async function POST(req) {
  try {
    if (!process.env.OPENROUTER_API_KEY) {
      return Response.json(
        { error: "OpenRouter API key not configured" },
        { status: 500 }
      );
    }

    const { prompt, messages: incomingMessages } = await req.json();

    const openai = new OpenAI({
      baseURL: "https://openrouter.ai/api/v1",
      apiKey: process.env.OPENROUTER_API_KEY,
      defaultHeaders: {
        "HTTP-Referer": process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000",
        "X-Title": "NextGen Tutor",
      },
    });

    const completion = await openai.chat.completions.create({
      model: "google/gemini-2.5-flash",
      messages: incomingMessages || [
        { role: "user", content: prompt || "Hello!" },
      ],
      max_tokens: 300,
    });

    return Response.json({
      message: completion.choices[0]?.message?.content || "",
    });
  } catch (err) {
    console.error("Chat API Route Error:", err);
    return Response.json(
      { error: err.message || "Internal Server Error" },
      { status: 500 }
    );
  }
}

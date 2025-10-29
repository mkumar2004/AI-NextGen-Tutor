import OpenAI from "openai";

import { Experlist } from "@/app/(main)/_components/FeaturesAssistants";

const client = new OpenAI({
  apiKey: process.env.NEXT_PUBLIC_GROQ_API_KEY,
  baseURL: "https://api.groq.com/openai/v1",
});

export async function streamAIResponse(prompt, onChunk, coachingOption, topic, msg) {
  try {
     const option = Experlist.find((item) => item.name === coachingOption);
    const stream = await client.chat.completions.create({
      model: "llama3-8b-8192", // or llama-3.1-70b-versatile
      messages: [{ role: "user", content: prompt }],
      stream: true,
    });

    for await (const chunk of stream) {
      const content = chunk.choices?.[0]?.delta?.content || "";
      if (content) onChunk(content); // send piece-by-piece updates
    }
  } catch (error) {
    console.error("Stream error:", error);
  }
}

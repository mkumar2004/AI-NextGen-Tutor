import { NextResponse } from "next/server";

export async function GET() {
  try {
    const apiKey = process.env.ASSEMBLY_API_KEY;
    
    console.log("API Key requested, exists:", !!apiKey);
    
    if (!apiKey) {
      return NextResponse.json(
        { error: "API key not configured" },
        { status: 500 }
      );
    }

    return NextResponse.json({ apiKey });
  } catch (error) {
    console.error("Error in getApiKey:", error);
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}
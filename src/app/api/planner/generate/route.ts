import { NextResponse } from "next/server";
import Groq from "groq-sdk";

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

export async function POST(req: Request) {
  try {
    const { topic, level, duration, pace } = await req.json();
    
    // Build your prompt here
    const prompt = buildPrompt({ topic, level, duration, pace });
    
    const completion = await groq.chat.completions.create({
      messages: [{ role: "user", content: prompt }],
      model: "llama-3.3-70b-versatile",
      temperature: 0.55,
      max_tokens: 4500,
    });
    
    const response = completion.choices[0]?.message?.content;
    
    // Parse and return
    return NextResponse.json({ plan: JSON.parse(response || "{}") });
  } catch (error) {
    console.error("Groq API error:", error);
    return NextResponse.json({ error: "Failed to generate plan" }, { status: 500 });
  }
}

function buildPrompt({ topic, level, duration, pace }: any) {
  // Copy your makePrompt function from App.jsx
  return "Your prompt here...";
}
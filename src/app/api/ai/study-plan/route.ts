import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { generateStudyPlan } from "@/lib/groq";

// POST /api/ai/study-plan
export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });

    const { radarData } = await req.json();

    if (!radarData || radarData.length === 0) {
      return NextResponse.json(
        { success: false, error: "No performance data available. Complete some quizzes first." },
        { status: 400 }
      );
    }

    const plan = await generateStudyPlan(radarData, session.user.name);
    return NextResponse.json({ success: true, data: plan });
  } catch (err: any) {
    console.error("Groq error:", err);
    return NextResponse.json(
      { success: false, error: "AI service temporarily unavailable. Try again in a moment." },
      { status: 500 }
    );
  }
}

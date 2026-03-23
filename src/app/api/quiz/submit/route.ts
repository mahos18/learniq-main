import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { connectDB } from "@/lib/db";
import { Module } from "@/models/Course";
import { QuizResult, RewardTransaction } from "@/models/Enrollment";
import User from "@/models/User";

// POST /api/quiz/submit
export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });

    await connectDB();
    const { moduleId, courseId, questionId, selectedIndex } = await req.json();

    // Find the module and locate the question
    const mod = await Module.findById(moduleId);
    if (!mod) return NextResponse.json({ success: false, error: "Module not found" }, { status: 404 });

    let foundQuestion = null;
    for (const block of mod.contentBlocks) {
      const q = block.questions.find((q: any) => q._id.toString() === questionId);
      if (q) { foundQuestion = q; break; }
    }

    if (!foundQuestion) {
      return NextResponse.json({ success: false, error: "Question not found" }, { status: 404 });
    }

    const isCorrect   = selectedIndex === foundQuestion.correctIndex;
    const pointsEarned = isCorrect ? foundQuestion.bonusPoints : 0;

    // Store result
    await QuizResult.create({
      student:      session.user.id,
      module:       moduleId,
      course:       courseId,
      questionId,
      topic:        foundQuestion.topic,
      isCorrect,
      pointsEarned,
    });

    // Award points if correct
    if (isCorrect && pointsEarned > 0) {
      await User.findByIdAndUpdate(session.user.id, { $inc: { rewardPoints: pointsEarned } });
      await RewardTransaction.create({
        student:     session.user.id,
        action:      "checkpoint_correct",
        points:      pointsEarned,
        description: `Checkpoint quiz correct — ${foundQuestion.topic}`,
      });
    }

    return NextResponse.json({
      success: true,
      data: {
        isCorrect,
        correctIndex: foundQuestion.correctIndex,
        pointsEarned,
        topic: foundQuestion.topic,
      },
    });
  } catch {
    return NextResponse.json({ success: false, error: "Submit failed" }, { status: 500 });
  }
}

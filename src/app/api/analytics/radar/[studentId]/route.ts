import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { connectDB } from "@/lib/db";
import { QuizResult } from "@/models/Enrollment";

// GET /api/analytics/radar/[studentId]
export async function GET(
  _: NextRequest,
  { params }: { params: { studentId: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });

    await connectDB();

    // Aggregate quiz results by topic for this student
    const results = await QuizResult.aggregate([
      { $match: { student: params.studentId } },
      {
        $group: {
          _id:        "$topic",
          total:      { $sum: 1 },
          correct:    { $sum: { $cond: ["$isCorrect", 1, 0] } },
        },
      },
      {
        $project: {
          topic:  "$_id",
          total:  1,
          correct: 1,
          score: {
            $round: [
              { $multiply: [{ $divide: ["$correct", "$total"] }, 100] },
              0
            ]
          },
          _id: 0,
        },
      },
      { $sort: { score: -1 } },
    ]);

    return NextResponse.json({ success: true, data: results });
  } catch {
    return NextResponse.json({ success: false, error: "Failed to fetch radar data" }, { status: 500 });
  }
}

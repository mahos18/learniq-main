import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { connectDB } from "@/lib/db";
import { Enrollment } from "@/models/Enrollment";

// GET /api/my-courses
export async function GET(_: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    await connectDB();

    const enrollments = await Enrollment.find({ student: session.user.id })
      .populate({
        path: "course",                                   // ← singular "course" not "courses"
        populate: { path: "instructor", select: "name image" },
      })
      .sort({ updatedAt: -1 })
      .lean();
    // Note: course.modules is an array of ObjectId refs — populate separately if needed
    // .populate("course.modules") is invalid Mongoose — removed

    return NextResponse.json({ success: true, data: enrollments });
  } catch (err) {
    console.error("my-courses error:", err);
    return NextResponse.json({ success: false, error: "Failed to fetch courses" }, { status: 500 });
  }
}
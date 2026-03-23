import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { connectDB } from "@/lib/db";
import { Course } from "@/models/Course";
import { Enrollment } from "@/models/Enrollment";
import User from "@/models/User";

// POST /api/enroll — enroll in a course (free or points redemption)
export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });

    await connectDB();
    const { courseId, usePoints } = await req.json();

    const course = await Course.findById(courseId);
    if (!course || !course.isPublished) {
      return NextResponse.json({ success: false, error: "Course not found" }, { status: 404 });
    }

    // Check if already enrolled
    const existing = await Enrollment.findOne({ student: session.user.id, course: courseId });
    if (existing) {
      return NextResponse.json({ success: false, error: "Already enrolled" }, { status: 400 });
    }

    // Points redemption flow
    if (usePoints && course.pointCost > 0) {
      const user = await User.findById(session.user.id);
      if (!user || user.rewardPoints < course.pointCost) {
        return NextResponse.json({ success: false, error: "Insufficient points" }, { status: 400 });
      }
      // Deduct points
      await User.findByIdAndUpdate(session.user.id, { $inc: { rewardPoints: -course.pointCost } });
    }

    const enrollment = await Enrollment.create({
      student: session.user.id,
      course:  courseId,
      completedModules: [],
      overallProgress:  0,
    });

    return NextResponse.json({ success: true, data: enrollment }, { status: 201 });
  } catch (err: any) {
    if (err.code === 11000) {
      return NextResponse.json({ success: false, error: "Already enrolled" }, { status: 400 });
    }
    return NextResponse.json({ success: false, error: "Enrollment failed" }, { status: 500 });
  }
}

// GET /api/enroll?courseId=xxx — check enrollment status
export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });

    await connectDB();
    const courseId = new URL(req.url).searchParams.get("courseId");

    const enrollment = await Enrollment.findOne({
      student: session.user.id,
      course: courseId,
    }).lean();

    return NextResponse.json({ success: true, data: enrollment });
  } catch {
    return NextResponse.json({ success: false, error: "Failed" }, { status: 500 });
  }
}

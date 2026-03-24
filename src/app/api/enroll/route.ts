import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { connectDB } from "@/lib/db";
import {Enrollment} from "@/models/Enrollment";
import {Course} from "@/models/Course";

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { courseId } = await req.json();
    await connectDB();

    // Check if course exists
    const course = await Course.findById(courseId);
    if (!course) {
      return NextResponse.json({ error: "Course not found" }, { status: 404 });
    }

    // Check if already enrolled
    const existingEnrollment = await Enrollment.findOne({
      student: session.user.id,
      course: courseId,
    });

    if (existingEnrollment) {
      return NextResponse.json({ error: "Already enrolled" }, { status: 400 });
    }

    // For paid courses, return 402 with checkout info
    if (course.pricing?.type === "paid") {
      return NextResponse.json(
        { 
          error: "This is a paid course",
          requiresPayment: true,
          courseId: course._id.toString(),
          price: course.pricing.amount,
          currency: course.pricing.currency,
          pointCost: course.pointCost,
        },
        { status: 402 }
      );
    }

    // Create enrollment for free course
    const enrollment = await Enrollment.create({
      student: session.user.id,
      course: courseId,
      enrolledAt: new Date(),
      completedModules: [],
      overallProgress: 0,
      isCompleted: false,
    });

    return NextResponse.json({
      success: true,
      enrollment,
      message: "Successfully enrolled!",
    });
  } catch (error) {
    console.error("Enrollment error:", error);
    return NextResponse.json(
      { error: "Failed to enroll" },
      { status: 500 }
    );
  }
}
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { connectDB } from "@/lib/db";
import { Course, Module } from "@/models/Course";
import { Enrollment, RewardTransaction } from "@/models/Enrollment";
import User from "@/models/User";

// POST /api/progress — mark a module complete, award points, update overall progress
export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });

    await connectDB();
    const { moduleId, courseId } = await req.json();

    const [mod, enrollment, course] = await Promise.all([
      Module.findById(moduleId),
      Enrollment.findOne({ student: session.user.id, course: courseId }),
      Course.findById(courseId),
    ]);

    if (!mod || !enrollment || !course) {
      return NextResponse.json({ success: false, error: "Not found" }, { status: 404 });
    }

    // Already completed — idempotent
    const alreadyDone = enrollment.completedModules
      .map((id: any) => id.toString())
      .includes(moduleId);

    if (alreadyDone) {
      return NextResponse.json({ success: true, data: { alreadyCompleted: true } });
    }

    // Add to completed modules
    enrollment.completedModules.push(moduleId);

    // Recalculate progress
    const totalModules  = course.modules.length;
    const doneCount     = enrollment.completedModules.length;
    enrollment.overallProgress = Math.round((doneCount / totalModules) * 100);
    enrollment.isCompleted     = doneCount === totalModules;
    await enrollment.save();

    // Award points for module completion
    const pts = mod.rewardOnComplete || 25;
    await User.findByIdAndUpdate(session.user.id, { $inc: { rewardPoints: pts } });
    await RewardTransaction.create({
      student:     session.user.id,
      action:      "module_complete",
      points:      pts,
      description: `Completed module: ${mod.title}`,
    });

    // Bonus points if course fully completed
    let bonusPoints = 0;
    if (enrollment.isCompleted) {
      bonusPoints = 100;
      await User.findByIdAndUpdate(session.user.id, { $inc: { rewardPoints: 100 } });
      await RewardTransaction.create({
        student:     session.user.id,
        action:      "course_complete",
        points:      100,
        description: `Completed course: ${course.title}`,
      });
    }

    return NextResponse.json({
      success: true,
      data: {
        pointsEarned:    pts,
        bonusPoints,
        overallProgress: enrollment.overallProgress,
        isCompleted:     enrollment.isCompleted,
      },
    });
  } catch {
    return NextResponse.json({ success: false, error: "Failed to update progress" }, { status: 500 });
  }
}

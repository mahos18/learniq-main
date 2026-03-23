import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { connectDB } from "@/lib/db";
import AdvancedTask from "@/models/AdvancedTask";

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { courseId, step } = await req.json();
    await connectDB();

    const taskSet = await AdvancedTask.findOne({
      userId: session.user.id,
      courseId,
    });

    if (!taskSet) {
      return NextResponse.json({ error: "Tasks not found" }, { status: 404 });
    }

    // Update task completion
    const taskIndex = taskSet.tasks.findIndex((t: any) => t.step === step);
    if (taskIndex !== -1) {
      taskSet.tasks[taskIndex].completed = true;
      
      // Recalculate progress
      const completedCount = taskSet.tasks.filter((t: any) => t.completed).length;
      taskSet.overallProgress = Math.round((completedCount / taskSet.tasks.length) * 100);
      
      // Check if all tasks completed
      if (taskSet.overallProgress === 100) {
        taskSet.completedAt = new Date();
      }
      
      await taskSet.save();
    }

    return NextResponse.json({ tasks: taskSet });
  } catch (error) {
    console.error("Error completing task:", error);
    return NextResponse.json(
      { error: "Failed to complete task" },
      { status: 500 }
    );
  }
}
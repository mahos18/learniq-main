import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { connectDB } from "@/lib/db";
import { Enrollment } from "@/models/Enrollment";
import { Course } from "@/models/Course"; 
import DashboardClient from "./DashboardClient";

export default async function StudentDashboardPage() {
  const session = await getServerSession(authOptions);
  await connectDB();

  // Fetch enrolled courses with progress
  const enrollments = await Enrollment.find({ student: session!.user.id })
    .populate({ path: "course", populate: { path: "instructor", select: "name" } })
    .sort({ updatedAt: -1 })
    .lean();

  // Stats
  const totalModulesDone = enrollments.reduce(
    (acc, e) => acc + e.completedModules.length, 0
  );
  const completedCourses = enrollments.filter((e) => e.isCompleted).length;

  return (
    <DashboardClient
      user={session!.user}
      enrollments={JSON.parse(JSON.stringify(enrollments))}
      stats={{
        totalModulesDone,
        completedCourses,
        enrolledCourses: enrollments.length,
        rewardPoints: session!.user.rewardPoints,
      }}
    />
  );
}

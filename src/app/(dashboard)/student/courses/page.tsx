import { connectDB } from "@/lib/db";
import { Course } from "@/models/Course";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { Enrollment } from "@/models/Enrollment";
import CoursesClient from "./CoursesClient";

export default async function StudentCoursesPage() {
  const session = await getServerSession(authOptions);
  await connectDB();

  const [courses, enrollments] = await Promise.all([
    Course.find({ isPublished: true })
      .populate("instructor", "name")
      .sort({ createdAt: -1 })
      .lean(),
    Enrollment.find({ student: session!.user.id }).lean(),
  ]);

  const enrolledIds = new Set(enrollments.map((e) => e.course.toString()));

  return (
    <CoursesClient
      courses={JSON.parse(JSON.stringify(courses))}
      enrolledIds={Array.from(enrolledIds)}
      userPoints={session!.user.rewardPoints}
    />
  );
}

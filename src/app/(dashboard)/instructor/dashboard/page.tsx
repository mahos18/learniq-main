import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { connectDB } from "@/lib/db";
import { Course } from "@/models/Course";
import { Enrollment } from "@/models/Enrollment";
import InstructorDashClient from "./InstructorDashClient";

export default async function InstructorDashboardPage() {
  const session = await getServerSession(authOptions);
  await connectDB();

  const courses = await Course.find({ instructor: session!.user.id })
    .sort({ createdAt: -1 })
    .lean();

  const courseIds = courses.map((c) => c._id);
  const totalStudents = await Enrollment.countDocuments({ course: { $in: courseIds } });

  return (
    <InstructorDashClient
      courses={JSON.parse(JSON.stringify(courses))}
      stats={{ totalStudents, totalCourses: courses.length }}
      instructorName={session!.user.name}
    />
  );
}

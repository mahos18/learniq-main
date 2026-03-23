import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { connectDB } from "@/lib/db";
import { Course } from "@/models/Course";
import { Enrollment } from "@/models/Enrollment";
import Link from "next/link";
import { PlusCircle, Users, BookOpen, Eye, EyeOff } from "lucide-react";

export default async function InstructorCoursesPage() {
  const session = await getServerSession(authOptions);
  await connectDB();

  const courses = await Course.find({ instructor: session!.user.id })
    .sort({ createdAt: -1 })
    .lean();

  // Get enrollment counts per course
  const enrollmentCounts = await Promise.all(
    courses.map((c) => Enrollment.countDocuments({ course: c._id }))
  );

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 text-white">My Courses</h1>
          <p className="text-slate-500 text-slate-400 text-sm mt-0.5">
            {courses.length} course{courses.length !== 1 ? "s" : ""} created
          </p>
        </div>
        <Link href="/instructor/builder" className="btn-primary flex items-center gap-2">
          <PlusCircle size={16} />
          New Course
        </Link>
      </div>

      {courses.length === 0 ? (
        <div className="card p-12 text-center">
          <BookOpen size={40} className="mx-auto text-slate-300 mb-4" />
          <p className="text-slate-500 font-medium">No courses yet</p>
          <p className="text-slate-400 text-sm mt-1">Create your first course to get started</p>
          <Link href="/instructor/builder" className="btn-primary inline-flex items-center gap-2 mt-4">
            <PlusCircle size={16} /> Create Course
          </Link>
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          {courses.map((course, i) => (
            <div key={course._id.toString()} className="card p-5 flex items-center justify-between gap-4">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="font-semibold text-slate-900 text-white truncate">{course.title}</h3>
                  <span className={`badge text-xs ${course.isPublished ? "bg-reward-50 text-reward-600" : "bg-slate-100 text-slate-500"}`}>
                    {course.isPublished ? "Published" : "Draft"}
                  </span>
                </div>
                <p className="text-sm text-slate-500 text-slate-400 truncate">{course.description}</p>
                <div className="flex items-center gap-4 mt-2 text-xs text-slate-400">
                  <span className="flex items-center gap-1">
                    <Users size={12} /> {enrollmentCounts[i]} students
                  </span>
                  <span className="flex items-center gap-1">
                    <BookOpen size={12} /> {course.modules.length} modules
                  </span>
                  <span className="capitalize">{course.difficulty}</span>
                </div>
              </div>
              <div className="flex items-center gap-2 flex-shrink-0">
                <Link
                  href={`/instructor/courses/${course._id}/builder`}
                  className="btn-secondary text-sm flex items-center gap-1.5"
                >
                  Edit
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

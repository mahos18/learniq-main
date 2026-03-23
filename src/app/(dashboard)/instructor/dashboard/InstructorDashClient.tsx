"use client";

import Link from "next/link";
import axios from "axios";
import toast from "react-hot-toast";
import { useState } from "react";
import { PlusCircle, BookOpen, Users, Eye, EyeOff, Edit, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";

interface Course {
  _id: string; title: string; description: string;
  difficulty: string; isPublished: boolean; modules: string[];
}

interface Props {
  courses: Course[];
  stats: { totalStudents: number; totalCourses: number };
  instructorName: string;
}

export default function InstructorDashClient({ courses: initial, stats, instructorName }: Props) {
  const router = useRouter();
  const [courses, setCourses] = useState(initial);

  const togglePublish = async (courseId: string, current: boolean) => {
    try {
      await axios.put(`/api/courses/${courseId}`, { isPublished: !current });
      setCourses((prev) => prev.map((c) => c._id === courseId ? { ...c, isPublished: !current } : c));
      toast.success(current ? "Course unpublished" : "Course published!");
    } catch {
      toast.error("Failed to update");
    }
  };

  const deleteCourse = async (courseId: string) => {
    if (!confirm("Delete this course? This cannot be undone.")) return;
    try {
      await axios.delete(`/api/courses/${courseId}`);
      setCourses((prev) => prev.filter((c) => c._id !== courseId));
      toast.success("Course deleted");
    } catch {
      toast.error("Failed to delete");
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 text-white">
            Welcome, {instructorName.split(" ")[0]}
          </h1>
          <p className="text-slate-500 text-slate-400 mt-1">Manage your courses</p>
        </div>
        <Link href="/instructor/builder" className="btn-primary flex items-center gap-2 text-sm">
          <PlusCircle size={16} /> New course
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-3">
        <div className="card p-4">
          <BookOpen size={18} className="text-brand-500 mb-1" />
          <div className="text-2xl font-bold text-slate-900 text-white">{stats.totalCourses}</div>
          <div className="text-xs text-slate-500">Total courses</div>
        </div>
        <div className="card p-4">
          <Users size={18} className="text-reward-600 mb-1" />
          <div className="text-2xl font-bold text-slate-900 text-white">{stats.totalStudents}</div>
          <div className="text-xs text-slate-500">Total students</div>
        </div>
      </div>

      {/* Course list */}
      {courses.length === 0 ? (
        <div className="card p-12 text-center">
          <p className="text-slate-500 mb-4">No courses yet. Create your first one!</p>
          <Link href="/instructor/builder" className="btn-primary text-sm">
            Create course
          </Link>
        </div>
      ) : (
        <div className="space-y-3">
          {courses.map((c) => (
            <div key={c._id} className="card p-4 flex items-center gap-4">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <h3 className="font-medium text-slate-900 text-white text-sm line-clamp-1">{c.title}</h3>
                  <span className={cn(
                    "badge text-xs flex-shrink-0",
                    c.isPublished
                      ? "bg-reward-50 text-reward-600 dark:bg-reward-500/20 text-reward-400"
                      : "bg-slate-100 text-slate-500 dark:bg-slate-700 text-slate-400"
                  )}>
                    {c.isPublished ? "Published" : "Draft"}
                  </span>
                </div>
                <p className="text-xs text-slate-400 mt-0.5">{c.modules.length} modules · {c.difficulty}</p>
              </div>

              <div className="flex items-center gap-2 flex-shrink-0">
                <button
                  onClick={() => togglePublish(c._id, c.isPublished)}
                  className="p-2 rounded-input hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
                  title={c.isPublished ? "Unpublish" : "Publish"}
                >
                  {c.isPublished
                    ? <Eye size={16} className="text-reward-600" />
                    : <EyeOff size={16} className="text-slate-400" />}
                </button>
                <Link
                  href={`/instructor/courses/${c._id}`}
                  className="p-2 rounded-input hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
                >
                  <Edit size={16} className="text-brand-500" />
                </Link>
                <button
                  onClick={() => deleteCourse(c._id)}
                  className="p-2 rounded-input hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                >
                  <Trash2 size={16} className="text-red-400" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

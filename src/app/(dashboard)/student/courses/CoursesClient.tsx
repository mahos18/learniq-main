"use client";

import { useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { Search, BookOpen, Coins, CheckCircle } from "lucide-react";
import { cn, difficultyColor } from "@/lib/utils";
import { useRouter } from "next/navigation";

interface Course {
  _id: string; title: string; description: string;
  difficulty: string; tags: string[]; pointCost: number;
  thumbnail?: string; instructor: { name: string };
  modules: string[];
}

interface Props {
  courses: Course[];
  enrolledIds: string[];
  userPoints: number;
}

const DIFFICULTIES = ["All", "beginner", "intermediate", "advanced"];

export default function CoursesClient({ courses, enrolledIds, userPoints }: Props) {
  const router = useRouter();
  const [search, setSearch]         = useState("");
  const [filter, setFilter]         = useState("All");
  const [enrolling, setEnrolling]   = useState<string | null>(null);
  const [enrolled, setEnrolled]     = useState(new Set(enrolledIds));

  const filtered = courses.filter((c) => {
    const matchSearch = c.title.toLowerCase().includes(search.toLowerCase()) ||
      c.tags.some((t) => t.toLowerCase().includes(search.toLowerCase()));
    const matchFilter = filter === "All" || c.difficulty === filter;
    return matchSearch && matchFilter;
  });

  const handleEnroll = async (course: Course, usePoints = false) => {
    setEnrolling(course._id);
    try {
      await axios.post("/api/enroll", { courseId: course._id, usePoints });
      setEnrolled((prev) => new Set([...Array.from(prev), course._id]));
      toast.success("Enrolled successfully!");
      router.refresh();
    } catch (e: any) {
      toast.error(e.response?.data?.error || "Enrollment failed");
    } finally {
      setEnrolling(null);
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-5 animate-fade-in">
      <h1 className="text-2xl font-bold text-slate-900 text-white">Browse Courses</h1>

      {/* Search + filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            className="input pl-9"
            placeholder="Search courses or topics..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div className="flex gap-2 overflow-x-auto no-scrollbar">
          {DIFFICULTIES.map((d) => (
            <button
              key={d}
              onClick={() => setFilter(d)}
              className={cn(
                "badge whitespace-nowrap px-3 py-1.5 transition-colors",
                filter === d
                  ? "bg-brand-600 text-white"
                  : "bg-slate-100 dark:bg-slate-700 text-slate-600 text-slate-300 hover:bg-slate-200"
              )}
            >
              {d === "All" ? "All levels" : d.charAt(0).toUpperCase() + d.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Course grid */}
      {filtered.length === 0 ? (
        <div className="card p-12 text-center text-slate-500">No courses match your search.</div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((course) => {
            const isEnrolled = enrolled.has(course._id);
            const canRedeem  = course.pointCost > 0 && userPoints >= course.pointCost;

            return (
              <div key={course._id} className="card overflow-hidden flex flex-col hover:shadow-card-hover transition-shadow">
                {/* Thumbnail */}
                <div className="h-36 bg-brand-50 dark:bg-brand-900/20 flex items-center justify-center overflow-hidden">
                  {course.thumbnail ? (
                    <img src={course.thumbnail} alt="" className="w-full h-full object-cover" />
                  ) : (
                    <BookOpen size={32} className="text-brand-300" />
                  )}
                </div>

                {/* Content */}
                <div className="p-4 flex-1 flex flex-col gap-2">
                  <div className="flex items-start justify-between gap-2">
                    <h3 className="font-semibold text-slate-900 text-white text-sm line-clamp-2 flex-1">
                      {course.title}
                    </h3>
                    <span className={cn("badge text-xs flex-shrink-0", difficultyColor(course.difficulty))}>
                      {course.difficulty}
                    </span>
                  </div>

                  <p className="text-xs text-slate-500 text-slate-400 line-clamp-2">{course.description}</p>
                  <p className="text-xs text-slate-400">by {course.instructor.name}</p>

                  <div className="flex items-center gap-2 text-xs text-slate-500 mt-auto pt-2 border-t border-slate-100 dark:border-slate-700">
                    <BookOpen size={12} />
                    <span>{course.modules.length} modules</span>
                    {course.pointCost > 0 && (
                      <>
                        <span>·</span>
                        <Coins size={12} className="text-amber-500" />
                        <span className="text-amber-600">{course.pointCost} pts</span>
                      </>
                    )}
                  </div>

                  {/* CTA */}
                  <div className="flex gap-2 mt-2">
                    {isEnrolled ? (
                      <button
                        onClick={() => router.push(`/student/courses/${course._id}`)}
                        className="flex-1 flex items-center justify-center gap-1.5 btn-secondary text-sm py-1.5"
                      >
                        <CheckCircle size={14} className="text-reward-600" />
                        Continue
                      </button>
                    ) : (
                      <>
                        <button
                          onClick={() => handleEnroll(course)}
                          disabled={enrolling === course._id}
                          className="flex-1 btn-primary text-sm py-1.5"
                        >
                          {enrolling === course._id ? "Enrolling..." : "Enroll free"}
                        </button>
                        {canRedeem && (
                          <button
                            onClick={() => handleEnroll(course, true)}
                            disabled={enrolling === course._id}
                            className="btn-secondary text-sm py-1.5 px-2"
                            title={`Redeem for ${course.pointCost} points`}
                          >
                            <Coins size={14} className="text-amber-500" />
                          </button>
                        )}
                      </>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

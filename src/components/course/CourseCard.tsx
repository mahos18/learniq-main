"use client";

import Image from "next/image";
import Link from "next/link";
import { cn, difficultyColor } from "@/lib/utils";
import { BookOpen, Clock, Coins, Users } from "lucide-react";

interface CourseCardProps {
  course: {
    _id: string;
    title: string;
    description: string;
    thumbnail?: string;
    difficulty: string;
    tags: string[];
    pointCost: number;
    modules: string[];
    instructor: { name: string };
  };
  progress?: number;        // 0-100, shown if enrolled
  enrolled?: boolean;
  onEnroll?: () => void;
  enrolling?: boolean;
}

export default function CourseCard({
  course, progress, enrolled, onEnroll, enrolling,
}: CourseCardProps) {
  return (
    <div className="card flex flex-col overflow-hidden hover:shadow-card-hover transition-shadow group">
      {/* Thumbnail */}
      <div className="relative h-36 bg-gradient-to-br from-brand-100 to-brand-200 dark:from-brand-900 dark:to-brand-800">
        {course.thumbnail ? (
          <Image src={course.thumbnail} alt={course.title} fill className="object-cover" />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center">
            <BookOpen size={40} className="text-brand-400 text-brand-500" />
          </div>
        )}
        {/* Difficulty badge */}
        <span className={cn("badge absolute top-2 left-2", difficultyColor(course.difficulty))}>
          {course.difficulty}
        </span>
        {/* Points cost */}
        {course.pointCost > 0 && (
          <span className="absolute top-2 right-2 flex items-center gap-1 bg-amber-400 text-amber-900 text-xs font-semibold px-2 py-0.5 rounded-pill">
            <Coins size={11} /> {course.pointCost} pts
          </span>
        )}
      </div>

      {/* Content */}
      <div className="flex flex-col flex-1 p-4 gap-3">
        <div>
          <h3 className="font-semibold text-slate-900 text-white text-sm line-clamp-2 group-hover:text-brand-600 dark:group-hover:text-brand-400 transition-colors">
            {course.title}
          </h3>
          <p className="text-xs text-slate-500 text-slate-400 mt-1 line-clamp-2">
            {course.description}
          </p>
        </div>

        {/* Meta */}
        <div className="flex items-center gap-3 text-xs text-slate-400">
          <span className="flex items-center gap-1">
            <BookOpen size={11} /> {course.modules?.length ?? 0} modules
          </span>
          <span className="flex items-center gap-1">
            <Users size={11} /> {course.instructor?.name}
          </span>
        </div>

        {/* Tags */}
        {course.tags?.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {course.tags.slice(0, 3).map((tag) => (
              <span key={tag} className="badge bg-slate-100 dark:bg-slate-700 text-slate-600 text-slate-300 text-xs">
                {tag}
              </span>
            ))}
          </div>
        )}

        {/* Progress bar (if enrolled) */}
        {enrolled && progress !== undefined && (
          <div>
            <div className="flex justify-between text-xs text-slate-500 mb-1">
              <span>Progress</span>
              <span className="font-medium text-brand-600">{progress}%</span>
            </div>
            <div className="h-1.5 bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
              <div
                className="h-full bg-brand-500 rounded-full transition-all"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        )}

        {/* CTA */}
        <div className="mt-auto pt-1">
          {enrolled ? (
            <Link
              href={`/student/courses/${course._id}`}
              className="btn-primary w-full text-center text-sm py-2 block"
            >
              {progress === 100 ? "Review Course" : "Continue Learning"}
            </Link>
          ) : (
            <button
              onClick={onEnroll}
              disabled={enrolling}
              className="btn-primary w-full text-sm py-2 disabled:opacity-50"
            >
              {enrolling ? "Enrolling..." : course.pointCost > 0 ? `Enroll (${course.pointCost} pts)` : "Enroll Free"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

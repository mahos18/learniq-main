"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { BookOpen, ExternalLink, ChevronRight, Clock, Star, Play } from "lucide-react";

interface Course {
  _id: string;
  title: string;
  description: string;
  thumbnail?: string;
  tags: string[];
  difficulty: string;
  instructor: { name: string };
  modules: string[];
  pointCost: number;
}

interface CourseRecommendationsProps {
  topic: string;
  onCourseClick?: (courseId: string) => void;
}

export default function CourseRecommendations({ topic, onCourseClick }: CourseRecommendationsProps) {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (topic && topic.length > 3) {
      fetchRecommendations();
    }
  }, [topic]);

  const fetchRecommendations = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch("/api/courses/recommendations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ topic }),
      });
      
      if (!response.ok) throw new Error("Failed to fetch recommendations");
      
      const data = await response.json();
      setCourses(data.courses);
    } catch (err) {
      console.error("Error fetching recommendations:", err);
      setError("Unable to load recommendations");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="p-4 bg-[#0D1226] rounded-xl border border-[#1E2D55]">
        <div className="flex items-center gap-2 mb-3">
          <BookOpen size={16} className="text-indigo-400" />
          <h3 className="text-sm font-semibold text-white">Recommended Courses</h3>
        </div>
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="animate-pulse">
              <div className="h-16 bg-white/5 rounded-lg" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 bg-[#0D1226] rounded-xl border border-[#1E2D55]">
        <div className="flex items-center gap-2 mb-3">
          <BookOpen size={16} className="text-indigo-400" />
          <h3 className="text-sm font-semibold text-white">Recommended Courses</h3>
        </div>
        <p className="text-xs text-gray-500">{error}</p>
      </div>
    );
  }

  if (courses.length === 0) {
    return (
      <div className="p-4 bg-[#0D1226] rounded-xl border border-[#1E2D55]">
        <div className="flex items-center gap-2 mb-3">
          <BookOpen size={16} className="text-indigo-400" />
          <h3 className="text-sm font-semibold text-white">Recommended Courses</h3>
        </div>
        <p className="text-xs text-gray-500">No matching courses found yet</p>
      </div>
    );
  }

  return (
    <div className="p-4 bg-[#0D1226] rounded-xl border border-[#1E2D55]">
      <div className="flex items-center gap-2 mb-3">
        <BookOpen size={16} className="text-indigo-400" />
        <h3 className="text-sm font-semibold text-white">Recommended Courses</h3>
        <span className="text-xs text-gray-500 ml-auto">Based on your topic</span>
      </div>
      
      <div className="space-y-2">
        {courses.map((course) => (
          <Link
            key={course._id}
            href={`/student/courses/${course._id}`}
            onClick={() => onCourseClick?.(course._id)} 
            className="block group"
            >
            <div className="p-3 rounded-lg bg-white/5 hover:bg-white/10 transition-all border border-transparent hover:border-indigo-500/30">
              <div className="flex items-start gap-2">
                <div className="flex-1 min-w-0">
                  <h4 className="text-sm font-medium text-white group-hover:text-indigo-400 transition-colors truncate">
                    {course.title}
                  </h4>
                  <p className="text-xs text-gray-500 mt-0.5 line-clamp-2">
                    {course.description}
                  </p>
                  <div className="flex items-center gap-2 mt-1.5">
                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-white/10 text-gray-400">
                      {course.difficulty}
                    </span>
                    {course.tags.slice(0, 2).map((tag) => (
                      <span key={tag} className="text-[10px] text-indigo-400">
                        #{tag}
                      </span>
                    ))}
                    <span className="text-[10px] text-gray-600">
                      {course.modules.length} modules
                    </span>
                  </div>
                </div>
                <ChevronRight size={14} className="text-gray-500 group-hover:text-indigo-400 transition-colors flex-shrink-0 mt-1" />
              </div>
            </div>
          </Link>
        ))}
      </div>
      
      <Link
        href="/student/courses"
        className="mt-3 text-xs text-indigo-400 hover:text-indigo-300 flex items-center gap-1 transition-colors"
      >
        Browse all courses
        <ExternalLink size={10} />
      </Link>
    </div>
  );
}
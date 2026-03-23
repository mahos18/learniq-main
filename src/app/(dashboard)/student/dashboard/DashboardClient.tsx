"use client";

import Link from "next/link";
import { ArrowRight, Flame, BookOpen, CheckCircle, Trophy, ChevronRight } from "lucide-react";
import { calcProgress } from "@/lib/utils";
import ProgressRing from "@/components/progress/ProgressRing";

interface Props {
  user: { name: string; rewardPoints: number };
  enrollments: any[];
  lastCourse: any;
  stats: { totalEnrolled: number; completedCourses: number; totalModulesDone: number; rewardPoints: number };
}

export default function DashboardClient({ user, enrollments, lastCourse, stats }: Props) {
  const firstName = user.name.split(" ")[0];

  return (
    <div className="max-w-5xl mx-auto flex flex-col gap-8">

      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="font-display font-bold text-bright mb-2" style={{ fontSize: "clamp(28px,4vw,44px)" }}>
            Welcome back, {firstName}
          </h1>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5 px-3 py-1 rounded-full text-sm font-medium"
              style={{ background: "rgba(255,87,51,0.12)", border: "1px solid rgba(255,87,51,0.2)", color: "#FF7A5C" }}>
              <Flame size={13} />
              1 Days Streak
            </div>
            <span className="text-muted text-sm">• Beginner Tier</span>
          </div>
        </div>

        {/* IQ Points balance */}
        <div className="stat-card text-right min-w-[160px]">
          <span className="label">IQ Points Balance</span>
          <div className="flex items-baseline gap-1 justify-end mt-1">
            <span className="font-display font-bold text-bright" style={{ fontSize: "28px" }}>
              {stats.rewardPoints.toLocaleString()}
            </span>
            <span className="label text-electric">XP</span>
          </div>
          <div className="mt-2 progress-track">
            <div className="progress-fill" style={{ width: "65%" }} />
          </div>
        </div>
      </div>

      {/* Main grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">

{/* Active pathways */}
      {enrollments.length > 0 && (
        <div className="lg:col-span-2" >
          <div className="flex items-center justify-between mb-4">
            <p className="label">Active Pathways</p>
            <Link href="/student/courses" className="text-electric text-sm hover:underline flex items-center gap-1">
              View All Courses <ChevronRight size={14} />
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {enrollments.slice(0, 3).map((e: any, i: number) => (
              <div key={e._id} className="card-hover p-4 cursor-pointer" style={{ background: "#0D1226" }}>
                {/* Thumbnail placeholder */}
                <div className="rounded-lg mb-3 h-28 flex items-center justify-center relative overflow-hidden"
                  style={{ background: i === 0 ? "#0D1B40" : i === 1 ? "#1A0D40" : "#0D2A40" }}>
                  <div className="absolute inset-0 opacity-20"
                    style={{ backgroundImage: `radial-gradient(circle at 50% 50%, ${i === 0 ? "#4B7BF5" : i === 1 ? "#7C5CFC" : "#00D4FF"} 0%, transparent 70%)` }} />
                  <span className="badge badge-electric text-xs relative z-10">
                    {e.course?.difficulty?.toUpperCase() ?? "CORE"}
                  </span>
                </div>
                <h4 className="font-display font-semibold text-bright text-sm mb-1 line-clamp-1">
                  {e.course?.title ?? "Course"}
                </h4>
                <p className="text-muted text-xs mb-3 line-clamp-2">{e.course?.description}</p>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <ProgressRing size={28} progress={e.overallProgress ?? 0} />
                    <span className="text-xs text-muted">{e.overallProgress ?? 0}%</span>
                  </div>
                  <Link href="/student/courses" className="text-electric hover:text-cyan transition-colors">
                    <ChevronRight size={16} />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}


        {/* Neural profile — right col */}
        <div>
          <p className="label mb-3">Neural Profile</p>
          <div className="card p-5 flex flex-col items-center gap-4" style={{ background: "#0D1226" }}>
            {/* Hexagon skill preview */}
            <div className="w-full flex items-center justify-center py-2">
              <svg viewBox="0 0 120 120" width="120" height="120">
                <polygon
                  points="60,10 104,35 104,85 60,110 16,85 16,35"
                  fill="rgba(75,123,245,0.15)"
                  stroke="rgba(75,123,245,0.5)"
                  strokeWidth="1.5"
                />
                <text x="60" y="65" textAnchor="middle" fill="#7BA7FF" fontSize="14" fontFamily="Space Grotesk" fontWeight="700">
                  LVL {Math.floor(stats.totalModulesDone / 3) + 1}
                </text>
              </svg>
            </div>
            <div className="w-full grid grid-cols-2 gap-3">
              <div className="text-center">
                <p className="label mb-0.5">Logic</p>
                <p className="font-display font-bold text-electric text-lg">
                  {Math.min(99, 60 + stats.totalModulesDone * 4)}%
                </p>
              </div>
              <div className="text-center">
                <p className="label mb-0.5">Speed</p>
                <p className="font-display font-bold text-pulse text-lg">
                  {Math.min(99, 50 + stats.totalModulesDone * 3)}%
                </p>
              </div>
            </div>
            <Link href="/student/profile" className="btn-ghost w-full justify-center text-sm">
              View Analytics
            </Link>
          </div>
        </div>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: "Active Protocols",  value: stats.totalEnrolled,    color: "#4B7BF5", icon: BookOpen },
          { label: "Modules Done",      value: stats.totalModulesDone, color: "#7C5CFC", icon: CheckCircle },
          { label: "Completed",         value: stats.completedCourses, color: "#39FF84", icon: Trophy },
          { label: "Points Earned",     value: stats.rewardPoints,     color: "#F5A623", icon: Trophy },
        ].map(({ label, value, color, icon: Icon }) => (
          <div key={label} className="stat-card">
            <div className="flex items-center justify-between mb-2">
              <span className="label">{label}</span>
              <div className="w-6 h-6 rounded flex items-center justify-center"
                style={{ background: `${color}18` }}>
                <Icon size={12} style={{ color }} />
              </div>
            </div>
            <p className="font-display font-bold text-2xl text-bright">{value}</p>
          </div>
        ))}
      </div>

      
    </div>
  );
}

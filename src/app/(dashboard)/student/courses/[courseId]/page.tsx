import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { connectDB } from "@/lib/db";
import { Course, Module } from "@/models/Course";
import { Enrollment } from "@/models/Enrollment";
import { redirect, notFound } from "next/navigation";
import Link from "next/link";
import {
  CheckCircle, Lock, PlayCircle, ArrowLeft,
  BookOpen, Clock, Zap, Trophy
} from "lucide-react";

interface Props {
  params: { courseId: string };
}

export default async function CourseDetailPage({ params }: Props) {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/login");

  await connectDB();

  // Check enrollment
  const enrollment = await Enrollment.findOne({
    student: session.user.id,
    course:  params.courseId,
  }).lean();

  if (!enrollment) redirect("/student/courses");

  const course = await Course.findById(params.courseId)
    .populate({ path: "modules", options: { sort: { order: 1 } } })
    .lean();

  if (!course) notFound();

  const completedIds = enrollment.completedModules.map((id: any) => id.toString());
  const modules      = (course.modules as any[]);
  const totalModules = modules.length;
  const doneCount    = completedIds.length;
  const progress     = totalModules > 0 ? Math.round((doneCount / totalModules) * 100) : 0;

  // Find the first incomplete module for "Resume" button
  const nextModule = modules.find((m: any) => !completedIds.includes(m._id.toString()));

  return (
    <div className="max-w-3xl mx-auto animate-fade-in">

      {/* Back */}
      <Link href="/student/courses"
        className="inline-flex items-center gap-1.5 text-sm text-muted hover:text-bright transition-colors mb-6">
        <ArrowLeft size={14} /> Back to courses
      </Link>

      {/* Course hero */}
      <div className="card p-6 mb-6 relative overflow-hidden" style={{ background: "#0D1226" }}>
        {/* Glow */}
        <div className="absolute inset-0 pointer-events-none"
          style={{ background: "radial-gradient(ellipse at 80% 20%, rgba(75,123,245,0.12) 0%, transparent 60%)" }} />

        <div className="relative z-10">
          {/* Header */}
          <div className="flex items-start justify-between gap-4 mb-4 flex-wrap">
            <div>
              <span className="badge badge-electric text-xs mb-2 inline-flex capitalize">
                {(course as any).difficulty}
              </span>
              <h1 className="font-display font-bold text-bright text-xl md:text-2xl">
                {(course as any).title}
              </h1>
              <p className="text-muted text-sm mt-1 max-w-lg">
                {(course as any).description}
              </p>
            </div>
          </div>

          {/* Stats row */}
          <div className="flex items-center gap-5 mb-5 flex-wrap">
            <div className="flex items-center gap-1.5 text-sm text-muted">
              <BookOpen size={14} style={{ color: "#4B7BF5" }} />
              {totalModules} modules
            </div>
            <div className="flex items-center gap-1.5 text-sm text-muted">
              <CheckCircle size={14} style={{ color: "#39FF84" }} />
              {doneCount} completed
            </div>
            <div className="flex items-center gap-1.5 text-sm text-muted">
              <Trophy size={14} style={{ color: "#F5A623" }} />
              {progress}% done
            </div>
          </div>

          {/* Progress bar */}
          <div className="mb-5">
            <div className="flex items-center justify-between mb-1.5">
              <span className="label">Overall progress</span>
              <span className="font-display font-bold text-sm" style={{ color: "#4B7BF5" }}>
                {progress}%
              </span>
            </div>
            <div className="progress-track" style={{ height: "6px" }}>
              <div className="progress-fill" style={{ width: `${progress}%` }} />
            </div>
          </div>

          {/* Resume / Start button */}
          {nextModule ? (
            <Link
              href={`/student/courses/${params.courseId}/modules/${nextModule._id}`}
              className="btn-primary text-sm inline-flex items-center gap-2"
            >
              <PlayCircle size={16} />
              {doneCount === 0 ? "Start Learning" : "Resume Course"}
            </Link>
          ) : (
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium"
              style={{ background: "rgba(57,255,132,0.1)", border: "1px solid rgba(57,255,132,0.2)", color: "#39FF84" }}>
              <Trophy size={16} />
              Course Completed!
            </div>
          )}
        </div>
      </div>

      {/* Module list */}
      <div>
        <p className="label mb-4">Course Curriculum</p>
        <div className="flex flex-col gap-3">
          {modules.map((mod: any, index: number) => {
            const isDone     = completedIds.includes(mod._id.toString());
            const isNext     = nextModule?._id.toString() === mod._id.toString();
            const isLocked   = !isDone && !isNext && index > 0 &&
              !completedIds.includes(modules[index - 1]?._id.toString());
            const blockCount = mod.contentBlocks?.length ?? 0;
            const quizCount  = mod.contentBlocks?.filter(
              (b: any) => b.type === "quiz_end" || b.type === "quiz_popup"
            ).length ?? 0;

            return (
              <div
                key={mod._id}
                className="card p-4 flex items-center gap-4 transition-all"
                style={{
                  background: isDone
                    ? "rgba(57,255,132,0.04)"
                    : isNext
                    ? "rgba(75,123,245,0.06)"
                    : "#0D1226",
                  borderColor: isDone
                    ? "rgba(57,255,132,0.2)"
                    : isNext
                    ? "rgba(75,123,245,0.3)"
                    : "#1E2D55",
                  opacity: isLocked ? 0.5 : 1,
                }}
              >
                {/* Status icon */}
                <div className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0"
                  style={{
                    background: isDone
                      ? "rgba(57,255,132,0.12)"
                      : isNext
                      ? "rgba(75,123,245,0.15)"
                      : "rgba(62,79,112,0.3)",
                    border: `1px solid ${isDone
                      ? "rgba(57,255,132,0.25)"
                      : isNext
                      ? "rgba(75,123,245,0.3)"
                      : "#1E2D55"}`,
                  }}>
                  {isDone ? (
                    <CheckCircle size={16} style={{ color: "#39FF84" }} />
                  ) : isLocked ? (
                    <Lock size={16} style={{ color: "#3D4F70" }} />
                  ) : (
                    <PlayCircle size={16} style={{ color: "#4B7BF5" }} />
                  )}
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-0.5">
                    <span className="label" style={{ fontSize: "9px" }}>
                      Module {mod.order}
                    </span>
                    {isNext && (
                      <span className="badge badge-electric" style={{ fontSize: "9px", padding: "1px 6px" }}>
                        Up next
                      </span>
                    )}
                    {isDone && (
                      <span className="badge badge-neon" style={{ fontSize: "9px", padding: "1px 6px" }}>
                        Completed
                      </span>
                    )}
                  </div>
                  <p className="font-display font-semibold text-sm text-bright truncate">
                    {mod.title}
                  </p>
                  <div className="flex items-center gap-3 mt-1">
                    <span className="flex items-center gap-1 text-xs text-muted">
                      <BookOpen size={10} /> {blockCount} blocks
                    </span>
                    {quizCount > 0 && (
                      <span className="flex items-center gap-1 text-xs text-muted">
                        <Zap size={10} style={{ color: "#7C5CFC" }} /> {quizCount} quiz
                      </span>
                    )}
                    <span className="flex items-center gap-1 text-xs text-muted">
                      <Trophy size={10} style={{ color: "#F5A623" }} />
                      +{mod.rewardOnComplete ?? 25} XP
                    </span>
                  </div>
                </div>

                {/* Action */}
                {!isLocked && (
                  <Link
                    href={`/student/courses/${params.courseId}/modules/${mod._id}`}
                    className="flex-shrink-0"
                  >
                    <div className="text-sm font-medium px-3 py-1.5 rounded-lg transition-all"
                      style={{
                        background: isDone
                          ? "rgba(57,255,132,0.08)"
                          : "rgba(75,123,245,0.12)",
                        border: `1px solid ${isDone ? "rgba(57,255,132,0.2)" : "rgba(75,123,245,0.25)"}`,
                        color: isDone ? "#39FF84" : "#7BA7FF",
                      }}>
                      {isDone ? "Review" : "Start"}
                    </div>
                  </Link>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Tags */}
      {(course as any).tags?.length > 0 && (
        <div className="mt-6">
          <p className="label mb-3">Topics covered</p>
          <div className="flex flex-wrap gap-2">
            {(course as any).tags.map((tag: string) => (
              <span key={tag} className="badge badge-electric">{tag}</span>
            ))}
          </div>
        </div>
      )}

    </div>
  );
}
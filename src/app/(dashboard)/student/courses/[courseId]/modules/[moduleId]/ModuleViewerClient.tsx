"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import Link from "next/link";
import { useRouter } from "next/navigation";
import ReactMarkdown from "react-markdown";
import { useQuiz } from "@/hooks/useQuiz";
import { getYouTubeId, cn } from "@/lib/utils";
import {
  ChevronLeft, ChevronRight, CheckCircle2, Zap,Download,
  FileText, List, X, PlayCircle, BookOpen, Award, Sparkles, ExternalLink,
  Video, Image as ImageIcon, File, HelpCircle
} from "lucide-react";

interface Props {
  course: any;
  mod: any;
  enrollment: any;
  studentId: string;
}

export default function ModuleViewerClient({ course, mod, enrollment, studentId }: Props) {
  const router = useRouter();
  const [completed, setCompleted] = useState(
    enrollment.completedModules?.map((id: any) => id.toString()).includes(mod._id.toString())
  );
  const [marking, setMarking] = useState(false);
  const [panelOpen, setPanelOpen] = useState(false);
  const [showCompletionModal, setShowCompletionModal] = useState(false);
  const [certificate, setCertificate] = useState<any>(null);
  const [downloading, setDownloading] = useState(false);
  const [contentCompleted, setContentCompleted] = useState(false);
  const [watchedVideos, setWatchedVideos] = useState<Set<string>>(new Set());
  const [viewedContent, setViewedContent] = useState<Set<string>>(new Set());
  const { results, submitting, submitAnswer } = useQuiz(mod._id, course._id);

  const sortedBlocks = [...(mod.contentBlocks || [])].sort((a, b) => a.order - b.order);
  const allModules = course.modules || [];
  const currentIdx = allModules.findIndex((m: any) => m._id.toString() === mod._id.toString());
  const prevMod = allModules[currentIdx - 1];
  const nextMod = allModules[currentIdx + 1];

  // Check if all required content has been viewed
  const checkContentCompletion = () => {
    const requiredBlocks = sortedBlocks.filter((block: any) => 
      block.type !== "quiz_popup" && block.type !== "quiz_end" // Quizzes are optional
    );
    
    const allViewed = requiredBlocks.every((block: any) => {
      if (block.type === "youtube" || block.type === "video") {
        return watchedVideos.has(block._id);
      }
      return viewedContent.has(block._id);
    });
    
    setContentCompleted(allViewed);
  };

  // Mark content as viewed
  const markContentViewed = (blockId: string) => {
    if (!viewedContent.has(blockId)) {
      setViewedContent(prev => new Set(prev).add(blockId));
    }
  };

  // Mark video as watched (requires user interaction)
  const markVideoWatched = (blockId: string) => {
    if (!watchedVideos.has(blockId)) {
      setWatchedVideos(prev => new Set(prev).add(blockId));
    }
  };

  // Check completion when dependencies change
  useEffect(() => {
    checkContentCompletion();
  }, [watchedVideos, viewedContent, sortedBlocks]);

  const markComplete = async () => {
    if (completed || marking) return;
    
    // Check if content is completed
    if (!contentCompleted) {
      toast.error("Please complete all module content before marking as complete");
      return;
    }
    
    setMarking(true);
    try {
      const { data } = await axios.post("/api/progress", {
        moduleId: mod._id,
        courseId: course._id,
      });
      setCompleted(true);
      toast.success(`+${data.data.pointsEarned} points! Module complete`);
      
      if (data.data.isCompleted) {
        toast.success("🎉 Course completed! +100 bonus points");
        setCertificate(data.data.certificate);
        setShowCompletionModal(true);
      }
    } catch {
      toast.error("Failed to mark complete");
    } finally {
      setMarking(false);
    }
  };

  const handleDownloadCertificate = async () => {
    if (!certificate) return;
    setDownloading(true);
    try {
      const response = await fetch(`/api/certificates/${certificate.id}/download`);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `certificate_${course.title.replace(/\s+/g, "_")}.pdf`;
      link.click();
      window.URL.revokeObjectURL(url);
      toast.success("Certificate downloaded!");
    } catch (error) {
      toast.error("Failed to download certificate");
    } finally {
      setDownloading(false);
    }
  };

  const handleViewCertificate = () => {
    router.push(`/student/certificates`);
    setShowCompletionModal(false);
  };

  const handleGoToCourse = () => {
    router.push(`/student/courses/${course._id}`);
    setShowCompletionModal(false);
  };

  const handleGoToTasks = () => {
    router.push(`/student/courses/${course._id}/tasks`);
    setShowCompletionModal(false);
  };

  // Calculate content progress
  const requiredBlocks = sortedBlocks.filter((block: any) => 
    block.type !== "quiz_popup" && block.type !== "quiz_end"
  );
  const viewedCount = requiredBlocks.filter((block: any) => {
    if (block.type === "youtube" || block.type === "video") {
      return watchedVideos.has(block._id);
    }
    return viewedContent.has(block._id);
  }).length;
  const contentProgress = requiredBlocks.length > 0 
    ? Math.round((viewedCount / requiredBlocks.length) * 100) 
    : 100;

  return (
    <>
      <div className="flex flex-col min-h-full -m-7">
        {/* Top bar - same as before */}
        <div className="flex items-center justify-between px-5 py-3 border-b border-slate-200 border-slate-700 bg-white bg-slate-900 sticky top-0 z-20">
          <div className="flex items-center gap-3 min-w-0">
            <Link
              href="/student/courses"
              className="flex items-center gap-1 text-sm text-slate-500 hover:text-brand-500 transition-colors flex-shrink-0"
            >
              <ChevronLeft size={16} />
              <span className="hidden sm:inline">Back</span>
            </Link>
            <div className="h-4 w-px bg-slate-200 bg-slate-700 flex-shrink-0" />
            <div className="min-w-0">
              <p className="text-xs text-slate-400 truncate">{course.title}</p>
              <p className="text-sm font-semibold text-slate-800 text-white truncate">{mod.title}</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {prevMod ? (
              <Link
                href={`/student/courses/${course._id}/modules/${prevMod._id}`}
                className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-sm text-slate-600 text-slate-300 hover:bg-slate-100 hover:bg-slate-700 transition-colors"
              >
                <ChevronLeft size={15} /> Previous
              </Link>
            ) : (
              <button disabled className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-sm text-slate-300 text-slate-600 cursor-not-allowed">
                <ChevronLeft size={15} /> Previous
              </button>
            )}
            {nextMod ? (
              <Link
                href={`/student/courses/${course._id}/modules/${nextMod._id}`}
                className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-sm text-slate-600 text-slate-300 hover:bg-slate-100 hover:bg-slate-700 transition-colors"
              >
                Next <ChevronRight size={15} />
              </Link>
            ) : (
              <button disabled className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-sm text-slate-300 text-slate-600 cursor-not-allowed">
                Next <ChevronRight size={15} />
              </button>
            )}
          </div>

          <button
            onClick={() => setPanelOpen(true)}
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium text-slate-600 text-slate-300 hover:bg-slate-100 hover:bg-slate-700 transition-colors border border-slate-200 border-slate-600"
          >
            <List size={15} />
            <span className="hidden sm:inline">Modules</span>
            <span className="text-xs text-slate-400">{currentIdx + 1}/{allModules.length}</span>
          </button>
        </div>

        {/* Content Progress Bar */}
        {!completed && (
          <div className="px-5 pt-4">
            <div className="flex justify-between text-xs text-slate-400 mb-1.5">
              <span className="flex items-center gap-1">
                <BookOpen size={12} />
                Module Progress
              </span>
              <span>{contentProgress}%</span>
            </div>
            <div className="h-1.5 bg-slate-200 bg-slate-700 rounded-full overflow-hidden">
              <div
                className="h-full bg-brand-500 rounded-full transition-all duration-300"
                style={{ width: `${contentProgress}%` }}
              />
            </div>
            <p className="text-xs text-slate-400 mt-1">
              {requiredBlocks.length - viewedCount} items remaining
            </p>
          </div>
        )}

        {/* Main content area */}
        <div className="flex-1 flex relative">
          {/* Content stream */}
          <div className="flex-1 min-w-0 px-5 sm:px-8 lg:px-16 xl:px-24 py-8 flex flex-col gap-6">
            <div>
              <h1 className="text-2xl font-bold text-white">{mod.title}</h1>
              <p className="text-sm text-slate-400 mt-1">
                Module {currentIdx + 1} of {allModules.length}
                {completed && (
                  <span className="ml-3 inline-flex items-center gap-1 text-green-500 font-medium">
                    <CheckCircle2 size={13} /> Completed
                  </span>
                )}
              </p>
            </div>

            {/* Content blocks with completion tracking */}
            {sortedBlocks.map((block: any) => (
              <ContentBlock
                key={block._id}
                block={block}
                results={results}
                submitting={submitting}
                onSubmit={submitAnswer}
                onMarkViewed={() => markContentViewed(block._id)}
                onMarkVideoWatched={() => markVideoWatched(block._id)}
              />
            ))}

            {/* Mark complete button */}
            <div className="card p-5 flex items-center justify-between gap-4 mt-2">
              <div>
                <p className="font-medium text-white">
                  {completed ? "Module completed!" : "Ready to complete this module?"}
                </p>
                <p className="text-sm text-slate-400">
                  {completed
                    ? "You earned reward points for this module."
                    : contentCompleted 
                      ? `Mark complete to earn +${mod.rewardOnComplete || 25} points`
                      : `Complete all ${requiredBlocks.length} items above to unlock completion`}
                </p>
              </div>
              <button
                onClick={markComplete}
                disabled={completed || marking || !contentCompleted}
                className={cn(
                  "flex items-center gap-2 px-5 py-2.5 rounded-input font-medium transition-all flex-shrink-0",
                  completed
                    ? "bg-green-50 text-green-600 bg-green-600/20 cursor-default"
                    : !contentCompleted
                      ? "bg-gray-700 text-gray-400 cursor-not-allowed"
                      : "btn-primary"
                )}
              >
                <CheckCircle2 size={16} />
                {completed 
                  ? "Completed" 
                  : marking 
                    ? "Saving..." 
                    : !contentCompleted 
                      ? "Complete All Content First" 
                      : "Mark Complete"}
              </button>
            </div>

            {/* Bottom prev/next */}
            <div className="flex justify-between gap-4 pb-8">
              {prevMod ? (
                <Link
                  href={`/student/courses/${course._id}/modules/${prevMod._id}`}
                  className="btn-secondary flex items-center gap-2"
                >
                  <ChevronLeft size={16} /> {prevMod.title}
                </Link>
              ) : <div />}
              {nextMod && (
                <Link
                  href={`/student/courses/${course._id}/modules/${nextMod._id}`}
                  className="btn-primary flex items-center gap-2 ml-auto"
                >
                  {nextMod.title} <ChevronRight size={16} />
                </Link>
              )}
            </div>
          </div>

          {/* Module panel - same as before */}
          <ModulePanel
            open={panelOpen}
            onClose={() => setPanelOpen(false)}
            course={course}
            allModules={allModules}
            currentModuleId={mod._id}
            enrollment={enrollment}
          />
        </div>
      </div>

      {/* Completion Modal - same as before */}
      {showCompletionModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
          {/* ... modal content ... */}
          <div className="relative max-w-2xl w-full bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl shadow-2xl overflow-hidden animate-scaleUp">
            <div className="relative p-8 text-center">
              <div className="mb-6 inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-amber-500 to-amber-600 animate-bounce">
                <Award size={40} className="text-white" />
              </div>
              <h2 className="text-3xl font-bold text-white mb-2">🎉 Congratulations! 🎉</h2>
              <p className="text-xl text-amber-400 font-semibold mb-2">{course.title}</p>
              <p className="text-gray-300 mb-6">
                You've successfully completed the course! You've earned a certificate and 100 bonus points.
              </p>
              {certificate && (
                <div className="mb-6 p-4 bg-gray-800/50 rounded-xl border border-gray-700">
                  <p className="text-sm text-gray-400 mb-2">Your Certificate Preview</p>
                  <img src={certificate.imageUrl} alt="Certificate Preview" className="w-full h-32 object-cover rounded-lg" />
                </div>
              )}
              <div className="flex flex-wrap gap-3 justify-center">
                <button onClick={handleDownloadCertificate} disabled={downloading} className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white font-semibold rounded-xl transition-all transform hover:scale-105">
                  <Download size={18} /> {downloading ? "Downloading..." : "Download Certificate"}
                </button>
                <button onClick={handleViewCertificate} className="flex items-center gap-2 px-6 py-3 bg-gray-700 hover:bg-gray-600 text-white font-semibold rounded-xl transition-all">
                  <Award size={18} /> View All Certificates
                </button>
                <button onClick={handleGoToTasks} className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 text-white font-semibold rounded-xl transition-all transform hover:scale-105">
                  <Sparkles size={18} /> Continue with Advanced Tasks
                </button>
                <button onClick={handleGoToCourse} className="flex items-center gap-2 px-6 py-3 bg-gray-700 hover:bg-gray-600 text-white font-semibold rounded-xl transition-all">
                  <BookOpen size={18} /> Back to Course
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

// Updated ContentBlock with completion tracking
function ContentBlock({ block, results, submitting, onSubmit, onMarkViewed, onMarkVideoWatched }: any) {
  const [videoWatched, setVideoWatched] = useState(false);
  const [hasViewed, setHasViewed] = useState(false);

  useEffect(() => {
    if (!hasViewed) {
      onMarkViewed();
      setHasViewed(true);
    }
  }, []);

  const handleVideoEnded = () => {
    if (!videoWatched) {
      setVideoWatched(true);
      onMarkVideoWatched();
    }
  };

  switch (block.type) {
    case "youtube":
      return <YouTubeBlock block={block} onVideoEnded={handleVideoEnded} />;
    case "video":
      return <VideoBlock block={block} onVideoEnded={handleVideoEnded} />;
    case "pdf":
      return <PdfBlock block={block} onMarkViewed={onMarkViewed} />;
    case "image":
      return <ImageBlock block={block} onMarkViewed={onMarkViewed} />;
    case "text":
      return <TextBlock block={block} onMarkViewed={onMarkViewed} />;
    case "quiz_popup":
      return <QuizBlock block={block} isPopup results={results} submitting={submitting} onSubmit={onSubmit} />;
    case "quiz_end":
      return <QuizBlock block={block} isPopup={false} results={results} submitting={submitting} onSubmit={onSubmit} />;
    default:
      return null;
  }
}

// Updated YouTubeBlock with completion tracking
function YouTubeBlock({ block, onVideoEnded }: any) {
  const videoId = getYouTubeId(block.url || "");
  const [hasStarted, setHasStarted] = useState(false);

  if (!videoId) return null;

  return (
    <div className="card overflow-hidden">
      {block.title && <p className="px-4 pt-4 font-medium text-slate-200">{block.title}</p>}
      <div className="relative pt-[56.25%] mt-3">
        <iframe
          className="absolute inset-0 w-full h-full"
          src={`https://www.youtube.com/embed/${videoId}?enablejsapi=1`}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          onLoad={() => {
            // Mark as viewed when iframe loads
            setTimeout(() => {
              if (!hasStarted) {
                setHasStarted(true);
                // Video considered watched after 70% completion
                setTimeout(onVideoEnded, 30000); // 30 seconds as watched
              }
            }, 1000);
          }}
        />
      </div>
      <div className="px-4 py-2 text-xs text-slate-400 border-t border-slate-700">
        <span className="flex items-center gap-1">
          <PlayCircle size={12} />
          Watch the video to mark as complete
        </span>
      </div>
    </div>
  );
}

// Updated VideoBlock with completion tracking
function VideoBlock({ block, onVideoEnded }: any) {
  const [progress, setProgress] = useState(0);

  const handleTimeUpdate = (e: React.SyntheticEvent<HTMLVideoElement>) => {
    const video = e.currentTarget;
    const percent = (video.currentTime / video.duration) * 100;
    setProgress(percent);
    if (percent >= 70 && !video.dataset.completed) {
      video.dataset.completed = "true";
      onVideoEnded();
    }
  };

  return (
    <div className="card overflow-hidden">
      {block.title && <p className="px-4 pt-4 font-medium text-slate-200">{block.title}</p>}
      <video
        controls
        className="w-full mt-3"
        src={block.url}
        onTimeUpdate={handleTimeUpdate}
      >
        Your browser does not support the video tag.
      </video>
      <div className="px-4 py-2 text-xs text-slate-400 border-t border-slate-700">
        <div className="flex items-center gap-2">
          <span>Watch progress:</span>
          <div className="flex-1 h-1 bg-slate-700 rounded-full overflow-hidden">
            <div className="h-full bg-brand-500 transition-all" style={{ width: `${progress}%` }} />
          </div>
          <span>{Math.round(progress)}%</span>
        </div>
        <span className="text-xs">Watch at least 70% to mark as complete</span>
      </div>
    </div>
  );
}

// Updated PdfBlock with completion tracking
function PdfBlock({ block, onMarkViewed }: any) {
  const [hasViewed, setHasViewed] = useState(false);

  const handleView = () => {
    if (!hasViewed) {
      setHasViewed(true);
      onMarkViewed();
    }
  };

  return (
    <div className="card overflow-hidden" onLoad={handleView}>
      <div className="flex items-center gap-2 px-4 py-3 border-b border-slate-700">
        <FileText size={16} className="text-brand-500" />
        <p className="font-medium text-slate-200">{block.title || "Document"}</p>
      </div>
      <iframe src={block.url} className="w-full h-[600px]" onLoad={handleView} />
    </div>
  );
}

// Updated ImageBlock with completion tracking
function ImageBlock({ block, onMarkViewed }: any) {
  const [hasViewed, setHasViewed] = useState(false);

  const handleView = () => {
    if (!hasViewed) {
      setHasViewed(true);
      onMarkViewed();
    }
  };

  return (
    <div className="card p-4" onLoad={handleView}>
      <img src={block.url} alt={block.title || "Image"} className="w-full rounded-input object-cover" onLoad={handleView} />
      {block.title && <p className="text-sm text-slate-400 mt-2 text-center">{block.title}</p>}
    </div>
  );
}

// Updated TextBlock with completion tracking
function TextBlock({ block, onMarkViewed }: any) {
  const [hasViewed, setHasViewed] = useState(false);

  useEffect(() => {
    if (!hasViewed) {
      setHasViewed(true);
      onMarkViewed();
    }
  }, []);

  return (
    <div className="card p-5 prose prose-invert max-w-none prose-headings:font-bold prose-code:bg-slate-700 prose-code:px-1 prose-code:rounded">
      {block.title && <h3 className="font-semibold text-slate-200 mb-3">{block.title}</h3>}
      <ReactMarkdown>{block.content || ""}</ReactMarkdown>
    </div>
  );
}

// Module Panel Component
function ModulePanel({ open, onClose, course, allModules, currentModuleId, enrollment }: any) {
  return (
    <>
      {open && (
        <div className="fixed inset-0 bg-black/40 z-30 lg:bg-transparent lg:pointer-events-none" onClick={onClose} />
      )}
      <aside
        className={cn(
          "fixed right-0 top-0 h-full w-80 bg-slate-900 border-l border-slate-700 z-40 flex flex-col transition-transform duration-300 ease-in-out",
          open ? "translate-x-0" : "translate-x-full"
        )}
      >
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-700 flex-shrink-0">
          <div>
            <p className="text-xs text-slate-400 uppercase tracking-wide font-medium">Course Content</p>
            <p className="text-sm font-semibold text-white mt-0.5 line-clamp-1">{course.title}</p>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-slate-700 transition-colors text-slate-400">
            <X size={16} />
          </button>
        </div>

        <div className="px-5 py-3 border-b border-slate-700 flex-shrink-0">
          <div className="flex justify-between text-xs text-slate-400 mb-1.5">
            <span>{enrollment.completedModules?.length || 0} of {allModules.length} completed</span>
            <span>{Math.round(enrollment.overallProgress || 0)}%</span>
          </div>
          <div className="h-1.5 bg-slate-700 rounded-full overflow-hidden">
            <div className="h-full bg-brand-500 rounded-full transition-all" style={{ width: `${enrollment.overallProgress || 0}%` }} />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto py-2">
          {allModules.map((m: any, i: number) => {
            const done = enrollment.completedModules?.map((id: any) => id.toString()).includes(m._id.toString());
            const active = m._id.toString() === currentModuleId;
            return (
              <Link
                key={m._id}
                href={`/student/courses/${course._id}/modules/${m._id}`}
                onClick={onClose}
                className={cn(
                  "flex items-center gap-3 px-5 py-3.5 transition-colors border-l-2",
                  active ? "bg-brand-900/20 border-brand-500" : "border-transparent hover:bg-slate-800"
                )}
              >
                <div className={cn(
                  "w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 text-xs font-semibold",
                  done ? "bg-green-500 text-white" : active ? "bg-brand-600 text-white" : "bg-slate-700 text-slate-400"
                )}>
                  {done ? <CheckCircle2 size={14} /> : <PlayCircle size={14} />}
                </div>
                <div className="min-w-0">
                  <p className={cn("text-sm truncate", active ? "font-semibold text-brand-400" : "text-slate-300")}>
                    {m.title}
                  </p>
                  <p className="text-xs text-slate-400 mt-0.5">Module {i + 1}</p>
                </div>
                {done && !active && <span className="ml-auto text-xs text-green-500 font-medium flex-shrink-0">Done</span>}
              </Link>
            );
          })}
        </div>
      </aside>
    </>
  );
}


function QuizBlock({ block, isPopup, results, submitting, onSubmit }: any) {
  return (
    <div className={cn(
      "card p-5",
      isPopup
        ? "border-2 border-ai-200 textborder-ai-700 bg-ai-50 textbg-ai-900/20"
        : "border border-slate-200 textborder-slate-700"
    )}>
      <div className="flex items-center gap-2 mb-4">
        <Zap size={18} className={isPopup ? "text-ai-600" : "text-brand-600"} />
        <span className={cn("font-semibold", isPopup ? "text-white " : "text-white texttext-white")}>
          {isPopup ? "Quick Check — Answer for bonus points!" : "Module Assessment"}
        </span>
        {isPopup && (
          <span className="ml-auto points-chip text-white">
            <Zap size={11} /> +{block.questions?.[0]?.bonusPoints || 15} pts each
          </span>
        )}
      </div>
      <div className="flex flex-col gap-5">
        {block.questions?.map((q: any) => {
          const result = results[q._id];
          return (
            <div key={q._id}>
              <p className="font-medium text-white texttext-white mb-3">{q.question}</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {q.options.map((opt: string, idx: number) => {
                  let style = "border border-slate-200 textborder-slate-600 hover:border-brand-400 hover:bg-brand-50 texthover:bg-brand-900/20";
                  if (result) {
                    if (idx === result.correctIndex) style = "border-2 border-green-500 bg-green-50 textbg-green-900/20";
                    else if (idx !== result.correctIndex && result.isCorrect === false) style = "border border-red-200 bg-red-50 textbg-red-900/10 opacity-60";
                  }
                  return (
                    <button
                      key={idx}
                      disabled={!!result || submitting === q._id}
                      onClick={() => onSubmit(q._id, idx)}
                      className={cn(
                        "text-left px-4 py-2.5 rounded-input text-sm transition-all",
                        style,
                        !result && "cursor-pointer active:scale-95"
                      )}
                    >
                      <span className="font-medium text-slate-400 mr-2">{String.fromCharCode(65 + idx)}.</span>
                      {opt}
                    </button>
                  );
                })}
              </div>
              {result && (
                <p className={cn("text-sm mt-2 font-medium", result.isCorrect ? "text-green-600" : "text-red-500")}>
                  {result.isCorrect ? `✓ Correct! +${result.pointsEarned} points` : "✗ Incorrect — review this topic"}
                </p>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}





// "use client";

// import { useState } from "react";
// import axios from "axios";
// import toast from "react-hot-toast";
// import Link from "next/link";
// import ReactMarkdown from "react-markdown";
// import { useQuiz } from "@/hooks/useQuiz";
// import { getYouTubeId, cn } from "@/lib/utils";
// import {
//   ChevronLeft, ChevronRight, CheckCircle2, Zap,
//   FileText, Video, Image as ImageIcon, BookOpen, Lock
// } from "lucide-react";

// interface Props {
//   course: any;
//   mod: any;
//   enrollment: any;
//   studentId: string;
// }

// export default function ModuleViewerClient({ course, mod, enrollment, studentId }: Props) {
//   const [completed, setCompleted] = useState(
//     enrollment.completedModules?.map((id: any) => id.toString()).includes(mod._id.toString())
//   );
//   const [marking, setMarking] = useState(false);
//   const { results, submitting, submitAnswer } = useQuiz(mod._id, course._id);

//   const sortedBlocks = [...(mod.contentBlocks || [])].sort((a, b) => a.order - b.order);

//   // Next/prev module navigation
//   const allModules = course.modules || [];
//   const currentIdx = allModules.findIndex((m: any) => m._id.toString() === mod._id.toString());
//   const prevMod = allModules[currentIdx - 1];
//   const nextMod = allModules[currentIdx + 1];

//   const markComplete = async () => {
//     if (completed || marking) return;
//     setMarking(true);
//     try {
//       const { data } = await axios.post("/api/progress", {
//         moduleId: mod._id,
//         courseId: course._id,
//       });
//       setCompleted(true);
//       toast.success(`+${data.data.pointsEarned} points! Module complete`);
//       if (data.data.isCompleted) toast.success("🎉 Course completed! +100 bonus points");
//     } catch {
//       toast.error("Failed to mark complete");
//     } finally {
//       setMarking(false);
//     }
//   };

//   return (
//     <div className="flex gap-6 max-w-6xl mx-auto">

//       {/* ── Left sidebar: course roadmap ── */}
//       <aside className="hidden lg:flex w-64 flex-shrink-0 flex-col gap-1 sticky top-20 h-fit">
//         <Link
//           href="/student/courses"
//           className="flex items-center gap-1.5 text-sm text-slate-500 hover:text-brand-600 mb-3 transition-colors"
//         >
//           <ChevronLeft size={15} /> Back to courses
//         </Link>
//         <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-1 px-1">
//           {course.title}
//         </p>
//         {allModules.map((m: any, i: number) => {
//           const done = enrollment.completedModules?.map((id: any) => id.toString()).includes(m._id.toString());
//           const active = m._id.toString() === mod._id.toString();
//           return (
//             <Link
//               key={m._id}
//               href={`/student/courses/${course._id}/modules/${m._id}`}
//               className={cn(
//                 "flex items-center gap-2 px-3 py-2.5 rounded-input text-sm transition-all",
//                 active  ? "bg-brand-50 textbg-brand-900/30 text-brand-700 text-brand-300 font-medium"
//                         : "text-slate-600 text-slate-400 hover:bg-slate-50 texthover:bg-slate-700/50"
//               )}
//             >
//               <span className={cn(
//                 "w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 text-xs",
//                 done   ? "bg-reward-500 text-white"
//                        : active ? "bg-brand-600 text-white" : "bg-slate-200 textbg-slate-600 text-slate-500"
//               )}>
//                 {done ? <CheckCircle2 size={12} /> : i + 1}
//               </span>
//               <span className="truncate">{m.title}</span>
//             </Link>
//           );
//         })}
//       </aside>

//       {/* ── Main content stream ── */}
//       <div className="flex-1 min-w-0 flex flex-col gap-5">
//         <div>
//           <h1 className="text-2xl font-bold text-slate-900 text-white">{mod.title}</h1>
//           <p className="text-sm text-slate-400 mt-1">{course.title} · Module {currentIdx + 1} of {allModules.length}</p>
//         </div>

//         {/* Content blocks */}
//         {sortedBlocks.map((block: any) => (
//           <ContentBlock
//             key={block._id}
//             block={block}
//             results={results}
//             submitting={submitting}
//             onSubmit={submitAnswer}
//           />
//         ))}

//         {/* Mark complete button */}
//         <div className="card p-5 flex items-center justify-between gap-4">
//           <div>
//             <p className="font-medium text-slate-900 text-white">
//               {completed ? "Module completed!" : "Finished with this module?"}
//             </p>
//             <p className="text-sm text-slate-400">
//               {completed ? "You earned reward points for this module." : `Mark complete to earn +${mod.rewardOnComplete || 25} points`}
//             </p>
//           </div>
//           <button
//             onClick={markComplete}
//             disabled={completed || marking}
//             className={cn(
//               "flex items-center gap-2 px-5 py-2.5 rounded-input font-medium transition-all",
//               completed
//                 ? "bg-reward-50 text-reward-600 textbg-reward-600/20 cursor-default"
//                 : "btn-primary"
//             )}
//           >
//             <CheckCircle2 size={16} />
//             {completed ? "Completed" : marking ? "Saving..." : "Mark Complete"}
//           </button>
//         </div>

//         {/* Prev / Next navigation */}
//         <div className="flex justify-between gap-4 pb-6">
//           {prevMod ? (
//             <Link
//               href={`/student/courses/${course._id}/modules/${prevMod._id}`}
//               className="btn-secondary flex items-center gap-2"
//             >
//               <ChevronLeft size={16} /> {prevMod.title}
//             </Link>
//           ) : <div />}
//           {nextMod && (
//             <Link
//               href={`/student/courses/${course._id}/modules/${nextMod._id}`}
//               className="btn-primary flex items-center gap-2 ml-auto"
//             >
//               {nextMod.title} <ChevronRight size={16} />
//             </Link>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// }

// // ── Individual content block renderer ──────────────────────
// function ContentBlock({ block, results, submitting, onSubmit }: any) {
//   switch (block.type) {
//     case "youtube":
//       return <YouTubeBlock block={block} />;
//     case "video":
//       return <VideoBlock block={block} />;
//     case "pdf":
//       return <PdfBlock block={block} />;
//     case "image":
//       return <ImageBlock block={block} />;
//     case "text":
//       return <TextBlock block={block} />;
//     case "quiz_popup":
//       return <QuizBlock block={block} isPopup results={results} submitting={submitting} onSubmit={onSubmit} />;
//     case "quiz_end":
//       return <QuizBlock block={block} isPopup={false} results={results} submitting={submitting} onSubmit={onSubmit} />;
//     default:
//       return null;
//   }
// }

// function YouTubeBlock({ block }: any) {
//   const videoId = getYouTubeId(block.url || "");
//   if (!videoId) return null;
//   return (
//     <div className="card overflow-hidden">
//       {block.title && <p className="px-4 pt-4 font-medium text-slate-700 text-slate-200">{block.title}</p>}
//       <div className="relative pt-[56.25%] mt-3">
//         <iframe
//           className="absolute inset-0 w-full h-full"
//           src={`https://www.youtube.com/embed/${videoId}`}
//           allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
//           allowFullScreen
//         />
//       </div>
//     </div>
//   );
// }

// function VideoBlock({ block }: any) {
//   return (
//     <div className="card overflow-hidden">
//       {block.title && <p className="px-4 pt-4 font-medium text-slate-700 text-slate-200">{block.title}</p>}
//       <video controls className="w-full mt-3" src={block.url}>
//         Your browser does not support the video tag.
//       </video>
//     </div>
//   );
// }

// function PdfBlock({ block }: any) {
//   return (
//     <div className="card overflow-hidden">
//       <div className="flex items-center gap-2 px-4 py-3 border-b border-slate-100 textborder-slate-700">
//         <FileText size={16} className="text-brand-500" />
//         <p className="font-medium text-slate-700 text-slate-200">{block.title || "Document"}</p>
//       </div>
//       <iframe src={block.url} className="w-full h-[600px]" />
//     </div>
//   );
// }

// function ImageBlock({ block }: any) {
//   return (
//     <div className="card p-4">
//       <img src={block.url} alt={block.title || "Image"} className="w-full rounded-input object-cover" />
//       {block.title && <p className="text-sm text-slate-400 mt-2 text-center">{block.title}</p>}
//     </div>
//   );
// }

// function TextBlock({ block }: any) {
//   return (
//     <div className="card p-5 prose textprose-invert max-w-none prose-headings:font-bold prose-code:bg-slate-100 textprose-code:bg-slate-700 prose-code:px-1 prose-code:rounded">
//       {block.title && <h3 className="font-semibold text-slate-700 text-slate-200 mb-3">{block.title}</h3>}
//       <ReactMarkdown>{block.content || ""}</ReactMarkdown>
//     </div>
//   );
// }

// function QuizBlock({ block, isPopup, results, submitting, onSubmit }: any) {
//   return (
//     <div className={cn(
//       "card p-5",
//       isPopup
//         ? "border-2 border-ai-200 textborder-ai-700 bg-ai-50 textbg-ai-900/20"
//         : "border border-slate-200 textborder-slate-700"
//     )}>
//       {/* Header */}
//       <div className="flex items-center gap-2 mb-4">
//         <Zap size={18} className={isPopup ? "text-ai-600" : "text-brand-600"} />
//         <span className={cn("font-semibold", isPopup ? "text-ai-700 text-ai-300" : "text-slate-800 text-white")}>
//           {isPopup ? "Quick Check — Answer for bonus points!" : "Module Assessment"}
//         </span>
//         {isPopup && (
//           <span className="ml-auto points-chip">
//             <Zap size={11} /> +{block.questions?.[0]?.bonusPoints || 15} pts each
//           </span>
//         )}
//       </div>

//       {/* Questions */}
//       <div className="flex flex-col gap-5">
//         {block.questions?.map((q: any) => {
//           const result = results[q._id];
//           return (
//             <div key={q._id}>
//               <p className="font-medium text-slate-800 text-white mb-3">{q.question}</p>
//               <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
//                 {q.options.map((opt: string, idx: number) => {
//                   let style = "border border-slate-200 textborder-slate-600 hover:border-brand-400 hover:bg-brand-50 texthover:bg-brand-900/20";
//                   if (result) {
//                     if (idx === result.correctIndex) style = "border-2 border-reward-500 bg-reward-50 textbg-reward-900/20";
//                     else if (idx !== result.correctIndex && result.isCorrect === false) style = "border border-red-200 bg-red-50 textbg-red-900/10 opacity-60";
//                   }
//                   return (
//                     <button
//                       key={idx}
//                       disabled={!!result || submitting === q._id}
//                       onClick={() => onSubmit(q._id, idx)}
//                       className={cn(
//                         "text-left px-4 py-2.5 rounded-input text-sm transition-all",
//                         style,
//                         !result && "cursor-pointer active:scale-95"
//                       )}
//                     >
//                       <span className="font-medium text-slate-400 mr-2">{String.fromCharCode(65 + idx)}.</span>
//                       {opt}
//                     </button>
//                   );
//                 })}
//               </div>
//               {result && (
//                 <p className={cn("text-sm mt-2 font-medium", result.isCorrect ? "text-reward-600" : "text-red-500")}>
//                   {result.isCorrect ? `✓ Correct! +${result.pointsEarned} points` : "✗ Incorrect — review this topic"}
//                 </p>
//               )}
//             </div>
//           );
//         })}
//       </div>
//     </div>
//   );
// }


"use client";

import { useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import Link from "next/link";
import ReactMarkdown from "react-markdown";
import { useQuiz } from "@/hooks/useQuiz";
import { getYouTubeId, cn } from "@/lib/utils";
import {
  ChevronLeft, ChevronRight, CheckCircle2, Zap,
  FileText, List, X, PlayCircle, BookOpen
} from "lucide-react";

interface Props {
  course: any;
  mod: any;
  enrollment: any;
  studentId: string;
}

export default function ModuleViewerClient({ course, mod, enrollment, studentId }: Props) {
  const [completed, setCompleted] = useState(
    enrollment.completedModules?.map((id: any) => id.toString()).includes(mod._id.toString())
  );
  const [marking, setMarking] = useState(false);
  const [panelOpen, setPanelOpen] = useState(false);
  const { results, submitting, submitAnswer } = useQuiz(mod._id, course._id);

  const sortedBlocks = [...(mod.contentBlocks || [])].sort((a, b) => a.order - b.order);
  const allModules = course.modules || [];
  const currentIdx = allModules.findIndex((m: any) => m._id.toString() === mod._id.toString());
  const prevMod = allModules[currentIdx - 1];
  const nextMod = allModules[currentIdx + 1];

  const markComplete = async () => {
    if (completed || marking) return;
    setMarking(true);
    try {
      const { data } = await axios.post("/api/progress", {
        moduleId: mod._id,
        courseId: course._id,
      });
      setCompleted(true);
      toast.success(`+${data.data.pointsEarned} points! Module complete`);
      if (data.data.isCompleted) toast.success("🎉 Course completed! +100 bonus points");
    } catch {
      toast.error("Failed to mark complete");
    } finally {
      setMarking(false);
    }
  };

  return (
    // Full-width layout — no max-w constraint, fills the page
    <div className="flex flex-col min-h-full -m-7"> {/* negative margin to undo parent padding */}

      {/* ── Top bar ── */}
      <div className="flex items-center justify-between px-5 py-3 border-b border-slate-200 textborder-slate-700 bg-white textbg-slate-900 sticky top-0 z-20">
        {/* Left: back + course title */}
        <div className="flex items-center gap-3 min-w-0">
          <Link
            href="/student/courses"
            className="flex items-center gap-1 text-sm text-slate-500 hover:text-brand-500 transition-colors flex-shrink-0"
          >
            <ChevronLeft size={16} />
            <span className="hidden sm:inline">Back</span>
          </Link>
          <div className="h-4 w-px bg-slate-200 textbg-slate-700 flex-shrink-0" />
          <div className="min-w-0">
            <p className="text-xs text-slate-400 truncate">{course.title}</p>
            <p className="text-sm font-semibold text-slate-800 texttext-white truncate">{mod.title}</p>
          </div>
        </div>

        {/* Center: prev / next */}
        <div className="flex items-center gap-2">
          {prevMod ? (
            <Link
              href={`/student/courses/${course._id}/modules/${prevMod._id}`}
              className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-sm text-slate-600 texttext-slate-300 hover:bg-slate-100 texthover:bg-slate-700 transition-colors"
            >
              <ChevronLeft size={15} /> Previous
            </Link>
          ) : (
            <button disabled className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-sm text-slate-300 texttext-slate-600 cursor-not-allowed">
              <ChevronLeft size={15} /> Previous
            </button>
          )}
          {nextMod ? (
            <Link
              href={`/student/courses/${course._id}/modules/${nextMod._id}`}
              className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-sm text-slate-600 texttext-slate-300 hover:bg-slate-100 texthover:bg-slate-700 transition-colors"
            >
              Next <ChevronRight size={15} />
            </Link>
          ) : (
            <button disabled className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-sm text-slate-300 texttext-slate-600 cursor-not-allowed">
              Next <ChevronRight size={15} />
            </button>
          )}
        </div>

        {/* Right: module list toggle */}
        <button
          onClick={() => setPanelOpen(true)}
          className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium text-slate-600 texttext-slate-300 hover:bg-slate-100 texthover:bg-slate-700 transition-colors border border-slate-200 textborder-slate-600"
        >
          <List size={15} />
          <span className="hidden sm:inline">Modules</span>
          <span className="text-xs text-slate-400">{currentIdx + 1}/{allModules.length}</span>
        </button>
      </div>

      {/* ── Main content area ── */}
      <div className="flex-1 flex relative">

        {/* Content stream — full width */}
        <div className="flex-1 min-w-0 px-5 sm:px-8 lg:px-16 xl:px-24 py-8 flex flex-col gap-6">

          {/* Module heading */}
          <div>
            <h1 className="text-2xl font-bold text-slate-900 texttext-white">{mod.title}</h1>
            <p className="text-sm text-slate-400 mt-1">
              Module {currentIdx + 1} of {allModules.length}
              {completed && (
                <span className="ml-3 inline-flex items-center gap-1 text-green-500 font-medium">
                  <CheckCircle2 size={13} /> Completed
                </span>
              )}
            </p>
          </div>

          {/* Content blocks */}
          {sortedBlocks.map((block: any) => (
            <ContentBlock
              key={block._id}
              block={block}
              results={results}
              submitting={submitting}
              onSubmit={submitAnswer}
            />
          ))}

          {/* Mark complete */}
          <div className="card p-5 flex items-center justify-between gap-4 mt-2">
            <div>
              <p className="font-medium text-slate-900 texttext-white">
                {completed ? "Module completed!" : "Finished with this module?"}
              </p>
              <p className="text-sm text-slate-400">
                {completed
                  ? "You earned reward points for this module."
                  : `Mark complete to earn +${mod.rewardOnComplete || 25} points`}
              </p>
            </div>
            <button
              onClick={markComplete}
              disabled={completed || marking}
              className={cn(
                "flex items-center gap-2 px-5 py-2.5 rounded-input font-medium transition-all flex-shrink-0",
                completed
                  ? "bg-green-50 text-green-600 textbg-green-600/20 cursor-default"
                  : "btn-primary"
              )}
            >
              <CheckCircle2 size={16} />
              {completed ? "Completed" : marking ? "Saving..." : "Mark Complete"}
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

        {/* ── Right slide-in panel ── */}
        {/* Backdrop */}
        {panelOpen && (
          <div
            className="fixed inset-0 bg-black/40 z-30 lg:bg-transparent lg:pointer-events-none"
            onClick={() => setPanelOpen(false)}
          />
        )}

        {/* Panel */}
        <aside
          className={cn(
            "fixed right-0 top-0 h-full w-80 bg-white textbg-slate-900 border-l border-slate-200 textborder-slate-700 z-40 flex flex-col transition-transform duration-300 ease-in-out",
            // On mobile/tablet: slide in/out. On lg+: always visible when open
            panelOpen ? "translate-x-0" : "translate-x-full"
          )}
        >
          {/* Panel header */}
          <div className="flex items-center justify-between px-5 py-4 border-b border-slate-200 textborder-slate-700 flex-shrink-0">
            <div>
              <p className="text-xs text-slate-400 uppercase tracking-wide font-medium">Course Content</p>
              <p className="text-sm font-semibold text-slate-800 texttext-white mt-0.5 line-clamp-1">{course.title}</p>
            </div>
            <button
              onClick={() => setPanelOpen(false)}
              className="p-1.5 rounded-lg hover:bg-slate-100 texthover:bg-slate-700 transition-colors text-slate-400"
            >
              <X size={16} />
            </button>
          </div>

          {/* Progress bar */}
          <div className="px-5 py-3 border-b border-slate-200 textborder-slate-700 flex-shrink-0">
            <div className="flex justify-between text-xs text-slate-400 mb-1.5">
              <span>{enrollment.completedModules?.length || 0} of {allModules.length} completed</span>
              <span>{Math.round(enrollment.overallProgress || 0)}%</span>
            </div>
            <div className="h-1.5 bg-slate-200 textbg-slate-700 rounded-full overflow-hidden">
              <div
                className="h-full bg-brand-500 rounded-full transition-all"
                style={{ width: `${enrollment.overallProgress || 0}%` }}
              />
            </div>
          </div>

          {/* Module list */}
          <div className="flex-1 overflow-y-auto py-2">
            {allModules.map((m: any, i: number) => {
              const done = enrollment.completedModules?.map((id: any) => id.toString()).includes(m._id.toString());
              const active = m._id.toString() === mod._id.toString();
              return (
                <Link
                  key={m._id}
                  href={`/student/courses/${course._id}/modules/${m._id}`}
                  onClick={() => setPanelOpen(false)}
                  className={cn(
                    "flex items-center gap-3 px-5 py-3.5 transition-colors border-l-2",
                    active
                      ? "bg-brand-50 textbg-brand-900/20 border-brand-500"
                      : "border-transparent hover:bg-slate-50 texthover:bg-slate-800"
                  )}
                >
                  {/* Icon */}
                  <div className={cn(
                    "w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 text-xs font-semibold",
                    done
                      ? "bg-green-500 text-white"
                      : active
                        ? "bg-brand-600 text-white"
                        : "bg-slate-200 textbg-slate-700 text-slate-500 texttext-slate-400"
                  )}>
                    {done ? <CheckCircle2 size={14} /> : <PlayCircle size={14} />}
                  </div>
                  {/* Text */}
                  <div className="min-w-0">
                    <p className={cn(
                      "text-sm truncate",
                      active ? "font-semibold text-brand-600 texttext-brand-400" : "text-slate-700 texttext-slate-300"
                    )}>
                      {m.title}
                    </p>
                    <p className="text-xs text-slate-400 mt-0.5">Module {i + 1}</p>
                  </div>
                  {/* Done badge */}
                  {done && !active && (
                    <span className="ml-auto text-xs text-green-500 font-medium flex-shrink-0">Done</span>
                  )}
                </Link>
              );
            })}
          </div>
        </aside>
      </div>
    </div>
  );
}

// ── Content block renderer ──────────────────────────────────
function ContentBlock({ block, results, submitting, onSubmit }: any) {
  switch (block.type) {
    case "youtube":   return <YouTubeBlock block={block} />;
    case "video":     return <VideoBlock block={block} />;
    case "pdf":       return <PdfBlock block={block} />;
    case "image":     return <ImageBlock block={block} />;
    case "text":      return <TextBlock block={block} />;
    case "quiz_popup":return <QuizBlock block={block} isPopup results={results} submitting={submitting} onSubmit={onSubmit} />;
    case "quiz_end":  return <QuizBlock block={block} isPopup={false} results={results} submitting={submitting} onSubmit={onSubmit} />;
    default:          return null;
  }
}

function YouTubeBlock({ block }: any) {
  const videoId = getYouTubeId(block.url || "");
  if (!videoId) return null;
  return (
    <div className="card overflow-hidden">
      {block.title && <p className="px-4 pt-4 font-medium text-slate-700 texttext-slate-200">{block.title}</p>}
      <div className="relative pt-[56.25%] mt-3">
        <iframe
          className="absolute inset-0 w-full h-full"
          src={`https://www.youtube.com/embed/${videoId}`}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
      </div>
    </div>
  );
}

function VideoBlock({ block }: any) {
  return (
    <div className="card overflow-hidden">
      {block.title && <p className="px-4 pt-4 font-medium text-slate-700 texttext-slate-200">{block.title}</p>}
      <video controls className="w-full mt-3" src={block.url}>
        Your browser does not support the video tag.
      </video>
    </div>
  );
}

function PdfBlock({ block }: any) {
  return (
    <div className="card overflow-hidden">
      <div className="flex items-center gap-2 px-4 py-3 border-b border-slate-100 textborder-slate-700">
        <FileText size={16} className="text-brand-500" />
        <p className="font-medium text-slate-700 texttext-slate-200">{block.title || "Document"}</p>
      </div>
      <iframe src={block.url} className="w-full h-[600px]" />
    </div>
  );
}

function ImageBlock({ block }: any) {
  return (
    <div className="card p-4">
      <img src={block.url} alt={block.title || "Image"} className="w-full rounded-input object-cover" />
      {block.title && <p className="text-sm text-slate-400 mt-2 text-center">{block.title}</p>}
    </div>
  );
}

function TextBlock({ block }: any) {
  return (
    <div className="card p-5 prose textprose-invert max-w-none prose-headings:font-bold prose-code:bg-slate-100 textprose-code:bg-slate-700 prose-code:px-1 prose-code:rounded">
      {block.title && <h3 className="font-semibold text-slate-700 texttext-slate-200 mb-3">{block.title}</h3>}
      <ReactMarkdown>{block.content || ""}</ReactMarkdown>
    </div>
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
        <span className={cn("font-semibold", isPopup ? "text-ai-700 texttext-ai-300" : "text-slate-800 texttext-white")}>
          {isPopup ? "Quick Check — Answer for bonus points!" : "Module Assessment"}
        </span>
        {isPopup && (
          <span className="ml-auto points-chip">
            <Zap size={11} /> +{block.questions?.[0]?.bonusPoints || 15} pts each
          </span>
        )}
      </div>
      <div className="flex flex-col gap-5">
        {block.questions?.map((q: any) => {
          const result = results[q._id];
          return (
            <div key={q._id}>
              <p className="font-medium text-slate-800 texttext-white mb-3">{q.question}</p>
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
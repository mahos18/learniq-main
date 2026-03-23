"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { Check, X, Sparkles, ChevronRight, Zap, Flame, Target, Clock, BookOpen, ArrowRight } from "lucide-react";
import { getLinks, askGroq, makePrompt, makeFallback  } from "@/lib/planner/utils";
import { DURATIONS, LEVELS, PACES, POPULAR, PHASE_COLORS } from "@/lib/constants";
import CourseRecommendations from "./CourseRecommendations";
import { ExternalLink,Play } from "lucide-react";
import YouTubeEmbed from "./YouTubeEmbed";
import { getEnhancedLinks } from "@/lib/planner/utils";
import { generateFallbackResources } from "@/lib/planner/resourceValidator";

interface PlannerConfig {
  topic: string;
  level: string;
  duration: string;
  pace: string;
}

interface PlannerProps {
  onPlanGenerated?: (plan: any) => void;
}

// Helper Components
const Spinner = ({ size = 14, color = "#fff" }: { size?: number; color?: string }) => (
  <div
    className="inline-block animate-spin rounded-full border-2 border-solid border-current border-r-transparent"
    style={{ width: size, height: size, borderColor: `${color}22`, borderTopColor: color }}
  />
);

const Skeleton = ({ width = "100%", height = 12, radius = 8, marginBottom = 0 }: any) => (
  <div
    className="animate-shimmer rounded-lg"
    style={{
      width,
      height,
      borderRadius: radius,
      marginBottom,
      background: "linear-gradient(90deg, #0c0e1c 25%, #141728 50%, #0c0e1c 75%)",
      backgroundSize: "800px 100%",
    }}
  />
);

const ProgressBar = ({ percentage, color, height = 4, radius = 2 }: any) => (
  <div className="h-1 rounded-full bg-white/5 overflow-hidden" style={{ height, borderRadius: radius }}>
    <div
      className="h-full transition-all duration-300"
      style={{ width: `${Math.min(100, percentage)}%`, background: color, borderRadius: radius }}
    />
  </div>
);

const Badge = ({ label, color, bg, border, size = 10 }: any) => (
  <span
    className="inline-flex items-center rounded-md px-2 py-0.5 text-xs font-bold whitespace-nowrap"
    style={{ background: bg, color, border: `1px solid ${border}` }}
  >
    {label}
  </span>
);

const IntensityTag = ({ level }: { level: string }) => {
  const colors: Record<string, any> = {
    gentle: { bg: "rgba(5,150,105,.1)", color: "#34d399" },
    moderate: { bg: "rgba(217,119,6,.1)", color: "#fbbf24" },
    intense: { bg: "rgba(225,29,72,.1)", color: "#fb7185" },
  };
  const style = colors[level] || colors.moderate;
  return (
    <span
      className="rounded px-1.5 py-0.5 text-[9px] font-bold capitalize"
      style={{ background: style.bg, color: style.color }}
    >
      {level}
    </span>
  );
};

// Hero Screen Component
function HeroScreen({ onGenerate }: { onGenerate: (config: PlannerConfig) => void }) {
  const [topic, setTopic] = useState("");
  const [level, setLevel] = useState("beginner");
  const [duration, setDuration] = useState("3m");
  const [pace, setPace] = useState("regular");
  const [step, setStep] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (step === 0) inputRef.current?.focus();
  }, [step]);

  const canGenerate = topic.trim().length > 2;

  return (
    <div className="h-full flex flex-col relative overflow-hidden">
      {/* Animated background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `
              linear-gradient(rgba(99,102,241,.03) 1px, transparent 1px),
              linear-gradient(90deg, rgba(99,102,241,.03) 1px, transparent 1px)
            `,
            backgroundSize: "60px 60px",
          }}
        />
        <div
          className="absolute w-[800px] h-[800px] rounded-full top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
          style={{ background: "radial-gradient(circle, rgba(99,102,241,.06) 0%, transparent 65%)" }}
        />
        <div
          className="absolute w-[400px] h-[400px] rounded-full top-[20%] right-[15%]"
          style={{ background: "radial-gradient(circle, rgba(124,58,237,.05) 0%, transparent 70%)" }}
        />
        <div
          className="absolute w-[300px] h-[300px] rounded-full bottom-[15%] left-[10%]"
          style={{ background: "radial-gradient(circle, rgba(14,165,233,.04) 0%, transparent 70%)" }}
        />
      </div>

      {/* Content */}
      <div className="flex-1 flex items-center justify-center p-6 relative z-10">
        <div className="w-full max-w-[680px]">
          {step === 0 ? (
            <>
              <div className="animate-fadeUp text-center mb-10">
                <div className="inline-flex items-center gap-2 bg-indigo-500/10 border border-indigo-500/20 rounded-full px-3.5 py-1.5 mb-5">
                  <div className="w-1.5 h-1.5 rounded-full bg-indigo-400 animate-pulse" />
                  <span className="text-xs font-semibold text-indigo-400 tracking-wide">
                    AI-POWERED STUDY PLANNER
                  </span>
                </div>
                <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black leading-tight tracking-tight mb-4">
                  What do you want<br />
                  <span className="font-serif italic font-normal bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
                    to learn?
                  </span>
                </h1>
                <p className="text-sm text-gray-400 leading-relaxed max-w-md mx-auto">
                  Type anything — a topic, skill, or goal. Get a complete roadmap with real resources and structured daily plans.
                </p>
              </div>

              <div className="animate-fadeUp mb-4" style={{ animationDelay: "0.1s" }}>
                <div className="relative">
                  <span className="absolute left-5 top-1/2 -translate-y-1/2 text-xl pointer-events-none">🔍</span>
                  <input
                    ref={inputRef}
                    className="w-full bg-white/5 border border-indigo-500/30 rounded-2xl py-4 pl-14 pr-24 text-white text-lg font-medium outline-none focus:border-indigo-500/70 focus:ring-4 focus:ring-indigo-500/10 transition-all"
                    placeholder="e.g. React from scratch, Python for data science, DSA for interviews…"
                    value={topic}
                    onChange={(e) => setTopic(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && canGenerate) setStep(1);
                    }}
                  />
                  {topic.length > 2 && (
                    <button
                      onClick={() => setStep(1)}
                      className="absolute right-2 top-1/2 -translate-y-1/2 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-xl px-5 py-2.5 text-white text-sm font-bold hover:-translate-y-0.5 hover:shadow-lg transition-all"
                    >
                      Continue →
                    </button>
                  )}
                </div>
              </div>

              <div className="animate-fadeUp" style={{ animationDelay: "0.15s" }}>
                <p className="text-xs text-gray-500 font-semibold mb-3 text-center uppercase tracking-wide">
                  Popular topics
                </p>
                <div className="flex flex-wrap gap-1.5 justify-center">
                  {POPULAR.map((t) => (
                    <button
                      key={t}
                      className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all border ${
                        topic === t
                          ? "bg-indigo-500/25 border-indigo-500/60 text-indigo-300 shadow-sm"
                          : "bg-indigo-500/10 border-indigo-500/25 text-indigo-400 hover:bg-indigo-500/20"
                      }`}
                      onClick={() => {
                        setTopic(t);
                        setStep(1);
                      }}
                    >
                      {t}
                    </button>
                  ))}
                </div>
              </div>
            </>
          ) : (
            <>
              <div className="animate-fadeUp mb-7">
                <button
                  onClick={() => setStep(0)}
                  className="text-gray-500 text-sm mb-4 flex items-center gap-1.5 hover:text-gray-400 transition-colors"
                >
                  ← Change topic
                </button>
                <div className="bg-indigo-500/10 border border-indigo-500/20 rounded-xl p-4 flex items-center gap-3">
                  <span className="text-2xl">🎯</span>
                  <div>
                    <p className="text-xs text-gray-500 uppercase tracking-wide mb-0.5 font-semibold">Learning</p>
                    <p className="text-lg font-bold text-indigo-400">{topic}</p>
                  </div>
                </div>
              </div>

              <div className="animate-fadeUp grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Level */}
                <div>
                  <p className="text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-2.5">My level</p>
                  <div className="flex flex-col gap-1.5">
                    {LEVELS.map((l) => (
                      <button
                        key={l.id}
                        className={`p-2.5 rounded-xl border-2 text-left transition-all ${
                          level === l.id
                            ? "border-indigo-500/60 bg-indigo-500/15 shadow-md"
                            : "border-[#1c2040] bg-[#0c0e1c] hover:border-indigo-500/35"
                        }`}
                        onClick={() => setLevel(l.id)}
                      >
                        <span className="text-base mr-2">{l.icon}</span>
                        <span className={`text-xs font-semibold ${level === l.id ? "text-indigo-400" : "text-white"}`}>
                          {l.l}
                        </span>
                        <p className="text-[10px] text-gray-500 mt-1">{l.sub}</p>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Duration */}
                <div>
                  <p className="text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-2.5">Duration</p>
                  <div className="flex flex-col gap-1.5">
                    {DURATIONS.map((d) => (
                      <button
                        key={d.id}
                        className={`p-2.5 rounded-xl border-2 flex items-center gap-2 transition-all ${
                          duration === d.id
                            ? "border-indigo-500/60 bg-indigo-500/15"
                            : "border-[#1c2040] bg-[#0c0e1c] hover:border-indigo-500/35"
                        }`}
                        onClick={() => setDuration(d.id)}
                      >
                        <span className="text-sm w-5">{d.icon}</span>
                        <span className={`text-xs font-semibold flex-1 ${duration === d.id ? "text-indigo-400" : "text-white"}`}>
                          {d.l}
                        </span>
                        <span className="text-[9px] text-gray-500 font-mono">{d.w}w</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Pace */}
                <div>
                  <p className="text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-2.5">Daily pace</p>
                  <div className="flex flex-col gap-1.5">
                    {PACES.map((p) => (
                      <button
                        key={p.id}
                        className={`p-2.5 rounded-xl border-2 flex items-center gap-2 transition-all ${
                          pace === p.id
                            ? "border-indigo-500/60 bg-indigo-500/15"
                            : "border-[#1c2040] bg-[#0c0e1c] hover:border-indigo-500/35"
                        }`}
                        onClick={() => setPace(p.id)}
                      >
                        <span className="text-sm w-5">{p.icon}</span>
                        <span className={`text-xs font-semibold flex-1 ${pace === p.id ? "text-indigo-400" : "text-white"}`}>
                          {p.l}
                        </span>
                        <span className="text-[9px] text-gray-500 font-mono">{p.sub}</span>
                      </button>
                    ))}
                  </div>

                  <div className="mt-3 p-2.5 bg-indigo-500/10 border border-indigo-500/20 rounded-lg">
                    <p className="text-[11px] text-indigo-400 leading-relaxed">
                      ~<strong className="font-mono">
                        {Math.round(((DURATIONS.find((d) => d.id === duration)?.w || 4) * 5 * (PACES.find((p) => p.id === pace)?.h || 1)))}
                      </strong>h total · complete coverage
                    </p>
                  </div>
                </div>
              </div>

              <div className="animate-fadeUp mt-6 flex justify-end">
                <button
                  className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-xl px-8 py-3 text-white font-bold text-sm flex items-center gap-2 disabled:opacity-30 disabled:cursor-default hover:-translate-y-0.5 hover:shadow-lg transition-all"
                  onClick={() => onGenerate({ topic, level, duration, pace })}
                  disabled={!canGenerate}
                >
                  <Sparkles size={16} />
                  Build my roadmap
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

// Loading Screen Component
function LoadingScreen({ topic, duration }: { topic: string; duration: string }) {
  const messages = [
    "Analysing your topic…",
    "Structuring the roadmap…",
    "Finding the best resources…",
    "Creating daily activities…",
    "Almost ready…",
  ];
  const [msg, setMsg] = useState(messages[0]);
  const msgIndex = useRef(0);

  useEffect(() => {
    const timer = setInterval(() => {
      msgIndex.current = (msgIndex.current + 1) % messages.length;
      setMsg(messages[msgIndex.current]);
    }, 900);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="h-full flex items-center justify-center flex-col gap-7">
      <div className="text-center">
        <div className="text-5xl mb-4 animate-float">✦</div>
        <p className="font-serif italic text-2xl text-white mb-1.5">Building your roadmap</p>
        <p className="text-sm text-indigo-400 font-semibold mb-1">{topic}</p>
        <p className="text-xs text-gray-500 min-h-[18px] transition-opacity">{msg}</p>
      </div>

      {/* Skeleton preview */}
      <div className="w-96 flex flex-col gap-2">
        {[1, 0.85, 0.95, 0.7, 0.9].map((w, i) => (
          <div
            key={i}
            className="animate-fadeUp bg-[#0c0e1c] border border-[#1c2040] rounded-xl p-3 flex gap-2.5"
            style={{ animationDelay: `${i * 0.1}s` }}
          >
            <Skeleton width={36} height={36} radius={9} />
            <div className="flex-1">
              <Skeleton width={`${w * 100}%`} height={13} radius={6} marginBottom={6} />
              <Skeleton width={`${w * 0.7 * 100}%`} height={9} radius={5} />
            </div>
          </div>
        ))}
      </div>

      <div className="flex items-center gap-2">
        <Spinner size={12} color="#a5b4fc" />
        <span className="text-[11px] text-gray-500">Groq · llama-3.3-70b</span>
      </div>
    </div>
  );
}

// Item Card Component
// Item Card Component
// Item Card Component

//v1
// function ItemCard({ item, color, done, onToggle, index, topic }: any) {
//   const [open, setOpen] = useState(index === 0);
  
//   // Use item.topic if available, otherwise fallback to the main topic
//   const itemTopic = item.topic || topic;
  
//   // Get enhanced resources for this topic
//   const enhancedResources = getEnhancedLinks(itemTopic);
  
//   return (
//     <div className={`mb-2 rounded-xl border transition-all ${done ? "bg-emerald-500/5 border-emerald-500/20" : "bg-[#0a0c18] border-[#1c2040]"} hover:border-indigo-500/30 hover:-translate-y-px`}>
//       <div
//         onClick={() => setOpen(!open)}
//         className="p-3 flex items-center gap-3 cursor-pointer"
//       >
//         <div
//           className={`w-10 h-10 rounded-lg flex-shrink-0 flex flex-col items-center justify-center border-2 ${
//             done
//               ? "bg-emerald-500/15 border-emerald-500/30"
//               : ""
//           }`}
//           style={!done ? { background: color.bg, borderColor: color.bd } : {}}
//         >
//           {done ? (
//             <Check className="w-4 h-4 text-emerald-400 animate-popIn" />
//           ) : (
//             <>
//               <span className="text-[9px] font-mono font-bold" style={{ color: color.l }}>
//                 {item.emoji}
//               </span>
//               <span className="text-xs font-mono font-bold" style={{ color: color.l }}>
//                 {item.n}
//               </span>
//             </>
//           )}
//         </div>

//         <div className="flex-1 min-w-0">
//           <div className="flex items-center gap-1.5 mb-0.5 flex-wrap">
//             <span className="text-[11px] text-gray-500 font-mono">{item.dayOrWeek}</span>
//             <span className="w-0.5 h-0.5 rounded-full bg-gray-700" />
//             <span className={`text-sm font-bold ${done ? "text-emerald-400" : ""}`} style={!done ? { color: color.l } : {}}>
//               {item.topic}
//             </span>
//             <IntensityTag level={item.intensity} />
//           </div>
//           <p className="text-[11px] text-gray-500 truncate">{item.goal}</p>
//         </div>

//         <div className="flex items-center gap-2 flex-shrink-0">
//           <span className="text-[10px] text-gray-500 font-mono">{item.hours}h</span>
//           <div
//             className={`w-5 h-5 rounded-md flex items-center justify-center text-xs transition-transform ${
//               open ? "rotate-180" : ""
//             }`}
//             style={{ background: color.bg, border: `1px solid ${color.bd}`, color: color.l }}
//           >
//             ▾
//           </div>
//         </div>
//       </div>

//       {open && (
//         <div className="px-4 pb-3.5 animate-fadeIn">
//           <div className="bg-white/5 border border-gray-800 rounded-xl p-4 mb-2">
            
//             {/* YouTube Video Section */}
//             {enhancedResources.some(r => r.type === "video") && (
//               <div className="mb-4">
//                 <p className="text-[9px] font-bold text-gray-500 uppercase tracking-wider mb-2">📺 Watch Tutorial</p>
//                 <div className="space-y-2">
//                   {enhancedResources.filter(r => r.type === "video").map((video, i) => (
//                     <a
//                       key={i}
//                       href={video.url}
//                       target="_blank"
//                       rel="noopener noreferrer"
//                       className="flex items-center gap-2 p-2 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 hover:bg-red-500/20 transition-all group"
//                     >
//                       <Play size={14} className="flex-shrink-0" />
//                       <span className="text-xs flex-1">{video.label}</span>
//                       <ExternalLink size={12} className="opacity-60 group-hover:opacity-100 transition-opacity" />
//                     </a>
//                   ))}
//                 </div>
//               </div>
//             )}
            
//             {/* Activities */}
//             <p className="text-[9px] font-bold text-gray-500 uppercase tracking-wider mb-2">📋 What you'll do today</p>
//             <div className="flex flex-col gap-2 mb-3.5">
//               {item.activities?.map((a: string, i: number) => (
//                 <div key={i} className="flex gap-2.5">
//                   <div
//                     className="w-5 h-5 rounded-md flex items-center justify-center text-[10px] font-bold font-mono flex-shrink-0 mt-0.5"
//                     style={{ background: color.bg, border: `1px solid ${color.bd}`, color: color.l }}
//                   >
//                     {i + 1}
//                   </div>
//                   <p className="text-sm text-gray-300 leading-relaxed flex-1">{a}</p>
//                 </div>
//               ))}
//             </div>
            
//             {/* Goal */}
//             <div className="p-2.5 rounded-lg mb-3" style={{ background: color.bg, border: `1px solid ${color.bd}` }}>
//               <p className="text-[10px] font-bold uppercase tracking-wide mb-0.5" style={{ color: color.l }}>
//                 Session goal
//               </p>
//               <p className="text-xs text-gray-300 leading-relaxed">{item.goal}</p>
//             </div>
            
//             {/* Resources with GeeksforGeeks */}
//             <p className="text-[9px] font-bold text-gray-500 uppercase tracking-wider mb-1.5">📚 Learning Resources</p>
//             <div className="flex flex-wrap gap-1.5 mb-2">
//               {enhancedResources.map((r, i) => (
//                 <a
//                   key={i}
//                   href={r.url}
//                   target="_blank"
//                   rel="noopener noreferrer"
//                   className={`inline-flex items-center gap-1 px-2 py-1 rounded-md text-[11px] font-medium transition-all group ${
//                     r.type === "video"
//                       ? "bg-red-500/10 border border-red-500/20 text-red-400 hover:bg-red-500/20"
//                       : "bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 hover:bg-indigo-500/20"
//                   }`}
//                 >
//                   <span className="text-[11px]">{r.type === "video" ? "📺" : "📄"}</span>
//                   {r.label}
//                   <ExternalLink size={10} className="opacity-60 group-hover:opacity-100 transition-opacity" />
//                 </a>
//               ))}
//             </div>
            
//             {/* GeeksforGeeks specific section */}
//             <div className="mt-2 pt-2 border-t border-gray-800">
//               <a
//                 href={`https://www.geeksforgeeks.org/search/?q=${encodeURIComponent(itemTopic)}`}
//                 target="_blank"
//                 rel="noopener noreferrer"
//                 className="inline-flex items-center gap-1 px-2 py-1 rounded-md text-[11px] font-medium bg-green-500/10 border border-green-500/20 text-green-400 hover:bg-green-500/20 transition-all group"
//               >
//                 <span>🔗</span>
//                 More articles on GeeksforGeeks
//                 <ExternalLink size={10} className="ml-1 opacity-60 group-hover:opacity-100 transition-opacity" />
//               </a>
//             </div>
//           </div>
          
//           <button
//             onClick={() => onToggle(item.n)}
//             className="w-full py-2 rounded-lg text-xs font-bold transition-all"
//             style={{
//               background: done ? "rgba(225,29,72,.08)" : "rgba(5,150,105,.08)",
//               border: `1px solid ${done ? "rgba(225,29,72,.25)" : "rgba(5,150,105,.25)"}`,
//               color: done ? "#fb7185" : "#34d399",
//             }}
//           >
//             {done ? "✕ Mark incomplete" : "✓ Mark complete"}
//           </button>
//         </div>
//       )}
//     </div>
//   );
// }

// Import the reliable resources function
import { getReliableResources, getYouTubeSearchUrl, getGeeksForGeeksSearchUrl } from "@/lib/planner/reliableResources";

function ItemCard({ item, color, done, onToggle, index, topic }: any) {
  const [open, setOpen] = useState(index === 0);
  const itemTopic = item.topic || topic;
  
  // Get reliable resources (no LLM needed)
  const reliableResources = getReliableResources(itemTopic);
  
  return (
    <div className={`mb-2 rounded-xl border transition-all ${done ? "bg-emerald-500/5 border-emerald-500/20" : "bg-[#0a0c18] border-[#1c2040]"} hover:border-indigo-500/30 hover:-translate-y-px`}>
      {/* ... existing row code ... */}
      
      {open && (
        <div className="px-4 pb-3.5 animate-fadeIn">
          <div className="bg-white/5 border border-gray-800 rounded-xl p-4 mb-2">
            
            {/* YouTube Section - Always reliable */}
            <div className="mb-4">
              <p className="text-[9px] font-bold text-gray-500 uppercase tracking-wider mb-2">📺 Watch Tutorials</p>
              <a
                href={getYouTubeSearchUrl(itemTopic)}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 p-2 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 hover:bg-red-500/20 transition-all group"
              >
                <Play size={14} className="flex-shrink-0" />
                <span className="text-xs flex-1">Search YouTube for "{itemTopic}" tutorials</span>
                <ExternalLink size={12} className="opacity-60 group-hover:opacity-100 transition-opacity" />
              </a>
            </div>
            
            {/* Activities */}
            <p className="text-[9px] font-bold text-gray-500 uppercase tracking-wider mb-2">📋 What you'll do today</p>
            <div className="flex flex-col gap-2 mb-3.5">
              {item.activities?.map((a: string, i: number) => (
                <div key={i} className="flex gap-2.5">
                  <div
                    className="w-5 h-5 rounded-md flex items-center justify-center text-[10px] font-bold font-mono flex-shrink-0 mt-0.5"
                    style={{ background: color.bg, border: `1px solid ${color.bd}`, color: color.l }}
                  >
                    {i + 1}
                  </div>
                  <p className="text-sm text-gray-300 leading-relaxed flex-1">{a}</p>
                </div>
              ))}
            </div>
            
            {/* Goal */}
            <div className="p-2.5 rounded-lg mb-3" style={{ background: color.bg, border: `1px solid ${color.bd}` }}>
              <p className="text-[10px] font-bold uppercase tracking-wide mb-0.5" style={{ color: color.l }}>
                Session goal
              </p>
              <p className="text-xs text-gray-300 leading-relaxed">{item.goal}</p>
            </div>
            
            {/* Learning Resources - Using reliable curated resources */}
            <p className="text-[9px] font-bold text-gray-500 uppercase tracking-wider mb-1.5">📚 Learning Resources</p>
            <div className="flex flex-wrap gap-1.5 mb-2">
              {reliableResources.map((r, i) => (
                <a
                  key={i}
                  href={r.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`inline-flex items-center gap-1 px-2 py-1 rounded-md text-[11px] font-medium transition-all group ${
                    r.type === "video"
                      ? "bg-red-500/10 border border-red-500/20 text-red-400 hover:bg-red-500/20"
                      : "bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 hover:bg-indigo-500/20"
                  }`}
                >
                  <span className="text-[11px]">{r.type === "video" ? "📺" : "📄"}</span>
                  {r.label}
                  <ExternalLink size={10} className="opacity-60 group-hover:opacity-100 transition-opacity" />
                </a>
              ))}
            </div>
            
            {/* Direct GeeksforGeeks Search */}
            <div className="mt-2 pt-2 border-t border-gray-800">
              <a
                href={getGeeksForGeeksSearchUrl(itemTopic)}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 px-2 py-1 rounded-md text-[11px] font-medium bg-green-500/10 border border-green-500/20 text-green-400 hover:bg-green-500/20 transition-all group"
              >
                <span>🔗</span>
                More articles on GeeksforGeeks
                <ExternalLink size={10} className="ml-1 opacity-60 group-hover:opacity-100 transition-opacity" />
              </a>
            </div>
          </div>
          
          <button
            onClick={() => onToggle(item.n)}
            className="w-full py-2 rounded-lg text-xs font-bold transition-all"
            style={{
              background: done ? "rgba(225,29,72,.08)" : "rgba(5,150,105,.08)",
              border: `1px solid ${done ? "rgba(225,29,72,.25)" : "rgba(5,150,105,.25)"}`,
              color: done ? "#fb7185" : "#34d399",
            }}
          >
            {done ? "✕ Mark incomplete" : "✓ Mark complete"}
          </button>
        </div>
      )}
    </div>
  );
}

// Phase Block Component
function PhaseBlock({ phase, index, done, onToggle, topic }: any) {
  const [open, setOpen] = useState(true);
  const color = PHASE_COLORS[index % PHASE_COLORS.length];
  const total = phase.items?.length || 0;
  const completed = phase.items?.filter((it: any) => done.has(it.n)).length || 0;
  const percentage = total > 0 ? Math.round((completed / total) * 100) : 0;

  return (
    <div className="mb-6 animate-fadeUp" style={{ animationDelay: `${index * 0.08}s` }}>
      {/* Phase header */}
      <div
        onClick={() => setOpen(!open)}
        className={`bg-[#0c0e1c] border rounded-xl p-3.5 cursor-pointer transition-all mb-2.5 ${
          percentage === 100 ? "border-emerald-500/30" : ""
        }`}
        style={percentage !== 100 ? { borderColor: color.bd } : {}}
      >
        {/* ... phase header content ... */}
      </div>

      {/* Phase items */}
      {open &&
        phase.items?.map((item: any, i: number) => (
          <ItemCard
            key={item.n}
            item={item}
            color={color}
            done={done.has(item.n)}
            onToggle={onToggle}
            index={i}
            topic={topic}  // Pass topic here
          />
        ))}
    </div>
  );
}

// Sidebar Component
function Sidebar({ plan, cfg, done, onNew }: any) {
  const dur = DURATIONS.find((d) => d.id === cfg.duration);
  const total = plan.totalItems || 0;
  const percentage = total > 0 ? Math.round((done.size / total) * 100) : 0;

  return (
    <div className="w-64 flex-shrink-0 h-full bg-[#070918] border-r border-[#1c2040] flex flex-col overflow-hidden">
      <div className="p-5 border-b border-[#1c2040]">
        <div className="flex items-baseline gap-0.5 mb-4">
          <span className="text-2xl font-black text-white tracking-tight">
            <span className="text-indigo-400">Learn</span>IQ
          </span>
          <span className="font-serif italic text-sm text-gray-500 ml-1.5">planner</span>
        </div>

        <div className="mb-3">
          <p className="text-[10px] text-gray-500 font-semibold uppercase tracking-wide mb-1">Studying</p>
          <p className="text-sm font-bold text-indigo-400 leading-tight">{plan.title}</p>
          <p className="text-[10px] text-gray-500 mt-0.5">
            {dur?.l} · {PACES.find((p) => p.id === cfg.pace)?.sub}
          </p>
        </div>

        <div className="bg-[#0a0c18] border border-[#252952] rounded-lg p-2.5">
          <div className="flex justify-between mb-1.5">
            <span className="text-[10px] text-gray-500">Progress</span>
            <span className="text-[11px] font-bold text-indigo-400 font-mono">{percentage}%</span>
          </div>
          <ProgressBar percentage={percentage} color="linear-gradient(90deg, #6366f1, #c4b5fd)" />
          <p className="text-[9px] text-gray-500 font-mono mt-1">
            {done.size} / {total} {total === 7 ? "days" : "weeks"} done
          </p>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-2.5">
        <p className="text-[9px] font-bold text-gray-500 uppercase tracking-wide mb-2 ml-1">Phases</p>
        {plan.phases?.map((ph: any, i: number) => {
          const color = PHASE_COLORS[i % PHASE_COLORS.length];
          const completed = ph.items?.filter((it: any) => done.has(it.n)).length || 0;
          const total = ph.items?.length || 0;
          const percentage = total > 0 ? Math.round((completed / total) * 100) : 0;
          return (
            <div key={i} className="p-1.5 rounded-lg mb-1">
              <div className="flex items-center gap-2 mb-1">
                <div className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: color.l }} />
                <p className="text-[11px] font-semibold text-gray-500 truncate flex-1">{ph.title}</p>
                <span className="text-[9px] font-mono font-semibold" style={{ color: color.l }}>
                  {completed}/{total}
                </span>
              </div>
              <ProgressBar percentage={percentage} color={color.l} height={2} />
            </div>
          );
        })}
      </div>

      <div className="p-4 border-t border-[#1c2040]">
        <div className="grid grid-cols-2 gap-1.5 mb-2.5">
          {[
            { label: "Done", value: done.size, color: "#34d399" },
            { label: "Left", value: total - done.size, color: "#fbbf24" },
            { label: "Weeks", value: total, color: "#a5b4fc" },
            { label: "Phases", value: plan.phases?.length || 0, color: "#c4b5fd" },
          ].map((s) => (
            <div key={s.label} className="bg-[#0a0c18] border border-[#252952] rounded-lg p-2">
              <p className="text-xl font-extrabold font-mono" style={{ color: s.color }}>
                {s.value}
              </p>
              <p className="text-[9px] text-gray-500 mt-0.5">{s.label}</p>
            </div>
          ))}
        </div>
        <button
          onClick={onNew}
          className="w-full bg-transparent border border-[#252952] rounded-lg py-2 text-gray-500 text-xs font-semibold hover:text-indigo-400 hover:border-indigo-500/35 transition-all"
        >
          ← New plan
        </button>
      </div>
    </div>
  );
}

// Plan View Component
function PlanView({ plan, cfg, done, onToggle, onNew }: any) {
  const dur = DURATIONS.find((d) => d.id === cfg.duration);
  const total = plan.totalItems || 0;
  const [showRecommendations, setShowRecommendations] = useState(true);

  return (
    <div className="flex h-full overflow-hidden bg-[#060810]">
      {/* Left Sidebar */}
      <Sidebar plan={plan} cfg={cfg} done={done} onNew={onNew} />
      
      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* ... top bar ... */}
        
        <div className="flex-1 overflow-y-auto p-6">
          {/* ... stats section ... */}
          
          {/* Phases */}
          {plan.phases?.map((ph: any, i: number) => (
            <PhaseBlock 
              key={i} 
              phase={ph} 
              index={i} 
              done={done} 
              onToggle={onToggle} 
              topic={cfg.topic}  // Pass topic here
            />
          ))}
        </div>
      </div>
      
      {/* Right Sidebar - Course Recommendations */}
      <div className="w-80 flex-shrink-0 border-l border-[#1c2040] overflow-y-auto p-4">
        <CourseRecommendations 
          topic={cfg.topic} 
          onCourseClick={(courseId:string) => {
            console.log("Course clicked:", courseId);
          }}
        />
      </div>
    </div>
  );
}

// Main Component
export default function LearnIQPlanner({ onPlanGenerated }: PlannerProps) {
  const [screen, setScreen] = useState<"hero" | "loading" | "plan">("hero");
  const [plan, setPlan] = useState<any>(null);
  const [cfg, setCfg] = useState<PlannerConfig>({
    topic: "",
    level: "beginner",
    duration: "3m",
    pace: "regular",
  });
  const [done, setDone] = useState<Set<number>>(new Set());

const generate = useCallback(
  async (config: PlannerConfig) => {
    setCfg(config);
    setScreen("loading");
    
    // First, get the roadmap from Groq
    const prompt = makePrompt(config);
    const raw = await askGroq(prompt);
    let parsed = null;
    
    if (raw) {
      try {
        parsed = JSON.parse(raw.replace(/```json|```/g, "").trim());
      } catch {}
    }
    
    if (!parsed) parsed = makeFallback(config);
    
    // Now enhance each item with LLM-generated resources
    const enhancedPhases = await Promise.all(
      parsed.phases.map(async (phase: any) => {
        const enhancedItems = await Promise.all(
          phase.items.map(async (item: any) => {
            // If item already has resources, use them, otherwise fetch new ones
            if (item.resources && item.resources.length > 0) {
              return item;
            }
            
            // Fetch resources from our API
            try {
              const response = await fetch("/api/planner/resources", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ topic: item.topic }),
              });
              
              const data = await response.json();
              return {
                ...item,
                resources: data.resources || generateFallbackResources(item.topic),
              };
            } catch (error) {
              console.error("Error fetching resources for", item.topic, error);
              return {
                ...item,
                resources: generateFallbackResources(item.topic),
              };
            }
          })
        );
        
        return {
          ...phase,
          items: enhancedItems,
        };
      })
    );
    
    setPlan({ ...parsed, phases: enhancedPhases });
    setDone(new Set());
    setScreen("plan");
    if (onPlanGenerated) onPlanGenerated(parsed);
  },
  [onPlanGenerated]
);

  const toggle = useCallback((n: number) => {
    setDone((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(n)) newSet.delete(n);
      else newSet.add(n);
      return newSet;
    });
  }, []);

  return (
    <div className="h-full w-full overflow-hidden">
      {screen === "hero" && <HeroScreen onGenerate={generate} />}
      {screen === "loading" && <LoadingScreen topic={cfg.topic} duration={cfg.duration} />}
      {screen === "plan" && plan && (
        <PlanView 
          plan={plan} 
          cfg={cfg} 
          done={done} 
          onToggle={toggle} 
          onNew={() => {
            setScreen("hero");
            setPlan(null);
          }} 
        />
      )}
    </div>
  );
}
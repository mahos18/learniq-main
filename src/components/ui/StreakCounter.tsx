"use client";

import { Flame } from "lucide-react";

interface StreakCounterProps {
  streak: number;
  size?: "sm" | "md" | "lg";
}

export default function StreakCounter({ streak, size = "md" }: StreakCounterProps) {
  const sizeMap = {
    sm: { icon: 14, text: "text-sm", wrap: "px-2 py-1 gap-1" },
    md: { icon: 18, text: "text-base", wrap: "px-3 py-1.5 gap-1.5" },
    lg: { icon: 24, text: "text-xl",  wrap: "px-4 py-2 gap-2" },
  };
  const s = sizeMap[size];

  if (streak === 0) return null;

  return (
    <div className={`inline-flex items-center ${s.wrap} bg-amber-50 textbg-amber-900/20 rounded-pill border border-amber-200 textborder-amber-700`}>
      <Flame size={s.icon} className={`text-amber-500 ${streak >= 7 ? "animate-pulse" : ""}`} />
      <span className={`font-bold text-amber-700 text-amber-400 ${s.text}`}>{streak}</span>
      <span className="text-xs text-amber-500 text-amber-500">day streak</span>
    </div>
  );
}

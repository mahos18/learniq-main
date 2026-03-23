import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

// Tailwind class merger
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Points formatting
export function formatPoints(pts: number): string {
  return pts >= 1000 ? `${(pts / 1000).toFixed(1)}k` : pts.toString();
}

// Progress percentage
export function calcProgress(completed: number, total: number): number {
  if (total === 0) return 0;
  return Math.round((completed / total) * 100);
}

// Extract YouTube video ID from URL
export function getYouTubeId(url: string): string | null {
  const regex = /(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\n?#]+)/;
  const match = url.match(regex);
  return match ? match[1] : null;
}

// Difficulty badge color
export function difficultyColor(level: string) {
  const map: Record<string, string> = {
    beginner:     "bg-reward-50 text-reward-600",
    intermediate: "bg-warn-50 text-warn-600",
    advanced:     "bg-red-50 text-red-600",
  };
  return map[level] ?? "bg-gray-100 text-gray-600";
}

// Points action colors
export const POINT_ACTIONS = {
  module_complete:   { label: "Module completed",     points: 25,  color: "text-reward-600" },
  quiz_pass:         { label: "Quiz passed",           points: 25,  color: "text-reward-600" },
  checkpoint_correct:{ label: "Checkpoint answered",   points: 15,  color: "text-brand-600"  },
  course_complete:   { label: "Course completed",      points: 100, color: "text-ai-600"     },
  redeem:            { label: "Course redeemed",       points: 0,   color: "text-red-600"    },
} as const;

export type PointAction = keyof typeof POINT_ACTIONS;

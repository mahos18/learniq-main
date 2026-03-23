"use client";

import Link from "next/link";
import { cn } from "@/lib/utils";
import { CheckCircle, Circle, Lock, ChevronRight } from "lucide-react";

interface ModuleRoadmapProps {
  courseId: string;
  modules: { _id: string; title: string; order: number }[];
  completedModuleIds: string[];
  activeModuleId: string;
}

export default function ModuleRoadmap({
  courseId, modules, completedModuleIds, activeModuleId,
}: ModuleRoadmapProps) {
  return (
    <nav className="flex flex-col gap-1 p-2">
      {modules.map((mod, i) => {
        const done    = completedModuleIds.includes(mod._id);
        const active  = mod._id === activeModuleId;
        // A module is locked if the previous one isn't done (except first)
        const locked  = i > 0 && !completedModuleIds.includes(modules[i - 1]._id);

        return (
          <Link
            key={mod._id}
            href={locked ? "#" : `/student/courses/${courseId}/modules/${mod._id}`}
            onClick={(e) => locked && e.preventDefault()}
            className={cn(
              "flex items-center gap-3 px-3 py-2.5 rounded-input text-sm transition-all group",
              active   && "bg-brand-50 dark:bg-brand-900/30 text-brand-700 text-brand-300 font-medium",
              done && !active && "text-slate-500 text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-700/50",
              locked   && "text-slate-300 text-slate-600 cursor-not-allowed",
              !active && !done && !locked && "text-slate-600 text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-700/50"
            )}
          >
            {/* Status icon */}
            <span className="flex-shrink-0">
              {done    ? <CheckCircle size={16} className="text-reward-600" /> :
               locked  ? <Lock        size={16} className="text-slate-300 text-slate-600" /> :
               active  ? <Circle      size={16} className="text-brand-500 fill-brand-500" /> :
                         <Circle      size={16} className="text-slate-300 text-slate-600" />}
            </span>

            {/* Title */}
            <span className="flex-1 line-clamp-2 leading-snug">
              <span className="text-xs opacity-50 mr-1">{mod.order}.</span>
              {mod.title}
            </span>

            {active && <ChevronRight size={13} className="opacity-40 flex-shrink-0" />}
          </Link>
        );
      })}
    </nav>
  );
}

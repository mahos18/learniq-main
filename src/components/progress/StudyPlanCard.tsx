"use client";
import type { StudyDay } from "@/types";
import { CheckCircle } from "lucide-react";

export default function StudyPlanCard({ day }: { day: StudyDay }) {
  const colors = ["#4B7BF5","#7C5CFC","#00D4FF","#39FF84","#F5A623","#FF6B7A","#4B7BF5"];
  const color = colors[(day.day - 1) % colors.length];

  return (
    <div className="card flex-shrink-0 p-4 flex flex-col gap-3"
      style={{ background: "#0D1226", minWidth: 200, maxWidth: 220, borderColor: `${color}30` }}>
      <div>
        <p className="label mb-1">Day {day.day}</p>
        <p className="font-display font-semibold text-sm" style={{ color }}>{day.topic}</p>
      </div>
      <div className="flex flex-col gap-1.5">
        {day.activities.map((a, i) => (
          <div key={i} className="flex items-start gap-2 text-xs text-muted">
            <CheckCircle size={11} className="mt-0.5 flex-shrink-0" style={{ color }} />
            {a}
          </div>
        ))}
      </div>
      <div className="pt-2 border-t" style={{ borderColor: "#1E2D55" }}>
        <p className="text-xs text-muted"><span className="font-medium" style={{ color }}>Goal: </span>{day.goal}</p>
      </div>
    </div>
  );
}

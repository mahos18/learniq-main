"use client";

import {
  Radar, RadarChart, PolarGrid, PolarAngleAxis,
  PolarRadiusAxis, ResponsiveContainer, Tooltip,
} from "recharts";
import type { RadarPoint } from "@/types";

const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload?.length) {
    const d = payload[0].payload;
    return (
      <div className="card px-3 py-2 text-sm" style={{ background: "#141C35" }}>
        <p className="font-display font-semibold text-bright">{d.topic}</p>
        <p style={{ color: "#4B7BF5" }}>{d.score}% mastery</p>
        {d.total && <p className="text-muted text-xs">{d.total} questions answered</p>}
      </div>
    );
  }
  return null;
};

// Demo data shown when no real quiz data exists yet
const demoData: RadarPoint[] = [
  { topic: "Recursion",    score: 80, total: 5 },
  { topic: "Strings",      score: 65, total: 4 },
  { topic: "Arrays",       score: 72, total: 6 },
  { topic: "Sorting",      score: 55, total: 3 },
  { topic: "Graph Theory", score: 48, total: 2 },
  { topic: "Dynamic Prog", score: 60, total: 4 },
];

export default function SkillRadar({ data, height = 320 }: { data: RadarPoint[]; height?: number }) {
  const chartData = data.length > 0 ? data : demoData;

  return (
    <ResponsiveContainer width="100%" height={height}>
      <RadarChart data={chartData} margin={{ top: 10, right: 40, bottom: 10, left: 40 }}>
        <PolarGrid stroke="rgba(75,123,245,0.15)" />
        <PolarAngleAxis
          dataKey="topic"
          tick={{ fontSize: 11, fill: "#8892A4", fontFamily: "DM Sans" }}
        />
        <PolarRadiusAxis
          angle={30}
          domain={[0, 100]}
          tick={{ fontSize: 9, fill: "#3D4F70" }}
          tickCount={4}
          stroke="transparent"
        />
        <Radar
          name="Mastery"
          dataKey="score"
          stroke="#4B7BF5"
          fill="#4B7BF5"
          fillOpacity={0.2}
          strokeWidth={2}
          dot={{ r: 3, fill: "#4B7BF5", strokeWidth: 0 }}
        />
        <Tooltip content={<CustomTooltip />} />
      </RadarChart>
    </ResponsiveContainer>
  );
}

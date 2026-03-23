"use client";

import { useEffect, useState } from "react";
import { useAnalytics } from "@/hooks/useAnalytics";
import SkillRadar from "@/components/progress/SkillRadar";
import StudyPlanCard from "@/components/progress/StudyPlanCard";
import { Sparkles, TrendingUp, AlertTriangle, Loader2 } from "lucide-react";

interface Props {
  user: { id: string; name: string; rewardPoints: number };
}

export default function ProfileClient({ user }: Props) {
  const { radarData, studyPlan, loadingRadar, loadingPlan, fetchRadar, generatePlan } = useAnalytics(user.id);

  useEffect(() => { fetchRadar(); }, [fetchRadar]);

  const strengths   = [...radarData].sort((a, b) => b.score - a.score).slice(0, 3);
  const focusAreas  = [...radarData].sort((a, b) => a.score - b.score).slice(0, 3);
  const iqScore     = radarData.length
    ? Math.round(radarData.reduce((s, d) => s + d.score, 0) / radarData.length * 1.42 + 42)
    : 142;

  return (
    <div className="max-w-5xl mx-auto flex flex-col gap-6">

      {/* Header */}
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h1 className="font-display font-bold text-bright text-2xl md:text-3xl mb-1">
            Protocol: <span className="text-electric">Cognitive Synthesis</span>
          </h1>
          <p className="text-muted text-sm">
            Real-time breakdown of your algorithmic mastery.
            {radarData.length > 0 && " Your performance is in the top 4% of active researchers."}
          </p>
        </div>
        <div className="flex gap-3">
          <div className="stat-card text-center px-5">
            <span className="label">IQ Score</span>
            <p className="font-display font-bold text-bright text-2xl mt-0.5">{iqScore}</p>
          </div>
          <div className="stat-card text-center px-5">
            <span className="label">Streak</span>
            <p className="font-display font-bold text-electric text-2xl mt-0.5">24d</p>
          </div>
        </div>
      </div>

      {/* Main grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">

        {/* Radar chart — 2 cols */}
        <div className="lg:col-span-2 card p-6" style={{ background: "#0D1226" }}>
          <div className="flex items-center justify-between mb-5">
            <div className="flex items-center gap-2">
              <div className="w-5 h-5 rounded flex items-center justify-center"
                style={{ background: "rgba(75,123,245,0.2)" }}>
                <span style={{ color: "#4B7BF5", fontSize: "10px" }}>◈</span>
              </div>
              <span className="font-display font-semibold text-bright text-sm">Knowledge Architecture</span>
            </div>
            <span className="badge badge-neon text-xs">Live Data</span>
          </div>
          {loadingRadar ? (
            <div className="flex items-center justify-center h-64">
              <Loader2 size={24} className="animate-spin" style={{ color: "#4B7BF5" }} />
            </div>
          ) : (
            <SkillRadar data={radarData} height={320} />
          )}
        </div>

        {/* Right panel */}
        <div className="flex flex-col gap-4">

          {/* Strengths */}
          <div className="card p-4" style={{ background: "#0D1226", borderColor: "rgba(57,255,132,0.15)" }}>
            <div className="flex items-center gap-2 mb-3">
              <TrendingUp size={14} style={{ color: "#39FF84" }} />
              <span className="font-display font-semibold text-bright text-sm">Your Strengths</span>
            </div>
            <div className="flex flex-col gap-2">
              {strengths.length > 0
                ? strengths.map(s => (
                    <div key={s.topic} className="flex items-center gap-2 px-3 py-2 rounded-lg"
                      style={{ background: "rgba(57,255,132,0.06)", border: "1px solid rgba(57,255,132,0.15)" }}>
                      <span className="glow-dot" style={{ background: "#39FF84", boxShadow: "0 0 6px #39FF84", width: 6, height: 6, borderRadius: "50%", display: "inline-block" }} />
                      <span className="text-sm font-medium" style={{ color: "#E8EAF0" }}>{s.topic}</span>
                      <span className="ml-auto text-xs font-mono" style={{ color: "#39FF84" }}>{s.score}%</span>
                    </div>
                  ))
                : ["Bit Manipulation", "Sliding Window", "Linked Lists"].map(t => (
                    <div key={t} className="flex items-center gap-2 px-3 py-2 rounded-lg"
                      style={{ background: "rgba(57,255,132,0.06)", border: "1px solid rgba(57,255,132,0.15)" }}>
                      <span style={{ color: "#39FF84", fontSize: 12 }}>✓</span>
                      <span className="text-sm" style={{ color: "#E8EAF0" }}>{t}</span>
                    </div>
                  ))
              }
            </div>
          </div>

          {/* Focus areas */}
          <div className="card p-4" style={{ background: "#0D1226", borderColor: "rgba(255,107,122,0.15)" }}>
            <div className="flex items-center gap-2 mb-3">
              <AlertTriangle size={14} style={{ color: "#FF6B7A" }} />
              <span className="font-display font-semibold text-bright text-sm">Focus Areas</span>
            </div>
            <div className="flex flex-col gap-2">
              {focusAreas.length > 0
                ? focusAreas.map(f => (
                    <div key={f.topic} className="flex items-center gap-2 px-3 py-2 rounded-lg"
                      style={{ background: "rgba(255,107,122,0.06)", border: "1px solid rgba(255,107,122,0.15)" }}>
                      <AlertTriangle size={11} style={{ color: "#FF6B7A" }} />
                      <span className="text-sm font-medium" style={{ color: "#E8EAF0" }}>{f.topic}</span>
                      <span className="ml-auto text-xs font-mono" style={{ color: "#FF6B7A" }}>{f.score}%</span>
                    </div>
                  ))
                : ["Backtracking", "Dijkstra's Algorithm", "System Design"].map(t => (
                    <div key={t} className="flex items-center gap-2 px-3 py-2 rounded-lg"
                      style={{ background: "rgba(255,107,122,0.06)", border: "1px solid rgba(255,107,122,0.15)" }}>
                      <AlertTriangle size={11} style={{ color: "#FF6B7A" }} />
                      <span className="text-sm" style={{ color: "#E8EAF0" }}>{t}</span>
                    </div>
                  ))
              }
            </div>
          </div>

          {/* AI study plan */}
          <div className="card p-4" style={{ background: "#0D1226" }}>
            <div className="flex items-center justify-center w-10 h-10 rounded-xl mb-3 mx-auto"
              style={{ background: "rgba(124,92,252,0.15)", border: "1px solid rgba(124,92,252,0.25)" }}>
              <Sparkles size={18} style={{ color: "#7C5CFC" }} />
            </div>
            <p className="font-display font-semibold text-bright text-sm text-center mb-1">Neural Optimization</p>
            <p className="text-muted text-xs text-center mb-4">
              Our Groq-powered AI will analyze your weaknesses to build a precision-engineered curriculum.
            </p>
            <button
              onClick={generatePlan}
              disabled={loadingPlan}
              className="btn-pulse w-full justify-center text-sm"
            >
              {loadingPlan
                ? <><Loader2 size={14} className="animate-spin" /> Generating...</>
                : <><Sparkles size={14} /> Generate My 7-Day Plan (Groq AI)</>
              }
            </button>
          </div>
        </div>
      </div>

      {/* Study plan output */}
      {studyPlan.length > 0 && (
        <div>
          <p className="label mb-4">Your Personalized Protocol — 7 Days</p>
          <div className="flex gap-4 overflow-x-auto pb-2 no-scrollbar">
            {studyPlan.map((day) => (
              <StudyPlanCard key={day.day} day={day} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

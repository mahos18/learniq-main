"use client";

import { useState } from "react";
import LearnIQPlanner from "@/components/planner/LearnIQPlanner";

export default function LearnIQPlannerPage() {
  const [showPlanner, setShowPlanner] = useState(true);

  return (
    <div className="max-w-7xl mx-auto">
      {/* Header Section */}
      <div className="mb-6">
        <h1 className="font-display font-bold text-bright text-3xl mb-2">
          AI Study Planner
        </h1>
        <p className="text-muted">
          Generate personalized learning roadmaps powered by Groq AI. Get structured plans with real resources and activities.
        </p>
      </div>

      {/* Planner Component */}
      <div className="bg-[#0A0F1E] rounded-xl overflow-hidden border border-[#1E2D55]" style={{ height: "calc(100vh - 200px)", minHeight: "600px" }}>
        <LearnIQPlanner
          onPlanGenerated={(plan) => {
            console.log("Plan generated:", plan);
            // You can save the plan to localStorage or state if needed
          }}
        />
      </div>
    </div>
  );
}
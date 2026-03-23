"use client";

import { useState, useCallback } from "react";
import axios from "axios";
import type { RadarPoint, StudyDay } from "@/types";

export function useAnalytics(studentId: string) {
  const [radarData,  setRadarData]  = useState<RadarPoint[]>([]);
  const [studyPlan,  setStudyPlan]  = useState<StudyDay[]>([]);
  const [loadingRadar, setLoadingRadar] = useState(false);
  const [loadingPlan,  setLoadingPlan]  = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchRadar = useCallback(async () => {
    setLoadingRadar(true);
    setError(null);
    try {
      const { data } = await axios.get(`/api/analytics/radar/${studentId}`);
      setRadarData(data.data || []);
    } catch {
      setError("Failed to load performance data");
    } finally {
      setLoadingRadar(false);
    }
  }, [studentId]);

  const generatePlan = useCallback(async () => {
    if (radarData.length === 0) {
      setError("Complete some quizzes first to generate a study plan.");
      return;
    }
    setLoadingPlan(true);
    setError(null);
    try {
      const { data } = await axios.post("/api/ai/study-plan", { radarData });
      setStudyPlan(data.data || []);
    } catch {
      setError("AI service unavailable. Please try again.");
    } finally {
      setLoadingPlan(false);
    }
  }, [radarData]);

  return { radarData, studyPlan, loadingRadar, loadingPlan, error, fetchRadar, generatePlan };
}

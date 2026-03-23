"use client";

import { useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";

interface SubmitResult {
  isCorrect:    boolean;
  correctIndex: number;
  pointsEarned: number;
  topic:        string;
}

export function useQuiz(moduleId: string, courseId: string) {
  const [results,     setResults]     = useState<Record<string, SubmitResult>>({});
  const [submitting,  setSubmitting]  = useState<string | null>(null);

  const submitAnswer = async (questionId: string, selectedIndex: number) => {
    if (results[questionId]) return; // already answered
    setSubmitting(questionId);

    try {
      const { data } = await axios.post("/api/quiz/submit", {
        moduleId, courseId, questionId, selectedIndex,
      });

      const result: SubmitResult = data.data;
      setResults((prev) => ({ ...prev, [questionId]: result }));

      if (result.isCorrect) {
        toast.success(`+${result.pointsEarned} points! Correct answer`);
      } else {
        toast.error("Not quite — keep going!");
      }
    } catch {
      toast.error("Failed to submit answer");
    } finally {
      setSubmitting(null);
    }
  };

  return { results, submitting, submitAnswer };
}

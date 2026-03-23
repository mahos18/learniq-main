"use client";

import { useState } from "react";
import { useQuiz } from "@/hooks/useQuiz";
import { cn } from "@/lib/utils";
import { Zap, CheckCircle, XCircle, Award } from "lucide-react";
import type { ContentBlockClient } from "@/types";

interface QuizBlockProps {
  block: ContentBlockClient;
  moduleId: string;
  courseId: string;
  variant: "popup" | "end";
  onAnswer?: (questionId: string, isCorrect: boolean) => void;
}

export default function QuizBlock({ block, moduleId, courseId, variant, onAnswer }: QuizBlockProps) {
  const { results, submitting, submitAnswer } = useQuiz(moduleId, courseId);
  const [dismissed, setDismissed] = useState(false);

  if (variant === "popup" && dismissed) return null;

  const isPopup = variant === "popup";

  return (
    <div className={cn(
      "rounded-card border-2 p-4",
      isPopup
        ? "border-ai-400 bg-ai-50 textbg-ai-900/20 textborder-ai-600"
        : "border-brand-200 textborder-brand-700 bg-brand-50 textbg-brand-900/10"
    )}>
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className={cn(
            "w-7 h-7 rounded-lg flex items-center justify-center",
            isPopup ? "bg-ai-500" : "bg-brand-600"
          )}>
            {isPopup
              ? <Zap size={14} className="text-white" />
              : <Award size={14} className="text-white" />
            }
          </div>
          <div>
            <p className={cn("font-semibold text-sm",
              isPopup ? "text-ai-700 text-ai-300" : "text-brand-700 text-brand-300"
            )}>
              {isPopup ? "Quick Check!" : (block.title || "Module Assessment")}
            </p>
            {isPopup && (
              <p className="text-xs text-ai-500 text-ai-400">
                Answer correctly for +{block.questions[0]?.bonusPoints ?? 15} points
              </p>
            )}
          </div>
        </div>
        {isPopup && (
          <button
            onClick={() => setDismissed(true)}
            className="text-xs text-slate-400 hover:text-slate-600 underline"
          >
            Skip
          </button>
        )}
      </div>

      {/* Questions */}
      <div className="flex flex-col gap-5">
        {block.questions.map((q) => {
          const result = results[q._id];
          const answered = !!result;

          return (
            <div key={q._id}>
              <p className="text-sm font-medium text-slate-800 text-slate-200 mb-3">
                {q.question}
              </p>
              <div className="grid grid-cols-1 gap-2">
                {q.options.map((option, idx) => {
                  let state: "default" | "correct" | "wrong" | "revealed" = "default";
                  if (answered) {
                    if (idx === result.correctIndex) state = "correct";
                    else if (idx === q.options.indexOf(option) && !result.isCorrect && idx === q.options.indexOf(option)) state = "default";
                    // highlight the one user picked if wrong
                  }

                  return (
                    <button
                      key={idx}
                      disabled={answered || submitting === q._id}
                      onClick={() => {
                        submitAnswer(q._id, idx);
                        onAnswer?.(q._id, idx === result?.correctIndex);
                      }}
                      className={cn(
                        "w-full text-left px-3 py-2.5 rounded-input border text-sm transition-all",
                        !answered && "hover:border-brand-400 hover:bg-white texthover:bg-slate-700",
                        !answered && "border-slate-200 textborder-slate-600 bg-white textbg-slate-800 text-slate-700 text-slate-300",
                        answered && idx === result.correctIndex && "border-green-400 bg-green-50 textbg-green-900/20 text-green-700 text-green-300 font-medium",
                        answered && idx !== result.correctIndex && "border-slate-100 textborder-slate-700 bg-slate-50 textbg-slate-800/50 text-slate-400 opacity-60",
                        submitting === q._id && "opacity-50 cursor-wait"
                      )}
                    >
                      <span className="flex items-center gap-2">
                        {answered && idx === result.correctIndex && (
                          <CheckCircle size={14} className="text-green-500 flex-shrink-0" />
                        )}
                        {answered && idx !== result.correctIndex && (
                          <span className="w-3.5 h-3.5 flex-shrink-0" />
                        )}
                        {option}
                      </span>
                    </button>
                  );
                })}
              </div>

              {/* Result feedback */}
              {answered && (
                <div className={cn(
                  "flex items-center gap-2 mt-2 text-xs font-medium px-2 py-1 rounded-md",
                  result.isCorrect
                    ? "text-green-600 bg-green-50 textbg-green-900/20"
                    : "text-red-500 bg-red-50 textbg-red-900/20"
                )}>
                  {result.isCorrect
                    ? <><CheckCircle size={13} /> Correct! +{result.pointsEarned} points earned</>
                    : <><XCircle size={13} /> Not quite — review this topic: {q.topic}</>
                  }
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

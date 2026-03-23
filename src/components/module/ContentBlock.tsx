"use client";

import ReactMarkdown from "react-markdown";
import { getYouTubeId } from "@/lib/utils";
import type { ContentBlockClient } from "@/types";
import QuizBlock from "../quiz/QuizBlock";
import Image from "next/image";

interface ContentBlockProps {
  block: ContentBlockClient;
  moduleId: string;
  courseId: string;
  onQuizAnswer?: (questionId: string, isCorrect: boolean) => void;
}

export default function ContentBlock({ block, moduleId, courseId, onQuizAnswer }: ContentBlockProps) {
  return (
    <div className="mb-6">
      {block.title && block.type !== "quiz_popup" && block.type !== "quiz_end" && (
        <h3 className="font-semibold text-slate-800 text-slate-200 text-base mb-3">
          {block.title}
        </h3>
      )}

      {/* ── YouTube embed ───────────────────────────── */}
      {block.type === "youtube" && block.url && (
        <div className="relative aspect-video rounded-card overflow-hidden bg-black">
          <iframe
            src={`https://www.youtube.com/embed/${getYouTubeId(block.url)}`}
            className="absolute inset-0 w-full h-full"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        </div>
      )}

      {/* ── Instructor video ─────────────────────────── */}
      {block.type === "video" && block.url && (
        <div className="rounded-card overflow-hidden bg-black">
          <video
            src={block.url}
            controls
            className="w-full max-h-[480px]"
            preload="metadata"
          />
        </div>
      )}

      {/* ── PDF embed ────────────────────────────────── */}
      {block.type === "pdf" && block.url && (
        <div className="rounded-card overflow-hidden border border-slate-200 textborder-slate-700">
          <div className="bg-slate-50 textbg-slate-800 px-4 py-2 border-b border-slate-200 textborder-slate-700 flex items-center justify-between">
            <span className="text-xs text-slate-500">{block.title || "Document"}</span>
            <a
              href={block.url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-brand-600 hover:underline"
            >
              Open in new tab
            </a>
          </div>
          <iframe
            src={`${block.url}#toolbar=0`}
            className="w-full h-[600px]"
            title={block.title || "PDF document"}
          />
        </div>
      )}

      {/* ── Image ────────────────────────────────────── */}
      {block.type === "image" && block.url && (
        <div className="rounded-card overflow-hidden">
          <div className="relative w-full" style={{ minHeight: 200 }}>
            <Image
              src={block.url}
              alt={block.title || "Course image"}
              width={800}
              height={450}
              className="w-full h-auto rounded-card"
            />
          </div>
          {block.content && (
            <p className="text-xs text-slate-500 text-slate-400 mt-2 text-center italic">
              {block.content}
            </p>
          )}
        </div>
      )}

      {/* ── Rich text / markdown ─────────────────────── */}
      {block.type === "text" && block.content && (
        <div className="prose prose-sm textprose-invert max-w-none
          prose-headings:font-semibold prose-headings:text-slate-900
          prose-p:text-slate-600 prose-p:leading-relaxed
          prose-code:bg-slate-100 prose-code:px-1 prose-code:rounded
          prose-pre:bg-slate-900 prose-pre:text-slate-100
          textprose-headings:text-slate-100 textprose-p:text-slate-300">
          <ReactMarkdown>{block.content}</ReactMarkdown>
        </div>
      )}

      {/* ── Checkpoint / Popup quiz ──────────────────── */}
      {block.type === "quiz_popup" && (
        <QuizBlock
          block={block}
          moduleId={moduleId}
          courseId={courseId}
          variant="popup"
          onAnswer={onQuizAnswer}
        />
      )}

      {/* ── End-of-module quiz ───────────────────────── */}
      {block.type === "quiz_end" && (
        <QuizBlock
          block={block}
          moduleId={moduleId}
          courseId={courseId}
          variant="end"
          onAnswer={onQuizAnswer}
        />
      )}
    </div>
  );
}

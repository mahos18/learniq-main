"use client";

import { useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { Loader2, X } from "lucide-react";
import FileUploader from "./FileUploader";

interface BlockFormProps {
  moduleId: string;
  type: string;
  label: string;
  onSaved: (block: any) => void;
  onClose: () => void;
}

export default function BlockForm({ moduleId, type, label, onSaved, onClose }: BlockFormProps) {
  const [title, setTitle]     = useState("");
  const [url, setUrl]         = useState("");
  const [content, setContent] = useState("");
  const [saving, setSaving]   = useState(false);

  // Quiz state
  const [question, setQuestion]     = useState("");
  const [options, setOptions]       = useState(["", "", "", ""]);
  const [correctIdx, setCorrectIdx] = useState(0);

  const isQuiz    = type === "quiz_popup" || type === "quiz_end";
  const needsFile = type === "video" || type === "pdf" || type === "image";
  const needsUrl  = type === "youtube";

  const handleSave = async () => {
    if (!title.trim() && !isQuiz) return toast.error("Title is required");
    if (needsUrl && !url.trim())  return toast.error("YouTube URL is required");
    if (needsFile && !url.trim()) return toast.error("Please upload a file first");
    if (isQuiz && !question.trim()) return toast.error("Question is required");

    setSaving(true);
    try {
      const payload: any = { type, title, order: 0 };
      if (url)     payload.url     = url;
      if (content) payload.content = content;
      if (isQuiz)  payload.quiz    = {
        question,
        options: options.map((o, i) => ({ text: o, isCorrect: i === correctIdx })),
      };

      const { data } = await axios.post(`/api/modules/${moduleId}/blocks`, payload);
      onSaved(data.data);
      toast.success(`${label} block added!`);
    } catch {
      toast.error("Failed to save block");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: "rgba(0,0,0,0.6)" }}>
      <div className="w-full max-w-lg rounded-xl p-6 flex flex-col gap-4"
        style={{ background: "#0D1226", border: "1px solid #1E2D55" }}>

        {/* Header */}
        <div className="flex items-center justify-between">
          <h3 className="font-semibold text-bright">Add {label}</h3>
          <button onClick={onClose}><X size={18} className="text-muted hover:text-bright" /></button>
        </div>

        {/* Title (not for quizzes) */}
        {!isQuiz && (
          <input
            className="input"
            placeholder="Block title (e.g. Introduction to Arrays)"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        )}

        {/* YouTube URL */}
        {needsUrl && (
          <input
            className="input"
            placeholder="https://www.youtube.com/watch?v=..."
            value={url}
            onChange={(e) => setUrl(e.target.value)}
          />
        )}

        {/* File upload */}
        {needsFile && (
          <FileUploader
            accept={type === "video" ? "video" : type === "pdf" ? "pdf" : "image"}
            label="Upload file"
            onUpload={(uploadedUrl) => setUrl(uploadedUrl)}
          />
        )}

        {/* Text / Markdown */}
        {type === "text" && (
          <textarea
            className="input resize-none h-36"
            placeholder="Write notes or markdown content..."
            value={content}
            onChange={(e) => setContent(e.target.value)}
          />
        )}

        {/* Image caption */}
        {type === "image" && url && (
          <input
            className="input"
            placeholder="Caption (optional)"
            value={content}
            onChange={(e) => setContent(e.target.value)}
          />
        )}

        {/* Quiz fields */}
        {isQuiz && (
          <div className="flex flex-col gap-3">
            <input
              className="input"
              placeholder="Question"
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
            />
            {options.map((opt, i) => (
              <div key={i} className="flex items-center gap-2">
                <input
                  type="radio"
                  name="correct"
                  checked={correctIdx === i}
                  onChange={() => setCorrectIdx(i)}
                  className="accent-blue-500"
                />
                <input
                  className="input flex-1"
                  placeholder={`Option ${i + 1}`}
                  value={opt}
                  onChange={(e) => {
                    const updated = [...options];
                    updated[i] = e.target.value;
                    setOptions(updated);
                  }}
                />
              </div>
            ))}
            <p className="text-xs text-muted">Select the radio button next to the correct answer</p>
          </div>
        )}

        {/* Save */}
        <button
          onClick={handleSave}
          disabled={saving}
          className="btn-primary w-full justify-center py-2.5 text-sm font-semibold"
        >
          {saving ? <><Loader2 size={15} className="animate-spin" /> Saving...</> : "Save Block"}
        </button>
      </div>
    </div>
  );
}
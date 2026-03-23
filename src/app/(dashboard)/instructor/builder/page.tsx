"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import toast from "react-hot-toast";
import { ArrowRight, Loader2, BookOpen, Tag, DollarSign, BarChart2 } from "lucide-react";
import Link from "next/link";

const DIFFICULTIES = ["beginner", "intermediate", "advanced"];

const SUGGESTED_TAGS = [
  "DSA", "Arrays", "Graphs", "Trees", "Dynamic Programming", "Recursion",
  "React", "Next.js", "MongoDB", "JavaScript", "TypeScript", "Python",
  "Machine Learning", "System Design", "Caching", "Microservices",
  "Competitive Programming", "Sorting", "Neural Networks", "SQL",
];

export default function NewCourseBuilderPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    title:       "",
    description: "",
    difficulty:  "beginner",
    pointCost:   0,
    tags:        [] as string[],
    customTag:   "",
  });

  const set = (key: string, value: any) =>
    setForm((prev) => ({ ...prev, [key]: value }));

  const toggleTag = (tag: string) => {
    setForm((prev) => ({
      ...prev,
      tags: prev.tags.includes(tag)
        ? prev.tags.filter((t) => t !== tag)
        : [...prev.tags, tag],
    }));
  };

  const addCustomTag = () => {
    const t = form.customTag.trim();
    if (!t || form.tags.includes(t)) return;
    setForm((prev) => ({ ...prev, tags: [...prev.tags, t], customTag: "" }));
  };

  const handleSubmit = async () => {
    if (!form.title.trim()) return toast.error("Title is required");
    if (!form.description.trim()) return toast.error("Description is required");

    setLoading(true);
    try {
      const { data } = await axios.post("/api/courses", {
        title:       form.title.trim(),
        description: form.description.trim(),
        difficulty:  form.difficulty,
        pointCost:   Number(form.pointCost),
        tags:        form.tags,
      });
      toast.success("Course created! Now add your modules.");
      router.push(`/instructor/courses/${data.data._id}/builder`);
    } catch (err: any) {
      toast.error(err?.response?.data?.error || "Failed to create course");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto animate-fade-in">

      {/* Header */}
      <div className="mb-8">
        <Link href="/instructor/dashboard"
          className="text-sm text-muted hover:text-bright transition-colors mb-4 inline-flex items-center gap-1">
          ← Back to dashboard
        </Link>
        <h1 className="font-display font-bold text-bright text-2xl mb-1">
          Create New Course
        </h1>
        <p className="text-muted text-sm">
          Fill in the details below. You will add modules and content after creation.
        </p>
      </div>

      <div className="flex flex-col gap-5">

        {/* Title */}
        <div className="card p-5" style={{ background: "#0D1226" }}>
          <div className="flex items-center gap-2 mb-3">
            <BookOpen size={15} style={{ color: "#4B7BF5" }} />
            <span className="font-display font-semibold text-bright text-sm">Course title</span>
          </div>
          <input
            className="input"
            placeholder="e.g. Data Structures & Algorithms"
            value={form.title}
            onChange={(e) => set("title", e.target.value)}
          />
        </div>

        {/* Description */}
        <div className="card p-5" style={{ background: "#0D1226" }}>
          <div className="flex items-center gap-2 mb-3">
            <BookOpen size={15} style={{ color: "#4B7BF5" }} />
            <span className="font-display font-semibold text-bright text-sm">Description</span>
          </div>
          <textarea
            className="input resize-none h-28"
            placeholder="What will students learn? Who is this for?"
            value={form.description}
            onChange={(e) => set("description", e.target.value)}
          />
        </div>

        {/* Difficulty + Points */}
        <div className="grid grid-cols-2 gap-4">
          <div className="card p-5" style={{ background: "#0D1226" }}>
            <div className="flex items-center gap-2 mb-3">
              <BarChart2 size={15} style={{ color: "#7C5CFC" }} />
              <span className="font-display font-semibold text-bright text-sm">Difficulty</span>
            </div>
            <div className="flex flex-col gap-2">
              {DIFFICULTIES.map((d) => (
                <button
                  key={d}
                  onClick={() => set("difficulty", d)}
                  className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-all capitalize"
                  style={{
                    background: form.difficulty === d ? "rgba(75,123,245,0.15)" : "transparent",
                    border: `1px solid ${form.difficulty === d ? "rgba(75,123,245,0.4)" : "#1E2D55"}`,
                    color: form.difficulty === d ? "#7BA7FF" : "#8892A4",
                  }}
                >
                  <span className="w-2 h-2 rounded-full flex-shrink-0" style={{
                    background: d === "beginner" ? "#39FF84" : d === "intermediate" ? "#F5A623" : "#FF6B7A"
                  }} />
                  {d}
                </button>
              ))}
            </div>
          </div>

          <div className="card p-5" style={{ background: "#0D1226" }}>
            <div className="flex items-center gap-2 mb-3">
              <DollarSign size={15} style={{ color: "#F5A623" }} />
              <span className="font-display font-semibold text-bright text-sm">Points to unlock</span>
            </div>
            <p className="text-muted text-xs mb-3">
              Students can redeem this course using reward points. Set 0 for free.
            </p>
            <input
              type="number"
              min={0}
              step={50}
              className="input"
              placeholder="e.g. 500"
              value={form.pointCost}
              onChange={(e) => set("pointCost", e.target.value)}
            />
            {Number(form.pointCost) > 0 && (
              <p className="text-xs mt-2" style={{ color: "#F5A623" }}>
                Students need {form.pointCost} XP to unlock for free
              </p>
            )}
          </div>
        </div>

        {/* Tags */}
        <div className="card p-5" style={{ background: "#0D1226" }}>
          <div className="flex items-center gap-2 mb-3">
            <Tag size={15} style={{ color: "#00D4FF" }} />
            <span className="font-display font-semibold text-bright text-sm">Topic tags</span>
            <span className="text-muted text-xs ml-auto">
              {form.tags.length} selected
            </span>
          </div>

          {/* Selected tags */}
          {form.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-3">
              {form.tags.map((t) => (
                <span
                  key={t}
                  onClick={() => toggleTag(t)}
                  className="badge badge-electric cursor-pointer hover:opacity-70 transition-opacity"
                >
                  {t} ✕
                </span>
              ))}
            </div>
          )}

          {/* Suggested tags */}
          <div className="flex flex-wrap gap-2 mb-3">
            {SUGGESTED_TAGS.filter((t) => !form.tags.includes(t)).map((t) => (
              <button
                key={t}
                onClick={() => toggleTag(t)}
                className="badge text-xs transition-all cursor-pointer"
                style={{
                  background: "rgba(75,123,245,0.06)",
                  border: "1px solid #1E2D55",
                  color: "#8892A4",
                }}
              >
                + {t}
              </button>
            ))}
          </div>

          {/* Custom tag input */}
          <div className="flex gap-2">
            <input
              className="input text-sm flex-1"
              placeholder="Add custom tag..."
              value={form.customTag}
              onChange={(e) => set("customTag", e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && addCustomTag()}
            />
            <button
              onClick={addCustomTag}
              className="btn-ghost text-sm px-3"
            >
              Add
            </button>
          </div>
        </div>

        {/* Preview */}
        {form.title && (
          <div className="card p-4 border-electric" style={{ background: "#0D1226", borderColor: "rgba(75,123,245,0.2)" }}>
            <p className="label mb-3">Preview</p>
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0"
                style={{ background: "rgba(75,123,245,0.15)", border: "1px solid rgba(75,123,245,0.3)" }}>
                <BookOpen size={18} style={{ color: "#4B7BF5" }} />
              </div>
              <div>
                <p className="font-display font-semibold text-bright">{form.title}</p>
                {form.description && (
                  <p className="text-muted text-xs mt-1 line-clamp-2">{form.description}</p>
                )}
                <div className="flex items-center gap-2 mt-2 flex-wrap">
                  <span className="badge text-xs capitalize"
                    style={{
                      background: form.difficulty === "beginner"
                        ? "rgba(57,255,132,0.1)" : form.difficulty === "intermediate"
                        ? "rgba(245,166,35,0.1)" : "rgba(255,107,122,0.1)",
                      color: form.difficulty === "beginner"
                        ? "#39FF84" : form.difficulty === "intermediate"
                        ? "#F5A623" : "#FF6B7A",
                      border: `1px solid ${form.difficulty === "beginner"
                        ? "rgba(57,255,132,0.2)" : form.difficulty === "intermediate"
                        ? "rgba(245,166,35,0.2)" : "rgba(255,107,122,0.2)"}`,
                    }}>
                    {form.difficulty}
                  </span>
                  {Number(form.pointCost) > 0 && (
                    <span className="badge badge-amber">{form.pointCost} XP</span>
                  )}
                  {form.tags.slice(0, 3).map((t) => (
                    <span key={t} className="badge badge-electric text-xs">{t}</span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Submit */}
        <button
          onClick={handleSubmit}
          disabled={loading || !form.title || !form.description}
          className="btn-primary w-full justify-center py-3 text-sm font-semibold"
          style={{ opacity: (!form.title || !form.description) ? 0.5 : 1 }}
        >
          {loading
            ? <><Loader2 size={16} className="animate-spin" /> Creating course...</>
            : <>Create Course & Add Modules <ArrowRight size={16} /></>
          }
        </button>

      </div>
    </div>
  );
}
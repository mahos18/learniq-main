"use client";

import { useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { DndContext, closestCenter, DragEndEvent } from "@dnd-kit/core";
import { SortableContext, verticalListSortingStrategy, useSortable, arrayMove } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { cn } from "@/lib/utils";
import {
  GripVertical, Plus, Trash2, ChevronDown, ChevronUp,
  Youtube, Video, FileText, Image, BookOpen, Zap, CheckSquare, Eye
} from "lucide-react";
import Link from "next/link";

const BLOCK_TYPES = [
  { value: "youtube",    label: "YouTube Video",  icon: Youtube },
  { value: "video",      label: "Uploaded Video", icon: Video },
  { value: "pdf",        label: "PDF / Document", icon: FileText },
  { value: "image",      label: "Image",          icon: Image },
  { value: "text",       label: "Notes / Text",   icon: BookOpen },
  { value: "quiz_popup", label: "Checkpoint Quiz",icon: Zap },
  { value: "quiz_end",   label: "Module Quiz",    icon: CheckSquare },
];

export default function BuilderClient({ course }: { course: any }) {
  const [modules, setModules]   = useState<any[]>(course.modules || []);
  const [expanded, setExpanded] = useState<string | null>(null);
  const [saving, setSaving]     = useState(false);

  // ── Add new module ──────────────────────────────────────
  const addModule = async () => {
    try {
      const { data } = await axios.post(`/api/courses/${course._id}/modules`, {
        title: `Module ${modules.length + 1}`,
        order: modules.length + 1,
      });
      setModules((prev) => [...prev, data.data]);
      toast.success("Module added");
    } catch { toast.error("Failed to add module"); }
  };

  // ── Delete module ───────────────────────────────────────
  const deleteModule = async (moduleId: string) => {
    if (!confirm("Delete this module and all its content?")) return;
    try {
      await axios.delete(`/api/modules/${moduleId}`);
      setModules((prev) => prev.filter((m) => m._id !== moduleId));
      toast.success("Module deleted");
    } catch { toast.error("Failed to delete"); }
  };

  // ── Drag-and-drop reorder ───────────────────────────────
  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const oldIndex = modules.findIndex((m) => m._id === active.id);
    const newIndex = modules.findIndex((m) => m._id === over.id);
    const reordered = arrayMove(modules, oldIndex, newIndex).map((m, i) => ({ ...m, order: i + 1 }));
    setModules(reordered);

    // Persist new order
    try {
      await axios.put(`/api/modules/reorder`, {
        courseId: course._id,
        order: reordered.map((m) => ({ id: m._id, order: m.order })),
      });
    } catch { toast.error("Failed to save order"); }
  };

  // ── Toggle publish ──────────────────────────────────────
  const togglePublish = async () => {
    setSaving(true);
    try {
      await axios.put(`/api/courses/${course._id}`, { isPublished: !course.isPublished });
      toast.success(course.isPublished ? "Course unpublished" : "Course published!");
      course.isPublished = !course.isPublished;
    } catch { toast.error("Failed"); }
    setSaving(false);
  };

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex items-start justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 text-white">{course.title}</h1>
          <p className="text-slate-400 text-sm mt-1">Course builder — drag modules to reorder</p>
        </div>
        <div className="flex gap-2">
          <Link href={`/instructor/courses`} className="btn-secondary text-sm">
            ← Back
          </Link>
          <button onClick={togglePublish} disabled={saving}
            className={cn("btn-primary text-sm flex items-center gap-1.5", saving && "opacity-50")}>
            <Eye size={14} />
            {course.isPublished ? "Unpublish" : "Publish"}
          </button>
        </div>
      </div>

      {/* Module list with DnD */}
      <DndContext collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        <SortableContext items={modules.map((m) => m._id)} strategy={verticalListSortingStrategy}>
          <div className="flex flex-col gap-3">
            {modules.map((mod) => (
              <SortableModule
                key={mod._id}
                mod={mod}
                courseId={course._id}
                expanded={expanded === mod._id}
                onToggle={() => setExpanded(expanded === mod._id ? null : mod._id)}
                onDelete={() => deleteModule(mod._id)}
                onUpdate={(updated: any) =>
                  setModules((prev) => prev.map((m) => (m._id === updated._id ? updated : m)))
                }
              />
            ))}
          </div>
        </SortableContext>
      </DndContext>

      {/* Add module */}
      <button
        onClick={addModule}
        className="mt-4 w-full border-2 border-dashed border-slate-200 dark:border-slate-600 rounded-card py-4 flex items-center justify-center gap-2 text-slate-400 hover:border-brand-400 hover:text-brand-500 transition-colors"
      >
        <Plus size={18} /> Add Module
      </button>
    </div>
  );
}

// ── Sortable module card ────────────────────────────────────
function SortableModule({ mod, courseId, expanded, onToggle, onDelete, onUpdate }: any) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } =
    useSortable({ id: mod._id });

  const style = { transform: CSS.Transform.toString(transform), transition };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={cn("card", isDragging && "opacity-50 shadow-card-hover")}
    >
      {/* Module header */}
      <div className="flex items-center gap-3 p-4">
        <button {...attributes} {...listeners} className="cursor-grab active:cursor-grabbing text-slate-300 hover:text-slate-500">
          <GripVertical size={18} />
        </button>
        <span className="w-6 h-6 bg-brand-100 dark:bg-brand-800 text-brand-700 text-brand-200 rounded-full text-xs flex items-center justify-center font-semibold">
          {mod.order}
        </span>
        <span className="flex-1 font-medium text-slate-800 text-white text-sm">{mod.title}</span>
        <span className="text-xs text-slate-400">{mod.contentBlocks?.length || 0} blocks</span>
        <button onClick={onToggle} className="text-slate-400 hover:text-slate-600 p-1">
          {expanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
        </button>
        <button onClick={onDelete} className="text-slate-300 hover:text-red-400 p-1 transition-colors">
          <Trash2 size={15} />
        </button>
      </div>

      {/* Expanded: content block editor */}
      {expanded && (
        <div className="border-t border-slate-100 dark:border-slate-700 p-4">
          <ContentBlockEditor mod={mod} courseId={courseId} onUpdate={onUpdate} />
        </div>
      )}
    </div>
  );
}

// ── Content block editor ────────────────────────────────────
function ContentBlockEditor({ mod, onUpdate }: any) {
  const [blocks, setBlocks]   = useState<any[]>(mod.contentBlocks || []);
  const [showAdd, setShowAdd] = useState(false);
  const [newType, setNewType] = useState("youtube");
  const [newUrl, setNewUrl]   = useState("");
  const [newText, setNewText] = useState("");
  const [newTitle, setNewTitle] = useState("");
  const [adding, setAdding]   = useState(false);

  const addBlock = async () => {
    setAdding(true);
    try {
      const blockData: any = { type: newType, order: blocks.length + 1, title: newTitle };
      if (["youtube","video","pdf","image"].includes(newType)) blockData.url = newUrl;
      if (newType === "text") blockData.content = newText;
      if (["quiz_popup","quiz_end"].includes(newType)) {
        blockData.questions = [{
          question: "Enter your question here",
          options: ["Option A", "Option B", "Option C", "Option D"],
          correctIndex: 0,
          topic: "General",
          bonusPoints: newType === "quiz_popup" ? 15 : 25,
        }];
      }

      const { data } = await axios.post(`/api/modules/${mod._id}/blocks`, blockData);
      const updated = data.data;
      setBlocks(updated.contentBlocks);
      onUpdate(updated);
      setShowAdd(false);
      setNewUrl(""); setNewText(""); setNewTitle("");
      toast.success("Block added");
    } catch { toast.error("Failed to add block"); }
    setAdding(false);
  };

  const deleteBlock = async (blockId: string) => {
    try {
      const { data } = await axios.delete(`/api/modules/${mod._id}/blocks/${blockId}`);
      setBlocks(data.data.contentBlocks);
      onUpdate(data.data);
      toast.success("Block removed");
    } catch { toast.error("Failed to remove block"); }
  };

  const sortedBlocks = [...blocks].sort((a, b) => a.order - b.order);
  const isUrlType  = ["youtube","video","pdf","image"].includes(newType);
  const isTextType = newType === "text";
  const isQuizType = ["quiz_popup","quiz_end"].includes(newType);

  return (
    <div className="flex flex-col gap-2">
      {/* Existing blocks */}
      {sortedBlocks.map((block) => {
        const bt = BLOCK_TYPES.find((t) => t.value === block.type);
        const Icon = bt?.icon || BookOpen;
        return (
          <div key={block._id} className="flex items-center gap-3 bg-slate-50 dark:bg-slate-700/50 rounded-input px-3 py-2">
            <Icon size={14} className="text-slate-400 flex-shrink-0" />
            <span className="text-xs text-slate-500 font-medium w-24 flex-shrink-0">{bt?.label}</span>
            <span className="text-sm text-slate-700 text-slate-200 flex-1 truncate">
              {block.title || block.url || block.content?.slice(0, 40) || "Quiz block"}
            </span>
            <button onClick={() => deleteBlock(block._id)} className="text-slate-300 hover:text-red-400 transition-colors">
              <Trash2 size={13} />
            </button>
          </div>
        );
      })}

      {/* Add block form */}
      {showAdd ? (
        <div className="border border-slate-200 dark:border-slate-600 rounded-input p-3 flex flex-col gap-2 mt-1">
          <input
            className="input text-sm"
            placeholder="Block title (optional)"
            value={newTitle}
            onChange={(e) => setNewTitle(e.target.value)}
          />
          <select
            className="input text-sm"
            value={newType}
            onChange={(e) => setNewType(e.target.value)}
          >
            {BLOCK_TYPES.map((t) => (
              <option key={t.value} value={t.value}>{t.label}</option>
            ))}
          </select>
          {isUrlType && (
            <input
              className="input text-sm"
              placeholder={newType === "youtube" ? "YouTube URL" : "Cloudinary / file URL"}
              value={newUrl}
              onChange={(e) => setNewUrl(e.target.value)}
            />
          )}
          {isTextType && (
            <textarea
              className="input text-sm h-24 resize-none"
              placeholder="Write markdown notes here..."
              value={newText}
              onChange={(e) => setNewText(e.target.value)}
            />
          )}
          {isQuizType && (
            <p className="text-xs text-slate-400 italic">Quiz block will be created with a placeholder question. Edit it after saving.</p>
          )}
          <div className="flex gap-2">
            <button onClick={addBlock} disabled={adding} className="btn-primary text-sm py-1.5 px-3">
              {adding ? "Adding..." : "Add Block"}
            </button>
            <button onClick={() => setShowAdd(false)} className="btn-secondary text-sm py-1.5 px-3">
              Cancel
            </button>
          </div>
        </div>
      ) : (
        <button
          onClick={() => setShowAdd(true)}
          className="flex items-center gap-1.5 text-sm text-brand-500 hover:text-brand-700 transition-colors mt-1 py-1"
        >
          <Plus size={14} /> Add content block
        </button>
      )}
    </div>
  );
}

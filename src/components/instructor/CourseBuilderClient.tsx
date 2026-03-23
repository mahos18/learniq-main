"use client";

import { useState } from "react";
import BlockForm from "@/components/BlockForm";
import {
  DndContext, closestCenter, KeyboardSensor,
  PointerSensor, useSensor, useSensors, DragEndEvent,
} from "@dnd-kit/core";
import {
  SortableContext, sortableKeyboardCoordinates,
  verticalListSortingStrategy, useSortable, arrayMove,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import axios from "axios";
import toast from "react-hot-toast";
import { GripVertical, Plus, Trash2, ChevronDown, ChevronRight, Video, FileText, Image, Youtube, AlignLeft, Zap, Award } from "lucide-react";
import { cn } from "@/lib/utils";

interface Module { _id: string; title: string; order: number; contentBlocks: any[] }

const BLOCK_TYPES = [
  { type: "youtube",    label: "YouTube Video",     icon: Youtube    },
  { type: "video",      label: "Upload Video",       icon: Video      },
  { type: "pdf",        label: "PDF Document",       icon: FileText   },
  { type: "image",      label: "Image",              icon: Image      },
  { type: "text",       label: "Notes / Markdown",   icon: AlignLeft  },
  { type: "quiz_popup", label: "Checkpoint Quiz",    icon: Zap        },
  { type: "quiz_end",   label: "End-of-Module Quiz", icon: Award      },
];
const [blockFormType, setBlockFormType] = useState<{ type: string; label: string } | null>(null);

function SortableModule({ mod, onDelete, onExpand, expanded }: any) {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id: mod._id });
  const style = { transform: CSS.Transform.toString(transform), transition };

  return (
    <div ref={setNodeRef} style={style} className="card mb-2">
      <div className="flex items-center gap-2 px-3 py-3">
        <button {...attributes} {...listeners} className="cursor-grab active:cursor-grabbing text-slate-300 hover:text-slate-500 p-1">
          <GripVertical size={16} />
        </button>
        <span className="text-xs text-slate-400 w-5 text-center">{mod.order}</span>
        <span className="flex-1 font-medium text-slate-800 text-slate-200 text-sm">{mod.title}</span>
        <span className="text-xs text-slate-400">{mod.contentBlocks?.length ?? 0} blocks</span>
        <button onClick={() => onExpand(mod._id)} className="p-1 text-slate-400 hover:text-slate-600">
          {expanded ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
        </button>
        <button onClick={() => onDelete(mod._id)} className="p-1 text-slate-300 hover:text-red-400">
          <Trash2 size={14} />
        </button>
      </div>
    </div>
  );
}

export default function CourseBuilderClient({ courseId, initialModules }: {
  courseId: string;
  initialModules: Module[];
}) {
  const [modules, setModules]     = useState<Module[]>(initialModules);
  const [expanded, setExpanded]   = useState<string | null>(null);
  const [newTitle, setNewTitle]   = useState("");
  const [adding, setAdding]       = useState(false);
  const [showBlockMenu, setShowBlockMenu] = useState(false);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const oldIdx = modules.findIndex((m) => m._id === active.id);
    const newIdx = modules.findIndex((m) => m._id === over.id);
    const reordered = arrayMove(modules, oldIdx, newIdx).map((m, i) => ({ ...m, order: i + 1 }));
    setModules(reordered);

    // Persist reorder
    try {
      await axios.put(`/api/modules/${active.id}`, { order: newIdx + 1 });
    } catch {
      toast.error("Failed to save order");
    }
  };

  const addModule = async () => {
    if (!newTitle.trim()) return;
    setAdding(true);
    try {
      const { data } = await axios.post(`/api/courses/${courseId}/modules`, {
        title: newTitle.trim(),
        order: modules.length + 1,
      });
      setModules((prev) => [...prev, data.data]);
      setNewTitle("");
      toast.success("Module added");
    } catch {
      toast.error("Failed to add module");
    } finally {
      setAdding(false);
    }
  };

  const deleteModule = async (moduleId: string) => {
    if (!confirm("Delete this module and all its content?")) return;
    try {
      await axios.delete(`/api/modules/${moduleId}`);
      setModules((prev) => prev.filter((m) => m._id !== moduleId));
      toast.success("Module deleted");
    } catch {
      toast.error("Failed to delete");
    }
  };

  const handleBlockSaved = (newBlock: any) => {
  setModules((prev) =>
    prev.map((m) =>
      m._id === expanded
        ? { ...m, contentBlocks: [...m.contentBlocks, newBlock] }
        : m
    )
  );
  setBlockFormType(null);
};

{blockFormType && expanded && (
  <BlockForm
    moduleId={expanded}
    type={blockFormType.type}
    label={blockFormType.label}
    onSaved={handleBlockSaved}
    onClose={() => setBlockFormType(null)}
  />
)}

  const toggleExpand = (id: string) => setExpanded((p) => (p === id ? null : id));

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Left: Module list */}
      <div className="lg:col-span-1">
        <div className="card p-4">
          <h2 className="font-semibold text-slate-900 text-white mb-4 text-sm">
            Course Roadmap
          </h2>

          <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
            <SortableContext items={modules.map((m) => m._id)} strategy={verticalListSortingStrategy}>
              {modules.map((mod) => (
                <SortableModule
                  key={mod._id}
                  mod={mod}
                  onDelete={deleteModule}
                  onExpand={toggleExpand}
                  expanded={expanded === mod._id}
                />
              ))}
            </SortableContext>
          </DndContext>

          {/* Add module */}
          <div className="flex gap-2 mt-3">
            <input
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && addModule()}
              placeholder="New module title..."
              className="input text-sm flex-1"
            />
            <button
              onClick={addModule}
              disabled={adding || !newTitle.trim()}
              className="btn-primary px-3 py-2"
            >
              <Plus size={16} />
            </button>
          </div>
        </div>
      </div>

      {/* Right: Content block editor for selected module */}
      <div className="lg:col-span-2">
        {expanded ? (
          <div className="card p-4">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-semibold text-slate-900 text-white text-sm">
                {modules.find((m) => m._id === expanded)?.title}
              </h2>
              <div className="relative">
                <button
                  onClick={() => setShowBlockMenu((p) => !p)}
                  className="btn-primary text-xs flex items-center gap-1.5"
                >
                  <Plus size={14} /> Add Block
                </button>
                {showBlockMenu && (
                  <div className="absolute right-0 top-9 w-52 card py-1 z-10 shadow-lg">
                    {BLOCK_TYPES.map(({ type, label, icon: Icon }) => (
                      <button
                        key={type}
                        onClick={() => {
                          setShowBlockMenu(false);
                          setBlockFormType({ type, label });
                        }}
                        className="w-full flex items-center gap-2 px-3 py-2 text-sm text-slate-600 text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700"
                      >
                        <Icon size={14} className="text-slate-400" />
                        {label}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Block list */}
            {(modules.find((m) => m._id === expanded)?.contentBlocks ?? []).length === 0 ? (
              <div className="text-center py-12 text-slate-400 border-2 border-dashed border-slate-200 dark:border-slate-700 rounded-card">
                <p className="text-sm">No content yet</p>
                <p className="text-xs mt-1">Click &quot;Add Block&quot; to start building this module</p>
              </div>
            ) : (
              <div className="flex flex-col gap-2">
                {modules.find((m) => m._id === expanded)?.contentBlocks.map((block: any) => (
                  <div key={block._id} className="flex items-center gap-3 p-3 bg-slate-50 dark:bg-slate-700/50 rounded-input">
                    <span className={cn("badge text-xs",
                      block.type.includes("quiz") ? "bg-ai-50 text-ai-700" : "bg-brand-50 text-brand-700"
                    )}>
                      {block.type}
                    </span>
                    <span className="flex-1 text-sm text-slate-700 text-slate-300 truncate">
                      {block.title || block.url || "Untitled block"}
                    </span>
                    <span className="text-xs text-slate-400">#{block.order}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        ) : (
          <div className="card p-8 flex flex-col items-center justify-center text-slate-400 min-h-64">
            <ChevronRight size={32} className="mb-2 opacity-30" />
            <p className="text-sm">Select a module to edit its content</p>
          </div>
        )}
      </div>
    </div>
  );
}

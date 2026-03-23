"use client";

import { useState, useRef } from "react";
import axios from "axios";
import { Loader2, UploadCloud, X } from "lucide-react";

interface FileUploaderProps {
  accept: "image" | "video" | "pdf" | "all";
  onUpload: (url: string) => void;
  label?: string;
}

const ACCEPT_MAP = {
  image: "image/*",
  video: "video/*",
  pdf:   "application/pdf",
  all:   "image/*,video/*,application/pdf",
};

export default function FileUploader({ accept, onUpload, label }: FileUploaderProps) {
  const [uploading, setUploading] = useState(false);
  const [preview, setPreview]     = useState<string | null>(null);
  const [fileName, setFileName]   = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFile = async (file: File) => {
    setFileName(file.name);
    setUploading(true);

    // Local preview for images
    if (file.type.startsWith("image/")) {
      setPreview(URL.createObjectURL(file));
    }

    try {
      const fd = new FormData();
      fd.append("file", file);
      const { data } = await axios.post("/api/upload", fd);
      onUpload(data.url);  // passes Cloudinary URL back to parent
    } catch {
      alert("Upload failed. Please try again.");
    } finally {
      setUploading(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  };

  return (
    <div className="flex flex-col gap-2">
      {label && <span className="text-sm font-medium text-bright">{label}</span>}

      <div
        onDrop={handleDrop}
        onDragOver={(e) => e.preventDefault()}
        onClick={() => inputRef.current?.click()}
        className="border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-all"
        style={{ borderColor: "#1E2D55", background: "#0D1226" }}
      >
        <input
          ref={inputRef}
          type="file"
          accept={ACCEPT_MAP[accept]}
          className="hidden"
          onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])}
        />

        {uploading ? (
          <div className="flex flex-col items-center gap-2 text-muted">
            <Loader2 size={24} className="animate-spin" style={{ color: "#4B7BF5" }} />
            <span className="text-sm">Uploading {fileName}...</span>
          </div>
        ) : preview ? (
          <div className="relative">
            <img src={preview} className="max-h-40 mx-auto rounded" />
            <button
              onClick={(e) => { e.stopPropagation(); setPreview(null); setFileName(null); }}
              className="absolute top-1 right-1 bg-black/60 rounded-full p-0.5"
            >
              <X size={14} className="text-white" />
            </button>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-2 text-muted">
            <UploadCloud size={24} style={{ color: "#4B7BF5" }} />
            <span className="text-sm">
              {fileName ?? "Drag & drop or click to upload"}
            </span>
            <span className="text-xs opacity-50">
              {accept === "all" ? "Images, videos, PDFs" : accept.toUpperCase()}
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
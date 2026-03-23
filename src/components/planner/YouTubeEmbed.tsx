"use client";

import { useState } from "react";
import { Play, Maximize2, Minimize2, ExternalLink } from "lucide-react";

interface YouTubeEmbedProps {
  videoUrl: string;
  title?: string;
}

export default function YouTubeEmbed({ videoUrl, title }: YouTubeEmbedProps) {
  const [isFullscreen, setIsFullscreen] = useState(false);
  
  const extractVideoId = (url: string): string | null => {
    const patterns = [
      /(?:youtube\.com\/watch\?v=)([^&]+)/,
      /(?:youtu\.be\/)([^?]+)/,
      /(?:youtube\.com\/embed\/)([^/]+)/,
      /(?:youtube\.com\/shorts\/)([^?]+)/,
    ];
    
    for (const pattern of patterns) {
      const match = url.match(pattern);
      if (match) return match[1];
    }
    return null;
  };
  
  const videoId = extractVideoId(videoUrl);
  
  if (!videoId) {
    return (
      <a
        href={videoUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center gap-2 p-2 rounded-lg bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 hover:bg-indigo-500/20 transition-all"
      >
        <Play size={14} />
        <span className="text-xs">{title || "Watch on YouTube"}</span>
        <ExternalLink size={12} />
      </a>
    );
  }
  
  const embedUrl = `https://www.youtube.com/embed/${videoId}`;
  
  if (isFullscreen) {
    return (
      <div className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center p-4">
        <button
          onClick={() => setIsFullscreen(false)}
          className="absolute top-4 right-4 p-2 rounded-lg bg-white/10 hover:bg-white/20 transition-colors"
        >
          <Minimize2 size={20} className="text-white" />
        </button>
        <iframe
          src={`${embedUrl}?autoplay=1`}
          title={title || "YouTube video player"}
          className="w-full max-w-5xl aspect-video rounded-xl"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
      </div>
    );
  }
  
  return (
    <div className="relative group">
      <iframe
        src={embedUrl}
        title={title || "YouTube video player"}
        className="w-full aspect-video rounded-lg"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
      />
      <button
        onClick={() => setIsFullscreen(true)}
        className="absolute bottom-2 right-2 p-1.5 rounded-md bg-black/50 hover:bg-black/70 transition-colors opacity-0 group-hover:opacity-100"
      >
        <Maximize2 size={14} className="text-white" />
      </button>
    </div>
  );
}
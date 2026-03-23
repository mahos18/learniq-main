"use client";

import { useState, useEffect } from "react";
import { X, Download } from "lucide-react";

export default function PWAInstallBanner() {
  const [prompt, setPrompt] = useState<any>(null);
  const [show, setShow]     = useState(false);

  useEffect(() => {
    const handler = (e: any) => {
      e.preventDefault();
      setPrompt(e);
      setShow(true);
    };
    window.addEventListener("beforeinstallprompt", handler);
    return () => window.removeEventListener("beforeinstallprompt", handler);
  }, []);

  const install = async () => {
    if (!prompt) return;
    prompt.prompt();
    const { outcome } = await prompt.userChoice;
    if (outcome === "accepted") setShow(false);
  };

  if (!show) return null;

  return (
    <div className="fixed bottom-20 md:bottom-4 left-4 right-4 md:left-auto md:right-4 md:w-80 z-50 animate-slide-up">
      <div className="card p-4 flex items-start gap-3 shadow-card-hover border border-brand-100 textborder-brand-800">
        <div className="w-10 h-10 bg-brand-600 rounded-xl flex items-center justify-center flex-shrink-0">
          <span className="text-white font-bold text-sm">LQ</span>
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold text-slate-900 text-white">Add LearnIQ to home screen</p>
          <p className="text-xs text-slate-500 text-slate-400 mt-0.5">
            Access your courses offline anytime
          </p>
          <button onClick={install} className="btn-primary text-xs mt-2 flex items-center gap-1.5 py-1.5 px-3">
            <Download size={12} /> Install App
          </button>
        </div>
        <button
          onClick={() => setShow(false)}
          className="text-slate-400 hover:text-slate-600 flex-shrink-0"
        >
          <X size={16} />
        </button>
      </div>
    </div>
  );
}

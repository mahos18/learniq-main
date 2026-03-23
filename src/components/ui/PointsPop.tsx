"use client";

import { useEffect, useState } from "react";

interface PointsPopProps {
  points: number;
  show: boolean;
  onComplete?: () => void;
}

export default function PointsPop({ points, show, onComplete }: PointsPopProps) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (show) {
      setVisible(true);
      const t = setTimeout(() => {
        setVisible(false);
        onComplete?.();
      }, 1200);
      return () => clearTimeout(t);
    }
  }, [show, onComplete]);

  if (!visible) return null;

  return (
    <div
      className="pointer-events-none fixed bottom-24 right-6 z-50 flex items-center gap-1
        bg-amber-400 text-amber-900 font-bold text-lg px-4 py-2 rounded-pill shadow-lg
        animate-slide-up opacity-0"
      style={{ animation: "slideUp 0.3s ease-out forwards, fadeOut 0.4s ease-in 0.8s forwards" }}
    >
      +{points} pts
    </div>
  );
}

"use client";
interface Props { size?: number; progress: number; color?: string; }
export default function ProgressRing({ size = 40, progress, color = "#4B7BF5" }: Props) {
  const r = (size - 4) / 2;
  const circ = 2 * Math.PI * r;
  const dash = circ * (progress / 100);
  return (
    <svg width={size} height={size} style={{ transform: "rotate(-90deg)" }}>
      <circle cx={size/2} cy={size/2} r={r} fill="none" stroke="#1E2D55" strokeWidth="2.5" />
      <circle cx={size/2} cy={size/2} r={r} fill="none" stroke={color} strokeWidth="2.5"
        strokeDasharray={`${dash} ${circ}`} strokeLinecap="round"
        style={{ transition: "stroke-dasharray 0.6s ease" }} />
    </svg>
  );
}

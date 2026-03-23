"use client";

import { formatPoints } from "@/lib/utils";
import { Coins, BookOpen, ArrowUpRight, ArrowDownLeft, Trophy } from "lucide-react";
import { format } from "date-fns";

interface Transaction { _id: string; action: string; points: number; description: string; createdAt: string; }
interface Course { _id: string; title: string; pointCost: number; difficulty: string; instructor: { name: string }; thumbnail?: string; }

interface Props { points: number; transactions: Transaction[]; courses: Course[]; }

const ACTION_ICONS: Record<string, string> = {
  module_complete:    "📚",
  quiz_pass:          "✅",
  checkpoint_correct: "⚡",
  course_complete:    "🏆",
  redeem:             "🎁",
};

export default function RewardsClient({ points, transactions, courses }: Props) {
  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-fade-in">
      <h1 className="text-2xl font-bold text-slate-900 text-white">Rewards</h1>

      {/* Points hero */}
      <div className="card p-6 flex items-center gap-6 bg-gradient-to-r from-amber-50 to-yellow-50 textfrom-amber-900/20 textto-yellow-900/10 border-amber-100 textborder-amber-800">
        <div className="w-16 h-16 bg-amber-100 textbg-amber-800 rounded-full flex items-center justify-center">
          <Coins size={32} className="text-amber-600 text-amber-300" />
        </div>
        <div>
          <p className="text-sm text-amber-700 text-amber-400 font-medium">Total points</p>
          <p className="text-4xl font-bold text-amber-800 text-amber-200">{formatPoints(points)}</p>
          <p className="text-xs text-amber-600 text-amber-400 mt-1">Keep completing modules to earn more</p>
        </div>
      </div>

      {/* How to earn */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          { icon: "📚", label: "Complete module",  pts: "+25" },
          { icon: "✅", label: "Pass quiz",         pts: "+25" },
          { icon: "⚡", label: "Checkpoint correct",pts: "+15" },
          { icon: "🏆", label: "Complete course",   pts: "+100"},
        ].map(({ icon, label, pts }) => (
          <div key={label} className="card p-3 text-center">
            <div className="text-2xl mb-1">{icon}</div>
            <div className="text-xs text-slate-500 text-slate-400">{label}</div>
            <div className="text-sm font-bold text-reward-600 text-reward-400">{pts} pts</div>
          </div>
        ))}
      </div>

      {/* Redeemable courses */}
      {courses.length > 0 && (
        <div>
          <h2 className="text-lg font-semibold text-slate-900 text-white mb-3">
            Redeem courses with points
          </h2>
          <div className="grid gap-3 sm:grid-cols-2">
            {courses.map((c) => {
              const canAfford = points >= c.pointCost;
              return (
                <div key={c._id} className="card p-4 flex gap-3 items-center">
                  <div className="w-12 h-12 bg-brand-50 textbg-brand-900/30 rounded-input flex items-center justify-center flex-shrink-0 overflow-hidden">
                    {c.thumbnail
                      ? <img src={c.thumbnail} alt="" className="w-full h-full object-cover" />
                      : <BookOpen size={20} className="text-brand-400" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm text-slate-900 text-white line-clamp-1">{c.title}</p>
                    <p className="text-xs text-slate-500">{c.instructor.name}</p>
                  </div>
                  <div className="flex flex-col items-end gap-1">
                    <span className="points-chip text-xs">{c.pointCost} pts</span>
                    {!canAfford && (
                      <span className="text-xs text-slate-400">
                        Need {c.pointCost - points} more
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Transaction history */}
      <div>
        <h2 className="text-lg font-semibold text-slate-900 text-white mb-3">Points history</h2>
        {transactions.length === 0 ? (
          <div className="card p-8 text-center text-slate-400 text-sm">
            No transactions yet. Complete a module to earn your first points!
          </div>
        ) : (
          <div className="card divide-y divide-slate-100 textdivide-slate-700">
            {transactions.map((t) => (
              <div key={t._id} className="flex items-center gap-3 px-4 py-3">
                <span className="text-lg">{ACTION_ICONS[t.action] ?? "⭐"}</span>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-slate-900 text-white line-clamp-1">{t.description}</p>
                  <p className="text-xs text-slate-400">
                    {format(new Date(t.createdAt), "MMM d, yyyy · h:mm a")}
                  </p>
                </div>
                <span className={`font-semibold text-sm ${t.points >= 0 ? "text-reward-600 text-reward-400" : "text-red-500"}`}>
                  {t.points >= 0 ? "+" : ""}{t.points}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>

    </div>
  );
}

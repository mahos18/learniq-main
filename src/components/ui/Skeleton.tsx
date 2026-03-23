export function SkeletonCard() {
  return (
    <div className="card overflow-hidden animate-pulse">
      <div className="h-36 bg-slate-100 textbg-slate-700" />
      <div className="p-4 flex flex-col gap-3">
        <div className="h-4 bg-slate-100 textbg-slate-700 rounded w-3/4" />
        <div className="h-3 bg-slate-100 textbg-slate-700 rounded w-full" />
        <div className="h-3 bg-slate-100 textbg-slate-700 rounded w-2/3" />
        <div className="flex gap-2">
          <div className="h-5 w-16 bg-slate-100 textbg-slate-700 rounded-pill" />
          <div className="h-5 w-16 bg-slate-100 textbg-slate-700 rounded-pill" />
        </div>
        <div className="h-9 bg-slate-100 textbg-slate-700 rounded-input mt-1" />
      </div>
    </div>
  );
}

export function SkeletonRow() {
  return (
    <div className="flex items-center gap-3 p-4 border-b border-slate-100 textborder-slate-700 animate-pulse">
      <div className="w-10 h-10 rounded-full bg-slate-100 textbg-slate-700 flex-shrink-0" />
      <div className="flex-1 flex flex-col gap-2">
        <div className="h-3.5 bg-slate-100 textbg-slate-700 rounded w-1/3" />
        <div className="h-3 bg-slate-100 textbg-slate-700 rounded w-1/2" />
      </div>
    </div>
  );
}

export function SkeletonText({ lines = 3 }: { lines?: number }) {
  return (
    <div className="flex flex-col gap-2 animate-pulse">
      {Array.from({ length: lines }).map((_, i) => (
        <div
          key={i}
          className="h-3.5 bg-slate-100 textbg-slate-700 rounded"
          style={{ width: `${100 - i * 12}%` }}
        />
      ))}
    </div>
  );
}

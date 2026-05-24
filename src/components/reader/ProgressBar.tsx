"use client";

interface ProgressBarProps {
  current: number;
  total: number;
}

export function ProgressBar({ current, total }: ProgressBarProps) {
  const pct = total > 0 ? (current / total) * 100 : 0;
  return (
    <div className="fixed top-0 left-0 right-0 h-0.5 z-10 bg-white/10">
      <div
        className="h-full bg-white/40 transition-all duration-300"
        style={{ width: `${pct}%` }}
      />
    </div>
  );
}

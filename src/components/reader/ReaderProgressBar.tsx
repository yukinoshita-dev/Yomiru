"use client";

import type { ThemePalette } from "@/lib/reader/themePalette";

interface ReaderProgressBarProps {
  current: number;
  total: number;
  palette: ThemePalette;
}

export function ReaderProgressBar({ current, total, palette }: ReaderProgressBarProps) {
  const pct = total > 0 ? ((current + 1) / total) * 100 : 0;
  return (
    <div
      role="progressbar"
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={Math.round(pct)}
      aria-label="読書進捗"
      className={`relative z-30 mx-8 h-px ${palette.classes.border} bg-current/5`}
    >
      <div
        className={`h-full ${palette.classes.accentBg} transition-[width] duration-500 ease-out`}
        style={{ width: `${pct}%`, boxShadow: "0 0 8px currentColor" }}
      />
    </div>
  );
}

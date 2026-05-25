"use client";

import type { ReadingMetrics } from "@/lib/reader/eta";
import type { ThemePalette } from "@/lib/reader/themePalette";

type ReaderSideRailsProps =
  | {
      side: "left";
      chapterKanji: string;
      index: number;
      total: number;
      palette: ThemePalette;
    }
  | {
      side: "right";
      metrics: ReadingMetrics;
      palette: ThemePalette;
    };

export function ReaderSideRails(props: ReaderSideRailsProps) {
  if (props.side === "left") {
    const current = String(props.index + 1).padStart(2, "0");
    const total = String(props.total).padStart(2, "0");

    return (
      <aside className={`absolute left-6 top-1/2 z-10 hidden -translate-y-1/2 flex-col items-center gap-3 md:flex ${props.palette.classes.fgMid}`}>
        <div className={`font-mincho text-[10px] tracking-[0.3em] ${props.palette.classes.fgFaint}`}>章</div>
        <div className={`font-mincho text-[56px] leading-none ${props.palette.classes.accent}`}>
          {props.chapterKanji}
        </div>
        <div className={`h-px w-7 border-t ${props.palette.classes.border}`} />
        <div className="flex flex-col items-center gap-0.5">
          <span className={`font-roman text-[28px] leading-none ${props.palette.classes.fgStrong}`}>
            {current}
          </span>
          <span className={`font-roman text-sm ${props.palette.classes.fgFaint}`}>/</span>
          <span className={`font-roman text-sm ${props.palette.classes.fgMid}`}>{total}</span>
        </div>
        <div className={`font-mincho text-[10px] tracking-[0.3em] ${props.palette.classes.fgFaint}`}>文節</div>
      </aside>
    );
  }

  return (
    <aside className={`absolute right-6 top-1/2 z-10 hidden -translate-y-1/2 flex-col items-center gap-3 md:flex ${props.palette.classes.fgMid}`}>
      <div className={`font-roman text-[11px] tracking-[0.4em] ${props.palette.classes.fgFaint}`}>READ</div>
      <div className={`relative h-40 w-0.5 bg-current/10 ${props.palette.classes.fgFaint}`}>
        <div
          className={`w-full ${props.palette.classes.accentBg} transition-[height] duration-500 ease-out`}
          style={{ height: `${props.metrics.progress}%`, boxShadow: "0 0 6px currentColor" }}
        />
      </div>
      <div className="flex items-baseline font-roman">
        <span className={`text-[22px] leading-none ${props.palette.classes.fgStrong}`}>
          {Math.round(props.metrics.progress)}
        </span>
        <span className={`ml-0.5 text-[11px] tracking-[0.1em] ${props.palette.classes.fgFaint}`}>%</span>
      </div>
      <div className={`h-px w-7 border-t ${props.palette.classes.border}`} />
      <div className={`font-roman text-lg leading-none ${props.palette.classes.fgStrong}`}>
        {props.metrics.remainingLabel}
      </div>
      <div className={`font-mincho text-[10px] tracking-[0.3em] ${props.palette.classes.fgFaint}`}>残り</div>
    </aside>
  );
}

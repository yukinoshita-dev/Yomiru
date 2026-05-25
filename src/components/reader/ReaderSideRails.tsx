"use client";

import type { ThemePalette } from "@/lib/reader/themePalette";

interface ReaderSideRailsProps {
  side: "left";
  chapterKanji: string;
  index: number;
  total: number;
  palette: ThemePalette;
}

export function ReaderSideRails(props: ReaderSideRailsProps) {
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

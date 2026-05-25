"use client";

import { useState } from "react";

import type { ThemePalette } from "@/lib/reader/themePalette";

interface ReaderHelpProps {
  palette: ThemePalette;
}

interface ShortcutRow {
  keys: string;
  desc: string;
}

const SHORTCUTS: ShortcutRow[] = [
  { keys: "Space", desc: "再生 / 停止" },
  { keys: "← →", desc: "前の文節 / 次の文節" },
  { keys: "↑ ↓", desc: "速度 速く / 遅く" },
  { keys: "S", desc: "睡眠モード切替" },
  { keys: "F", desc: "全画面切替" },
  { keys: "Esc", desc: "ライブラリへ戻る" },
  { keys: "タップ", desc: "左:前 / 中央:再生停止 / 右:次" },
  { keys: "上下スワイプ", desc: "速度調整" },
  { keys: "長押し", desc: "設定を開く" },
];

export function ReaderHelp({ palette }: ReaderHelpProps) {
  const [open, setOpen] = useState(false);
  const surface = palette.bg === "#f4ecd8" ? "bg-washi/75" : "bg-black/40";

  return (
    <div className="pointer-events-none fixed bottom-4 right-4 z-30 flex flex-col items-end gap-2">
      {open && (
        <div
          role="dialog"
          aria-label="操作ヘルプ"
          className={`pointer-events-auto max-w-[280px] rounded-md border px-3.5 py-3 text-[11px] leading-relaxed shadow-lg backdrop-blur-md ${palette.classes.border} ${surface}`}
        >
          <div className={`mb-2 font-mincho text-[10px] tracking-[0.24em] ${palette.classes.fgFaint}`}>
            操作ヘルプ
          </div>
          <ul className="flex flex-col gap-1.5">
            {SHORTCUTS.map((row) => (
              <li key={row.keys} className="flex items-center gap-3">
                <span
                  className={`shrink-0 rounded border px-1.5 py-0.5 font-roman text-[10px] tracking-[0.06em] ${palette.classes.border} ${palette.classes.fgMid}`}
                >
                  {row.keys}
                </span>
                <span className={`font-mincho text-[11px] ${palette.classes.fgMid}`}>{row.desc}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      <button
        type="button"
        aria-label={open ? "操作ヘルプを閉じる" : "操作ヘルプを開く"}
        aria-expanded={open}
        onClick={() => setOpen((value) => !value)}
        className={`pointer-events-auto grid h-8 w-8 place-items-center rounded-full border font-roman text-[14px] backdrop-blur-md transition-colors hover:bg-current/[0.08] ${palette.classes.border} ${palette.classes.fgMid} ${surface}`}
      >
        {open ? "✕" : "?"}
      </button>
    </div>
  );
}

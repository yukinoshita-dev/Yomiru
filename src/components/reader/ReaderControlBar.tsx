"use client";

import type { ReactNode } from "react";

import type { ThemePalette } from "@/lib/reader/themePalette";

interface ReaderControlBarProps {
  palette: ThemePalette;
  playing: boolean;
  onToggle: () => void;
  onNext: () => void;
  onPrev: () => void;
  wpm: number;
  sleepRemainingLabel: string | null;
  sleepActive: boolean;
  onOpenSettings: () => void;
}

export function ReaderControlBar({
  palette,
  playing,
  onToggle,
  onNext,
  onPrev,
  wpm,
  sleepRemainingLabel,
  sleepActive,
  onOpenSettings,
}: ReaderControlBarProps) {
  const isLight = palette.bg === "#f4ecd8";
  const surface = isLight
    ? "border-sumi/12 bg-white/50"
    : palette.bg === "#08080a"
      ? "border-fog/[0.06] bg-white/[0.015]"
      : "border-glow/12 bg-black/40 backdrop-blur-md";
  const activeText = isLight ? "text-washi" : palette.bg === "#08080a" ? "text-coal" : "text-ink";

  return (
    <footer className={`relative z-30 mx-5 mb-5 flex flex-wrap items-center gap-4 rounded-sm border px-4 py-3 sm:mx-8 sm:mb-6 sm:gap-5 sm:px-5 ${surface}`}>
      <div className="flex items-center gap-1.5">
        <CtrlGhost label="戻る" palette={palette} onClick={onPrev}>
          ‹
        </CtrlGhost>
        <button
          type="button"
          aria-label="再生 / 停止"
          onClick={onToggle}
          className={`h-9 w-11 rounded-sm ${palette.classes.accentBg} text-sm ${activeText} shadow-[0_0_18px_rgba(232,169,106,0.22)]`}
        >
          {playing ? "■" : "▶"}
        </button>
        <CtrlGhost label="進む" palette={palette} onClick={onNext}>
          ›
        </CtrlGhost>
      </div>

      <Divider palette={palette} />

      <div className="flex items-center gap-3.5">
        <CtrlLabel palette={palette}>速度</CtrlLabel>
        <div className="flex items-center gap-3 rounded-sm bg-current/[0.04] px-3.5 py-1.5">
          {[0, 1, 2, 3, 4].map((i) => (
            <span
              key={i}
              className={
                i === 2
                  ? `h-2 w-2 rounded-full border ${palette.classes.border} ${palette.classes.accentBg}`
                  : `h-2 w-2 rounded-full border ${palette.classes.border}`
              }
            />
          ))}
        </div>
        <span className={`font-roman text-base ${palette.classes.fgStrong}`}>
          {wpm} <span className={`font-mincho text-[9px] tracking-[0.1em] ${palette.classes.fgFaint}`}>文節/分</span>
        </span>
      </div>

      <Divider palette={palette} />

      <div className="flex min-w-[180px] flex-1 items-center gap-3">
        {sleepActive ? (
          <>
            <span className={`text-[22px] ${palette.classes.accent}`}>☾</span>
            <div className="flex flex-col gap-0.5">
              <div className={`font-mincho text-[11px] tracking-[0.24em] ${palette.classes.fgFaint}`}>
                睡眠モード
              </div>
              <div className={`font-mincho text-sm tracking-[0.06em] ${palette.classes.fgStrong}`}>
                残り {sleepRemainingLabel ?? "0:00"}{" "}
                <span className={`text-[11px] ${palette.classes.fgFaint}`}>· 徐々に減速</span>
              </div>
            </div>
          </>
        ) : (
          <div className={`font-mincho text-[11px] tracking-[0.24em] ${palette.classes.fgFaint}`}>
            睡眠モード OFF
          </div>
        )}
      </div>

      <Divider palette={palette} />

      <button
        type="button"
        aria-label="設定"
        onClick={onOpenSettings}
        className={`grid h-9 w-9 place-items-center rounded-sm border font-roman text-lg ${palette.classes.border} ${palette.classes.fgMid} transition-colors hover:bg-current/[0.04]`}
      >
        ⚙
      </button>
    </footer>
  );
}

function CtrlGhost({
  children,
  label,
  palette,
  onClick,
}: {
  children: ReactNode;
  label: string;
  palette: ThemePalette;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      aria-label={label}
      onClick={onClick}
      className={`grid h-9 w-9 place-items-center rounded-sm border font-roman text-2xl ${palette.classes.border} ${palette.classes.fgMid} transition-colors hover:bg-current/[0.04]`}
    >
      {children}
    </button>
  );
}

function CtrlLabel({ children, palette }: { children: ReactNode; palette: ThemePalette }) {
  return <span className={`font-mincho text-[11px] tracking-[0.3em] ${palette.classes.fgFaint}`}>{children}</span>;
}

function Divider({ palette }: { palette: ThemePalette }) {
  return <div className={`hidden h-8 w-px border-l sm:block ${palette.classes.border}`} />;
}

"use client";

import type { ReactNode } from "react";

import { RakkanStamp } from "@/components/reader/shared/RakkanStamp";
import type { ThemePalette } from "@/lib/reader/themePalette";
import type { Book } from "@/types";

interface ReaderHeaderProps {
  book: Book | undefined;
  chapterKanji: string;
  palette: ThemePalette;
  onClose: () => void;
  onOpenSettings: () => void;
  onBookmark: () => void;
  bookmarked: boolean;
}

export function ReaderHeader({
  book,
  chapterKanji,
  palette,
  onClose,
  onOpenSettings,
  onBookmark,
  bookmarked,
}: ReaderHeaderProps) {
  const isLight = palette.bg === "#f4ecd8";

  return (
    <header className="relative z-30 flex items-center justify-between px-8 pb-4 pt-6">
      <div className="flex min-w-0 items-center gap-4">
        <IconBtn label="戻る" palette={palette} onClick={onClose}>
          ‹
        </IconBtn>
        {isLight && <RakkanStamp size={36} color={palette.accent} label="讀" />}
        <div className="flex min-w-0 flex-col gap-0.5">
          <div className={`truncate font-mincho text-base tracking-[0.16em] ${palette.classes.fgStrong}`}>
            {book?.title ?? "..."}
          </div>
          <div className={`truncate font-mincho text-[11px] tracking-[0.22em] ${palette.classes.fgFaint}`}>
            {book?.author ?? ""} · {chapterKanji} 章
          </div>
        </div>
      </div>
      <div className="flex items-center gap-1">
        <IconBtn
          label={bookmarked ? "しおりを外す" : "しおりを付ける"}
          palette={palette}
          onClick={onBookmark}
        >
          {bookmarked ? "★" : "☆"}
        </IconBtn>
        <IconBtn label="設定" palette={palette} onClick={onOpenSettings}>
          ⚙
        </IconBtn>
        <IconBtn label="閉じる" palette={palette} onClick={onClose}>
          ✕
        </IconBtn>
      </div>
    </header>
  );
}

function IconBtn({
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
  const hover = palette.bg === "#f4ecd8" ? "hover:bg-sumi/[0.04]" : "hover:bg-white/5";

  return (
    <button
      type="button"
      aria-label={label}
      onClick={onClick}
      className={`grid h-9 w-9 place-items-center rounded font-roman text-xl ${palette.classes.fgFaint} ${hover} transition-colors`}
    >
      {children}
    </button>
  );
}

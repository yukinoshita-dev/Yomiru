export interface ReadingMetrics {
  progress: number;
  remainingMs: number;
  remainingLabel: string;
  wpm: number;
}

export function computeReadingMetrics({
  index,
  totalChunks,
  displayDurationSec,
}: {
  index: number;
  totalChunks: number;
  displayDurationSec: number;
}): ReadingMetrics {
  const safeTotal = Math.max(totalChunks, 1);
  const progress = ((index + 1) / safeTotal) * 100;
  const remainingChunks = Math.max(totalChunks - index - 1, 0);
  const remainingMs = Math.round(remainingChunks * displayDurationSec * 1000);
  const remainingLabel = formatMs(remainingMs);
  const wpm = Math.round(60 / Math.max(displayDurationSec, 0.1));
  return { progress, remainingMs, remainingLabel, wpm };
}

export function formatMs(ms: number): string {
  const totalSec = Math.max(Math.floor(ms / 1000), 0);
  const mm = Math.floor(totalSec / 60);
  const ss = totalSec % 60;
  return `${mm}:${String(ss).padStart(2, "0")}`;
}

export function toChapterKanji(n: number | undefined): string {
  if (!n || n <= 0) return "一";
  const KANJI = ["零", "一", "二", "三", "四", "五", "六", "七", "八", "九", "十"];
  return KANJI[n] ?? String(n);
}

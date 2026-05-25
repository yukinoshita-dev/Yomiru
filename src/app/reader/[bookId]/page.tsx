"use client";

export const dynamic = "force-dynamic";

import { useCallback, useEffect, useRef, useState } from "react";
import { useRouter, useParams, useSearchParams } from "next/navigation";
import { Toaster } from "sonner";
import { GestureLayer } from "@/components/reader/GestureLayer";
import { ReaderControlBar } from "@/components/reader/ReaderControlBar";
import { ReaderHeader } from "@/components/reader/ReaderHeader";
import { ReaderProgressBar } from "@/components/reader/ReaderProgressBar";
import { ReaderSideRails } from "@/components/reader/ReaderSideRails";
import { ReaderStage } from "@/components/reader/ReaderStage";
import { PaperGrain } from "@/components/reader/shared/PaperGrain";
import { SettingsDrawer } from "@/components/reader/SettingsDrawer";
import { addBookmark, isBookmarked, removeBookmark } from "@/lib/db/repositories/bookmarks";
import { getBookById } from "@/lib/db/repositories/books";
import { getChunkAt, getChunksByBook } from "@/lib/db/repositories/chunks";
import { getReadingState, upsertReadingState } from "@/lib/db/repositories/readingState";
import { computeReadingMetrics, formatMs, toChapterKanji } from "@/lib/reader/eta";
import { computeSleepRamp } from "@/lib/reader/sleepRamp";
import { THEME_PALETTES } from "@/lib/reader/themePalette";
import { useReaderStore } from "@/stores/readerStore";
import { useSettingsStore } from "@/features/settings/store";
import { useHydrateSettings } from "@/features/settings/useSettings";
import { useReaderEngine } from "@/features/reader/useReaderEngine";
import type { AppSettings, Book, Chunk } from "@/types";

const CACHE_RADIUS = 3;

interface VisibleChunks {
  current?: Chunk;
  prevPrev?: Chunk;
  prev?: Chunk;
  next?: Chunk;
  nextNext?: Chunk;
}

export default function ReaderPage() {
  const params = useParams();
  const bookId = params.bookId as string;
  const router = useRouter();
  const searchParams = useSearchParams();
  const atFromUrl = searchParams.get("at");

  useHydrateSettings();
  const {
    index,
    totalChunks,
    status,
    speed,
    sleepStartAt,
    load,
    toggle,
    next,
    prev,
    setSpeed,
    startSleep,
    endSleep,
  } = useReaderStore();
  const settingsStore = useSettingsStore();
  const settings = settingsStore.settings;
  useReaderEngine();

  const [book, setBook] = useState<Book | undefined>();
  const [visibleChunks, setVisibleChunks] = useState<VisibleChunks>({});
  const [showSettings, setShowSettings] = useState(false);
  const [bookmarked, setBookmarked] = useState(false);
  const [now, setNow] = useState(() => Date.now());
  const cacheRef = useRef<Map<number, Chunk>>(new Map());

  const setVisibleFromCache = useCallback((currentIndex: number) => {
    const cache = cacheRef.current;
    setVisibleChunks({
      current: cache.get(currentIndex),
      prevPrev: cache.get(currentIndex - 2),
      prev: cache.get(currentIndex - 1),
      next: cache.get(currentIndex + 1),
      nextNext: cache.get(currentIndex + 2),
    });
  }, []);

  useEffect(() => {
    if (!bookId) return;
    let cancelled = false;

    (async () => {
      const [loadedBook, state, chunks] = await Promise.all([
        getBookById(bookId),
        getReadingState(bookId),
        getChunksByBook(bookId),
      ]);
      if (cancelled) return;

      const startIndex = atFromUrl != null
        ? Math.max(0, Number(atFromUrl) || 0)
        : (state?.currentIndex ?? 0);
      load(bookId, startIndex, chunks.length);
      setBook(loadedBook);

      const cache = cacheRef.current;
      cache.clear();
      for (const c of chunks) {
        cache.set(c.index, c);
      }
      setVisibleFromCache(startIndex);
    })();

    return () => {
      cancelled = true;
    };
  }, [atFromUrl, bookId, load, setVisibleFromCache]);

  useEffect(() => {
    if (!bookId || index < 0) return;
    let cancelled = false;

    const ensureVisibleChunks = async () => {
      const offsets = [-2, -1, 0, 1, 2];
      await Promise.all(
        offsets.map(async (offset) => {
          const targetIndex = index + offset;
          if (targetIndex < 0 || targetIndex >= totalChunks || cacheRef.current.has(targetIndex)) {
            return;
          }
          const loadedChunk = await getChunkAt(bookId, targetIndex);
          if (loadedChunk) {
            cacheRef.current.set(loadedChunk.index, loadedChunk);
          }
        }),
      );

      for (let i = index + 3; i <= index + CACHE_RADIUS; i++) {
        if (i >= totalChunks || cacheRef.current.has(i)) continue;
        void getChunkAt(bookId, i).then((loadedChunk) => {
          if (loadedChunk) cacheRef.current.set(loadedChunk.index, loadedChunk);
        });
      }

      if (!cancelled) {
        setVisibleFromCache(index);
      }
    };

    void ensureVisibleChunks();

    return () => {
      cancelled = true;
    };
  }, [bookId, index, totalChunks, setVisibleFromCache]);

  useEffect(() => {
    setSpeed(settings.displayDuration);
  }, [settings.displayDuration, setSpeed]);

  const sleepActive = settings.sleepMode && sleepStartAt !== null;

  useEffect(() => {
    if (!sleepActive) return;
    setNow(Date.now());
    const timer = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(timer);
  }, [sleepActive]);

  const updateDisplayDuration = useCallback(
    (duration: number) => {
      const nextDuration = Math.min(10, Math.max(0.5, duration));
      setSpeed(nextDuration);
      settingsStore.update({ displayDuration: nextDuration });
    },
    [setSpeed, settingsStore],
  );

  const updateSettings = useCallback(
    (patch: Partial<AppSettings>) => {
      settingsStore.update(patch);
      if (typeof patch.displayDuration === "number") {
        setSpeed(patch.displayDuration);
      }
      if (typeof patch.sleepMode === "boolean") {
        if (patch.sleepMode) startSleep();
        else endSleep();
      }
    },
    [endSleep, setSpeed, settingsStore, startSleep],
  );

  const closeReader = useCallback(() => {
    void upsertReadingState({ bookId, currentIndex: index, lastReadAt: Date.now() }).finally(() => {
      router.push("/library");
    });
  }, [bookId, index, router]);

  const chunk = visibleChunks.current;

  useEffect(() => {
    if (!bookId || index < 0) return;
    let cancelled = false;

    void isBookmarked(bookId, index).then((nextBookmarked) => {
      if (!cancelled) setBookmarked(nextBookmarked);
    });

    return () => {
      cancelled = true;
    };
  }, [bookId, index]);

  const handleBookmark = useCallback(async () => {
    if (!bookId || !chunk) return;
    if (bookmarked) {
      await removeBookmark(bookId, index);
      setBookmarked(false);
    } else {
      await addBookmark(bookId, index, chunk.text);
      setBookmarked(true);
    }
  }, [bookId, bookmarked, chunk, index]);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      switch (e.key) {
        case " ":
          e.preventDefault();
          toggle();
          break;
        case "ArrowRight":
          next();
          break;
        case "ArrowLeft":
          prev();
          break;
        case "ArrowUp":
          updateDisplayDuration(speed - 0.5);
          break;
        case "ArrowDown":
          updateDisplayDuration(speed + 0.5);
          break;
        case "s": case "S":
          updateSettings({ sleepMode: !settings.sleepMode });
          break;
        case "f": case "F":
          if (!document.fullscreenElement) document.documentElement.requestFullscreen();
          else document.exitFullscreen();
          break;
        case "Escape":
          if (showSettings) setShowSettings(false);
          else closeReader();
          break;
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [closeReader, next, prev, settings.sleepMode, showSettings, speed, toggle, updateDisplayDuration, updateSettings]);

  const palette = THEME_PALETTES[settings.theme];
  const metrics = computeReadingMetrics({
    index,
    totalChunks,
    displayDurationSec: speed,
  });
  const chapterKanji = toChapterKanji(visibleChunks.current?.chapterIndex);
  const sleepRemainingLabel = sleepActive
    ? formatMs(settings.sleepRampMinutes * 60_000 - (now - sleepStartAt))
    : null;
  let brightness = 1;
  if (sleepActive) {
    const ramp = computeSleepRamp({
      elapsedMs: now - sleepStartAt,
      rampMinutes: settings.sleepRampMinutes,
      baseDurationSec: speed,
    });
    brightness = ramp.brightness;
  }

  return (
    <div className={`${palette.classes.root} relative flex min-h-screen flex-col overflow-hidden font-jp`}>
      <Toaster position="top-center" theme={settings.theme === "light" ? "light" : "dark"} />
      {settings.theme === "lamp" && <LampGlow />}
      {settings.theme === "dark" && <DarkVignette />}
      {settings.theme === "light" && <PaperGrain opacity={0.5} />}

      <ReaderHeader
        book={book}
        chapterKanji={chapterKanji}
        palette={palette}
        onClose={closeReader}
        onOpenSettings={() => setShowSettings(true)}
        onBookmark={handleBookmark}
        bookmarked={bookmarked}
      />
      <ReaderProgressBar current={index} total={totalChunks} palette={palette} />

      <main className="relative flex flex-1 items-center justify-center px-0 py-5">
        {settings.theme === "dark" && <DarkCrosshair />}
        <ReaderSideRails
          side="left"
          chapterKanji={chapterKanji}
          index={index}
          total={totalChunks}
          palette={palette}
        />
        <ReaderStage
          chunk={visibleChunks.current}
          prevPrev={visibleChunks.prevPrev}
          prev={visibleChunks.prev}
          next={visibleChunks.next}
          nextNext={visibleChunks.nextNext}
          fadeMs={settings.fadeMs}
          fontSize={settings.fontSize}
          palette={palette}
        />
        <ReaderSideRails side="right" metrics={metrics} palette={palette} />
      </main>

      <ReaderControlBar
        palette={palette}
        playing={status === "playing"}
        onToggle={toggle}
        onNext={next}
        onPrev={prev}
        wpm={metrics.wpm}
        sleepRemainingLabel={sleepRemainingLabel}
        sleepActive={sleepActive}
        onOpenSettings={() => setShowSettings(true)}
      />

      {sleepActive && (
        <div
          className="pointer-events-none fixed inset-0 z-10 bg-black"
          style={{ opacity: 1 - brightness }}
        />
      )}

      {!showSettings && (
        <GestureLayer
          onToggle={toggle}
          onNext={next}
          onPrev={prev}
          onSpeedUp={() => updateDisplayDuration(speed - 0.5)}
          onSpeedDown={() => updateDisplayDuration(speed + 0.5)}
          onOpenSettings={() => setShowSettings(true)}
        />
      )}

      {showSettings && (
        <SettingsDrawer
          settings={settings}
          onUpdate={updateSettings}
          onClose={() => setShowSettings(false)}
        />
      )}
    </div>
  );
}

function LampGlow() {
  return (
    <>
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_700px_700px_at_50%_50%,rgba(232,169,106,0.22),rgba(232,169,106,0.06)_40%,transparent_70%)]"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_240px_at_50%_50%,rgba(255,210,150,0.10),transparent_70%)]"
      />
    </>
  );
}

function DarkVignette() {
  return (
    <div
      aria-hidden
      className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_80%_70%_at_50%_50%,transparent_0%,transparent_50%,rgba(0,0,0,0.45)_100%)]"
    />
  );
}

function DarkCrosshair() {
  return (
    <>
      <div aria-hidden className="pointer-events-none absolute inset-y-0 left-1/2 w-px bg-fog/[0.04]" />
      <div aria-hidden className="pointer-events-none absolute inset-x-0 top-1/2 h-px bg-fog/[0.04]" />
    </>
  );
}

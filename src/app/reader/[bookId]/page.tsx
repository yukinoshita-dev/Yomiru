"use client";

export const dynamic = 'force-dynamic';

import { useEffect, useRef, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { Toaster } from "sonner";
import { ChunkStage } from "@/components/reader/ChunkStage";
import { ProgressBar } from "@/components/reader/ProgressBar";
import { ReaderControls } from "@/components/reader/ReaderControls";
import { SettingsDrawer } from "@/components/reader/SettingsDrawer";
import { getChunkAt, getChunksByBook } from "@/lib/db/repositories/chunks";
import { getReadingState, upsertReadingState } from "@/lib/db/repositories/readingState";
import { computeSleepRamp } from "@/lib/reader/sleepRamp";
import { useReaderStore } from "@/stores/readerStore";
import { useSettingsStore } from "@/features/settings/store";
import { useHydrateSettings } from "@/features/settings/useSettings";
import { useReaderEngine } from "@/features/reader/useReaderEngine";
import type { Chunk } from "@/types";

const CACHE_RADIUS = 3;

export default function ReaderPage() {
  const params = useParams();
  const bookId = params.bookId as string;
  const router = useRouter();

  useHydrateSettings();
  const store = useReaderStore();
  const settingsStore = useSettingsStore();
  const settings = settingsStore.settings;
  useReaderEngine();

  const [chunk, setChunk] = useState<Chunk | undefined>();
  const [showSettings, setShowSettings] = useState(false);
  const cacheRef = useRef<Map<number, Chunk>>(new Map());

  // Load book on mount
  useEffect(() => {
    if (!bookId) return;
    (async () => {
      const [state, chunks] = await Promise.all([
        getReadingState(bookId),
        getChunksByBook(bookId),
      ]);
      const startIndex = state?.currentIndex ?? 0;
      store.load(bookId, startIndex, chunks.length);

      // Pre-warm cache
      const cache = cacheRef.current;
      cache.clear();
      for (const c of chunks.slice(0, CACHE_RADIUS * 2 + 1)) {
        cache.set(c.index, c);
      }
    })();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [bookId]);

  // Fetch current chunk (with cache)
  useEffect(() => {
    if (!bookId || store.index < 0) return;
    const cached = cacheRef.current.get(store.index);
    if (cached) {
      setChunk(cached);
    } else {
      getChunkAt(bookId, store.index).then((c) => {
        if (c) {
          cacheRef.current.set(store.index, c);
          setChunk(c);
        }
      });
    }

    // Pre-fetch neighbours
    for (let i = store.index + 1; i <= store.index + CACHE_RADIUS; i++) {
      if (!cacheRef.current.has(i)) {
        getChunkAt(bookId, i).then((c) => { if (c) cacheRef.current.set(c.index, c); });
      }
    }
  }, [bookId, store.index]);

  // Keyboard controls
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      switch (e.key) {
        case " ": e.preventDefault(); store.toggle(); break;
        case "ArrowRight": store.next(); break;
        case "ArrowLeft": store.prev(); break;
        case "ArrowUp": store.setSpeed(Math.max(0.5, store.speed - 0.5)); break;
        case "ArrowDown": store.setSpeed(Math.min(10, store.speed + 0.5)); break;
        case "s": case "S":
          if (settings.sleepMode && store.sleepStartAt === null) store.startSleep();
          else store.endSleep();
          settingsStore.update({ sleepMode: !settings.sleepMode });
          break;
        case "f": case "F":
          if (!document.fullscreenElement) document.documentElement.requestFullscreen();
          else document.exitFullscreen();
          break;
        case "Escape":
          if (showSettings) setShowSettings(false);
          else { void upsertReadingState({ bookId, currentIndex: store.index, lastReadAt: Date.now() }); router.push("/library"); }
          break;
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [store, settings, settingsStore, showSettings, bookId, router]);

  // Sleep overlay brightness
  let brightness = 1;
  if (settings.sleepMode && store.sleepStartAt !== null) {
    const ramp = computeSleepRamp({
      elapsedMs: Date.now() - store.sleepStartAt,
      rampMinutes: settings.sleepRampMinutes,
      baseDurationSec: settings.displayDuration,
    });
    brightness = ramp.brightness;
  }

  return (
    <>
      <Toaster position="top-center" theme="dark" />
      <ChunkStage
        chunk={chunk}
        fadeMs={settings.fadeMs}
        fontSize={settings.fontSize}
        theme={settings.theme}
      />
      <ProgressBar current={store.index} total={store.totalChunks} />

      {/* Sleep darkness overlay */}
      {settings.sleepMode && store.sleepStartAt !== null && (
        <div
          className="fixed inset-0 bg-black pointer-events-none z-10"
          style={{ opacity: 1 - brightness }}
        />
      )}

      {!showSettings && (
        <ReaderControls
          onToggle={() => store.toggle()}
          onNext={() => store.next()}
          onPrev={() => store.prev()}
          onSpeedUp={() => store.setSpeed(Math.max(0.5, store.speed - 0.5))}
          onSpeedDown={() => store.setSpeed(Math.min(10, store.speed + 0.5))}
          onOpenSettings={() => setShowSettings(true)}
        />
      )}

      {showSettings && (
        <SettingsDrawer
          settings={settings}
          onUpdate={(patch) => settingsStore.update(patch)}
          onClose={() => setShowSettings(false)}
        />
      )}
    </>
  );
}

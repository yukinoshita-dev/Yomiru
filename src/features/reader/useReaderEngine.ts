"use client";

import { useEffect, useRef } from "react";
import { upsertReadingState } from "@/lib/db/repositories/readingState";
import { computeSleepRamp } from "@/lib/reader/sleepRamp";
import { useReaderStore } from "@/stores/readerStore";
import { useSettingsStore } from "@/features/settings/store";

const PERSIST_INTERVAL_MS = 5_000;

export function useReaderEngine() {
  const store = useReaderStore();
  const settings = useSettingsStore((s) => s.settings);

  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const persistRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const { bookId, index, totalChunks, status, speed, sleepStartAt } = store;

  // Persist progress every 5s while playing
  useEffect(() => {
    if (persistRef.current) clearInterval(persistRef.current);
    if (status === "playing" && bookId) {
      persistRef.current = setInterval(() => {
        upsertReadingState({ bookId, currentIndex: index, lastReadAt: Date.now() });
      }, PERSIST_INTERVAL_MS);
    }
    return () => {
      if (persistRef.current) clearInterval(persistRef.current);
    };
  }, [status, bookId, index]);

  // Auto-advance timer
  useEffect(() => {
    if (timerRef.current) clearTimeout(timerRef.current);

    if (status !== "playing" || index >= totalChunks - 1) return;

    let durationSec = speed;

    if (settings.sleepMode && sleepStartAt !== null) {
      const elapsed = Date.now() - sleepStartAt;
      const ramp = computeSleepRamp({
        elapsedMs: elapsed,
        rampMinutes: settings.sleepRampMinutes,
        baseDurationSec: speed,
      });
      if (ramp.shouldPause) {
        store.markRampDone();
        return;
      }
      durationSec = ramp.effectiveDuration;
    }

    const displayMs = Math.max(50, durationSec * 1_000 - settings.fadeMs);

    timerRef.current = setTimeout(() => {
      store.next();
    }, displayMs);

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [status, index, totalChunks, speed, settings.sleepMode, settings.sleepRampMinutes, settings.fadeMs, sleepStartAt, store]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
      if (persistRef.current) clearInterval(persistRef.current);
    };
  }, []);
}

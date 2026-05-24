import type { SleepRampResult } from "@/types";

export interface SleepRampInput {
  elapsedMs: number;
  rampMinutes: number;
  baseDurationSec: number;
}

export function computeSleepRamp({
  elapsedMs,
  rampMinutes,
  baseDurationSec,
}: SleepRampInput): SleepRampResult {
  const p = elapsedMs / (rampMinutes * 60_000);
  const effectiveDuration = baseDurationSec * (1 + p * 2);
  const brightness = Math.max(0.2, 1 - p);
  const shouldPause = p >= 1.2;
  return { effectiveDuration, brightness, shouldPause };
}

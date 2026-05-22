export type ReaderStatus = "idle" | "playing" | "paused" | "rampDownComplete";

export interface ReaderEngineState {
  status: ReaderStatus;
  currentIndex: number;
  startedAt: number | null;
  elapsedMs: number;
}

export interface SleepRampResult {
  effectiveDuration: number;
  brightness: number;
  shouldPause: boolean;
}

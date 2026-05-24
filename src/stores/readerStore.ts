import { create } from "zustand";
import type { ReaderStatus } from "@/types";

interface ReaderState {
  bookId: string | null;
  index: number;
  totalChunks: number;
  status: ReaderStatus;
  speed: number;
  sleepStartAt: number | null;

  load: (bookId: string, index: number, totalChunks: number) => void;
  play: () => void;
  pause: () => void;
  toggle: () => void;
  next: () => void;
  prev: () => void;
  seek: (index: number) => void;
  setSpeed: (speed: number) => void;
  startSleep: () => void;
  endSleep: () => void;
  markRampDone: () => void;
  reset: () => void;
}

export const useReaderStore = create<ReaderState>((set, get) => ({
  bookId: null,
  index: 0,
  totalChunks: 0,
  status: "idle",
  speed: 2.0,
  sleepStartAt: null,

  load: (bookId, index, totalChunks) =>
    set({ bookId, index, totalChunks, status: "paused", sleepStartAt: null }),

  play: () => set({ status: "playing" }),
  pause: () => set({ status: "paused" }),

  toggle: () => {
    const { status } = get();
    set({ status: status === "playing" ? "paused" : "playing" });
  },

  next: () => {
    const { index, totalChunks } = get();
    if (index < totalChunks - 1) {
      set({ index: index + 1 });
    } else {
      set({ status: "paused" });
    }
  },

  prev: () => {
    const { index } = get();
    if (index > 0) set({ index: index - 1 });
  },

  seek: (index) => set({ index }),

  setSpeed: (speed) => set({ speed }),

  startSleep: () => set({ sleepStartAt: Date.now() }),

  endSleep: () => set({ sleepStartAt: null }),

  markRampDone: () => set({ status: "rampDownComplete" }),

  reset: () =>
    set({
      bookId: null,
      index: 0,
      totalChunks: 0,
      status: "idle",
      sleepStartAt: null,
    }),
}));

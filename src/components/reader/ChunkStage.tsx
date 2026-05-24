"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { RubyText } from "./RubyText";
import type { Chunk, Theme } from "@/types";

interface ChunkStageProps {
  chunk: Chunk | undefined;
  fadeMs: number;
  fontSize: number;
  theme: Theme;
}

const THEME_STYLES: Record<Theme, { bg: string; fg: string }> = {
  light: { bg: "#fafaf7", fg: "#1a1a1a" },
  dark:  { bg: "#0d0d0d", fg: "#e6e6e6" },
  lamp:  { bg: "#1a1208", fg: "#e8c891" },
};

export function ChunkStage({ chunk, fadeMs, fontSize, theme }: ChunkStageProps) {
  const shouldReduceMotion = useReducedMotion();
  const fadeSec = (shouldReduceMotion ? 0 : fadeMs) / 1000;
  const { bg, fg } = THEME_STYLES[theme];

  return (
    <div
      className="fixed inset-0 grid place-items-center"
      style={{ backgroundColor: bg, color: fg }}
      aria-live="polite"
      aria-atomic="true"
    >
      <AnimatePresence mode="wait">
        {chunk && (
          <motion.div
            key={chunk.id}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: fadeSec }}
            style={{
              writingMode: "vertical-rl",
              fontSize: `clamp(28px, ${fontSize}px, 8vh)`,
              lineHeight: 1.6,
              letterSpacing: "0.04em",
              maxHeight: "80vh",
              textAlign: "center",
              paddingLeft: "8vw",
              paddingRight: "8vw",
            }}
          >
            {chunk.ruby && chunk.ruby.length > 0 ? (
              <RubyText text={chunk.text} tokens={chunk.ruby} />
            ) : (
              chunk.text
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

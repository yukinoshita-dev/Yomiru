"use client";

import { AnimatePresence, motion } from "framer-motion";
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
  lamp:  { bg: "#0a0000", fg: "#ff3a3a" },
};

export function ChunkStage({ chunk, fadeMs, fontSize, theme }: ChunkStageProps) {
  const fadeSec = fadeMs / 1000;
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
              fontSize: `clamp(28px, ${fontSize}px, 8vw)`,
              lineHeight: 1.6,
              letterSpacing: "0.04em",
              maxWidth: "80vw",
              textAlign: "center",
              paddingTop: "20vh",
              paddingBottom: "20vh",
            }}
          >
            {chunk.ruby && chunk.ruby.length > 0 ? (
              <RubyText tokens={chunk.ruby} />
            ) : (
              chunk.text
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

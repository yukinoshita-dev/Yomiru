"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";

import { RubyText } from "./RubyText";
import type { ThemePalette } from "@/lib/reader/themePalette";
import type { Chunk } from "@/types";

interface ReaderStageProps {
  chunk: Chunk | undefined;
  prevPrev?: Chunk;
  prev?: Chunk;
  next?: Chunk;
  nextNext?: Chunk;
  fadeMs: number;
  fontSize: number;
  palette: ThemePalette;
}

export function ReaderStage({
  chunk,
  prevPrev,
  prev,
  next,
  nextNext,
  fadeMs,
  fontSize,
  palette,
}: ReaderStageProps) {
  const shouldReduceMotion = useReducedMotion();
  const fadeSec = (shouldReduceMotion ? 0 : fadeMs) / 1000;
  const reveal = shouldReduceMotion ? "" : palette.classes.reveal;

  return (
    <div className="with-ruby relative z-10 flex min-h-[52vh] items-center justify-center" aria-live="polite" aria-atomic="true">
      <div className="writing-vrl flex h-[460px] max-h-[62vh] items-center gap-9 font-mincho">
        <BunsetsuGhost chunk={prevPrev} className={palette.classes.bunsetsuGhostFar} sizeClass="text-[22px]" />
        <BunsetsuGhost chunk={prev} className={palette.classes.bunsetsuGhostNear} sizeClass="text-[28px]" />
        <AnimatePresence mode="wait">
          {chunk && (
            <motion.div
              key={chunk.id}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: fadeSec }}
              className={`shrink-0 whitespace-nowrap font-medium tracking-[0.06em] ${palette.classes.bunsetsuCurrent} ${reveal}`}
              style={{ fontSize: `${fontSize}px`, lineHeight: 1.5 }}
            >
              <ChunkText chunk={chunk} />
            </motion.div>
          )}
        </AnimatePresence>
        <BunsetsuGhost chunk={next} className={palette.classes.bunsetsuGhostNear} sizeClass="text-[28px]" />
        <BunsetsuGhost chunk={nextNext} className={palette.classes.bunsetsuGhostFar} sizeClass="text-[22px]" />
      </div>
    </div>
  );
}

function BunsetsuGhost({
  chunk,
  className,
  sizeClass,
}: {
  chunk?: Chunk;
  className: string;
  sizeClass: string;
}) {
  return (
    <div className={`min-w-[1.5em] shrink-0 whitespace-nowrap tracking-[0.08em] ${sizeClass} ${className}`}>
      {chunk ? <ChunkText chunk={chunk} /> : null}
    </div>
  );
}

function ChunkText({ chunk }: { chunk: Chunk }) {
  if (chunk.ruby && chunk.ruby.length > 0) {
    return <RubyText text={chunk.text} tokens={chunk.ruby} />;
  }
  return <>{chunk.text}</>;
}

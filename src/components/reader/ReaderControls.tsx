"use client";

import { useCallback } from "react";
import { useDrag } from "@use-gesture/react";

interface ReaderControlsProps {
  onToggle: () => void;
  onNext: () => void;
  onPrev: () => void;
  onSpeedUp: () => void;
  onSpeedDown: () => void;
  onOpenSettings: () => void;
}

export function ReaderControls({
  onToggle,
  onNext,
  onPrev,
  onSpeedUp,
  onSpeedDown,
  onOpenSettings,
}: ReaderControlsProps) {
  const handleTap = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      const { clientX, currentTarget } = e;
      const { left, width } = currentTarget.getBoundingClientRect();
      const relX = (clientX - left) / width;
      if (relX < 0.33) {
        onPrev();
      } else if (relX > 0.67) {
        onNext();
      } else {
        onToggle();
      }
    },
    [onToggle, onNext, onPrev],
  );

  const bind = useDrag(
    ({ swipe: [, swipeY], last }) => {
      if (!last) return;
      if (swipeY === -1) onSpeedDown();
      if (swipeY === 1) onSpeedUp();
    },
    { filterTaps: true, swipe: { velocity: 0.3 } },
  );

  return (
    <div
      {...bind()}
      className="fixed inset-0 z-20"
      onClick={handleTap}
      onContextMenu={(e) => {
        e.preventDefault();
        onOpenSettings();
      }}
      onTouchStart={() => {}}
      style={{ touchAction: "pan-y" }}
    />
  );
}

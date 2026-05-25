'use client';

import { useCallback, useEffect, useRef, useState } from 'react';

export interface UseBunsetsuCycleOptions {
  total: number;
  intervalMs?: number;
  playing?: boolean;
  onEnd?: () => void;
}

export function useBunsetsuCycle({
  total,
  intervalMs = 1100,
  playing = true,
  onEnd,
}: UseBunsetsuCycleOptions) {
  const [idx, setIdx] = useState(0);
  const totalRef = useRef(total);
  const onEndRef = useRef(onEnd);
  totalRef.current = total;
  onEndRef.current = onEnd;

  useEffect(() => {
    if (!playing || totalRef.current <= 0) return;
    const t = window.setInterval(() => {
      setIdx((i) => {
        if (i + 1 >= totalRef.current) {
          onEndRef.current?.();
          return 0;
        }
        return i + 1;
      });
    }, intervalMs);
    return () => window.clearInterval(t);
  }, [playing, intervalMs]);

  const reset = useCallback(() => setIdx(0), []);
  void reset;

  return [idx, setIdx] as const;
}

interface PaperGrainProps {
  opacity?: number;
}

export function PaperGrain({ opacity = 0.5 }: PaperGrainProps) {
  return (
    <svg
      aria-hidden
      className="pointer-events-none absolute inset-0 h-full w-full mix-blend-multiply"
      style={{ opacity }}
    >
      <filter id="yomiru-reader-paper-noise">
        <feTurbulence
          type="fractalNoise"
          baseFrequency="0.85"
          numOctaves={2}
          stitchTiles="stitch"
        />
        <feColorMatrix values="0 0 0 0 0.55  0 0 0 0 0.42  0 0 0 0 0.25  0 0 0 0.35 0" />
      </filter>
      <rect width="100%" height="100%" filter="url(#yomiru-reader-paper-noise)" />
    </svg>
  );
}

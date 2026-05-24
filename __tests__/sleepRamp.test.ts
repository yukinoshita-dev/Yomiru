import { describe, expect, it } from "vitest";
import { computeSleepRamp } from "@/lib/reader/sleepRamp";

describe("computeSleepRamp", () => {
  const base = { rampMinutes: 10, baseDurationSec: 2 };

  it("elapsed=0: no change, full brightness, no pause", () => {
    const r = computeSleepRamp({ elapsedMs: 0, ...base });
    expect(r.effectiveDuration).toBeCloseTo(2);
    expect(r.brightness).toBeCloseTo(1);
    expect(r.shouldPause).toBe(false);
  });

  it("elapsed=half ramp: moderate slowdown and dimming", () => {
    const r = computeSleepRamp({ elapsedMs: 5 * 60 * 1000, ...base });
    // p=0.5 → duration=2*(1+0.5*2)=4, brightness=max(0.2,1-0.5)=0.5
    expect(r.effectiveDuration).toBeCloseTo(4);
    expect(r.brightness).toBeCloseTo(0.5);
    expect(r.shouldPause).toBe(false);
  });

  it("elapsed=full ramp: max slowdown, minimum brightness, no pause yet", () => {
    const r = computeSleepRamp({ elapsedMs: 10 * 60 * 1000, ...base });
    // p=1 → duration=2*(1+2)=6, brightness=max(0.2,1-1)=0.2
    expect(r.effectiveDuration).toBeCloseTo(6);
    expect(r.brightness).toBeCloseTo(0.2);
    expect(r.shouldPause).toBe(false);
  });

  it("elapsed=1.2x ramp: should pause", () => {
    const r = computeSleepRamp({ elapsedMs: 12 * 60 * 1000, ...base });
    // p=1.2 → shouldPause=true
    expect(r.shouldPause).toBe(true);
    expect(r.brightness).toBeCloseTo(0.2);
  });
});

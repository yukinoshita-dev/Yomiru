import { describe, expect, it } from "vitest";

import { formatDuration } from "@/lib/utils/format";

describe("formatDuration", () => {
  it("formats 0.5 seconds", () => {
    expect(formatDuration(0.5)).toBe("0.5秒");
  });

  it("formats 1.0 seconds", () => {
    expect(formatDuration(1.0)).toBe("1.0秒");
  });

  it("formats 2.5 seconds", () => {
    expect(formatDuration(2.5)).toBe("2.5秒");
  });

  it("formats 10 seconds", () => {
    expect(formatDuration(10)).toBe("10.0秒");
  });
});

import { describe, expect, it } from "vitest";

import { generateCoverDataUrl } from "@/lib/utils/cover";

describe("generateCoverDataUrl", () => {
  it("returns an SVG data URL", () => {
    expect(generateCoverDataUrl("吾輩は猫である").startsWith("data:image/svg+xml,")).toBe(true);
  });

  it("returns the same URL for the same title", () => {
    const first = generateCoverDataUrl("吾輩は猫である");
    const second = generateCoverDataUrl("吾輩は猫である");

    expect(second).toBe(first);
  });

  it("returns a data URL with an author", () => {
    expect(generateCoverDataUrl("吾輩は猫である", "夏目漱石").startsWith("data:image/svg+xml,")).toBe(true);
  });
});

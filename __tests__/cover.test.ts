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

  it("空文字タイトルでも data URL を返す", () => {
    expect(generateCoverDataUrl("").startsWith("data:image/svg+xml,")).toBe(true);
  });

  it("16文字超のタイトルでも正常に生成できる", () => {
    expect(generateCoverDataUrl("吾輩は猫であるという長い名前の本").startsWith("data:image/svg+xml,")).toBe(
      true,
    );
  });

  it("author なしでも author ありでも同じ形式の URL を返す", () => {
    expect(generateCoverDataUrl("吾輩は猫である").startsWith("data:image/svg+xml,")).toBe(true);
    expect(generateCoverDataUrl("吾輩は猫である", "夏目漱石").startsWith("data:image/svg+xml,")).toBe(true);
  });
});

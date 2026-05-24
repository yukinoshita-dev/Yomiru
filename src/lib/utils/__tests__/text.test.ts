import { describe, expect, it } from "vitest";

import { normalizeText } from "../text";

describe("normalizeText", () => {
  it("converts CRLF to LF", () => {
    expect(normalizeText("foo\r\nbar\r\nbaz")).toBe("foo\nbar\nbaz");
  });

  it("compresses consecutive spaces within a line", () => {
    expect(normalizeText("foo   bar\t\tbaz")).toBe("foo bar baz");
  });

  it("normalizes full-width alphanumeric characters with NFKC", () => {
    expect(normalizeText("ＡＢＣ１２３")).toBe("ABC123");
  });

  it("preserves line breaks", () => {
    expect(normalizeText("foo  bar\nbaz\tqux")).toBe("foo bar\nbaz qux");
  });
});

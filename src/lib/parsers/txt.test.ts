import { describe, expect, it } from "vitest";
import { parseTxt } from "./txt";

describe("parseTxt", () => {
  it("parses UTF-8 text with a title, normalized body, and SHA-256 hash", async () => {
    const file = new File(["Hello\r\nWorld\t !"], "sample.book.txt", {
      type: "text/plain",
    });

    const parsed = await parseTxt(file);

    expect(parsed).toEqual({
      title: "sample.book",
      format: "txt",
      sourceHash:
        "8620aa30b44eda1e368e0ac88694af9217c4dc845734581d291e92b0fec66c9a",
      sections: [
        {
          chapterIndex: 0,
          body: "Hello\nWorld !",
        },
      ],
    });
  });

  it("falls back to Shift_JIS when UTF-8 decoding contains replacement characters", async () => {
    const shiftJisBytes = new Uint8Array([
      0x82, 0xb1, 0x82, 0xf1, 0x82, 0xc9, 0x82, 0xbf, 0x82, 0xcd,
    ]);
    const file = new File([shiftJisBytes], "greeting.txt", {
      type: "text/plain",
    });

    const parsed = await parseTxt(file);

    expect(parsed.sections).toEqual([
      {
        chapterIndex: 0,
        body: "こんにちは",
      },
    ]);
  });
});

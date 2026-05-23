import { describe, expect, it } from "vitest";

import { segment, segmentAll } from "@/lib/segmenter/segmenter";

describe("segment", () => {
  it("splits text after Japanese full stops", () => {
    expect(segment({ text: "こんにちは。さようなら。" })).toEqual([
      { text: "こんにちは。" },
      { text: "さようなら。" },
    ]);
  });

  it("keeps consecutive punctuation together before splitting", () => {
    expect(segment({ text: "えっ！？驚いた。" })).toEqual([
      { text: "えっ！？" },
      { text: "驚いた。" },
    ]);
  });

  it("splits text at line breaks", () => {
    expect(segment({ text: "行1\n行2" })).toEqual([
      { text: "行1" },
      { text: "行2" },
    ]);
  });

  it("drops empty chunks created by blank lines", () => {
    expect(segment({ text: "段落1。\n\n段落2。" })).toEqual([
      { text: "段落1。" },
      { text: "段落2。" },
    ]);
  });

  it("keeps trailing text without punctuation as the final chunk", () => {
    expect(segment({ text: "句点なしで終わる末尾" })).toEqual([
      { text: "句点なしで終わる末尾" },
    ]);
  });

  it("does not split on half-width or full-width spaces", () => {
    expect(segment({ text: "前後 空白　あり" })).toEqual([
      { text: "前後 空白　あり" },
    ]);
  });

  it("returns an empty array for empty input", () => {
    expect(segment({ text: "" })).toEqual([]);
  });

  it("returns an empty array for line-break-only input", () => {
    expect(segment({ text: "\n\n" })).toEqual([]);
  });

  it("assigns ruby tokens to the chunk containing their base text", () => {
    expect(
      segment({
        text: "吾輩は猫である。名前はまだ無い。",
        ruby: [{ base: "吾輩", rt: "わがはい" }],
      }),
    ).toEqual([
      { text: "吾輩は猫である。", ruby: [{ base: "吾輩", rt: "わがはい" }] },
      { text: "名前はまだ無い。" },
    ]);
  });

  it("starts ruby base lookup from textOffset when provided", () => {
    expect(
      segment(
        {
          text: "同じ。同じ。",
          ruby: [{ base: "同じ", rt: "おなじ" }],
        },
        { textOffset: 3 },
      ),
    ).toEqual([
      { text: "同じ。" },
      { text: "同じ。", ruby: [{ base: "同じ", rt: "おなじ" }] },
    ]);
  });

  it("keeps a ruby token on the earliest chunk when its base crosses a boundary", () => {
    expect(
      segment({
        text: "吾輩は猫である。名前はまだ無い。",
        ruby: [{ base: "る。名前", rt: "るなまえ" }],
      }),
    ).toEqual([
      { text: "吾輩は猫である。", ruby: [{ base: "る。名前", rt: "るなまえ" }] },
      { text: "名前はまだ無い。" },
    ]);
  });

  it("inherits chapterIndex from the input", () => {
    expect(segment({ text: "第一章。続き。", chapterIndex: 3 })).toEqual([
      { text: "第一章。", chapterIndex: 3 },
      { text: "続き。", chapterIndex: 3 },
    ]);
  });
});

describe("segmentAll", () => {
  it("flattens multiple chapters in order", () => {
    expect(
      segmentAll([
        { text: "第一章。本文", chapterIndex: 0 },
        { text: "第二章。", chapterIndex: 1 },
      ]),
    ).toEqual([
      { text: "第一章。", chapterIndex: 0 },
      { text: "本文", chapterIndex: 0 },
      { text: "第二章。", chapterIndex: 1 },
    ]);
  });
});

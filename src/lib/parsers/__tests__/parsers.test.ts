import { describe, expect, it } from "vitest";

import { parseAozora } from "../aozora";
import { parseTxt } from "../txt";

describe("parseTxt", () => {
  it("parses a plain text file into one section", async () => {
    const file = new File(["こんにちは\n世界"], "hello.txt", { type: "text/plain" });

    const parsed = await parseTxt(file);

    expect(parsed.sections).toHaveLength(1);
    expect(parsed.title).toBe("hello");
  });

  it("parseTxt が空テキストを受け取ったとき sections[0].body が空文字", async () => {
    const file = new File([""], "empty.txt", { type: "text/plain" });

    const parsed = await parseTxt(file);

    expect(parsed.sections[0]?.body).toBe("");
  });
});

describe("parseAozora", () => {
  it("removes metadata wrapper and parses title", async () => {
    const file = new File(
      ["タイトル\n著者名\n-------\n本文\n底本：底本情報"],
      "aozora.txt",
      { type: "text/plain" },
    );

    const parsed = await parseAozora(file);

    expect(parsed.sections).toHaveLength(1);
    expect(parsed.title).toBe("タイトル");
  });

  it("parseAozora が複数セクションを返す場合のタイトル確認", async () => {
    const file = new File(
      [
        "作品名\n著者名\n-------\n［＃中見出し］第一章［＃中見出し終わり］\n内容1\n［＃中見出し］第二章［＃中見出し終わり］\n内容2",
      ],
      "aozora.txt",
      { type: "text/plain" },
    );

    const parsed = await parseAozora(file);

    expect(parsed.sections.length).toBeGreaterThan(0);
    expect(parsed.sections.map((section) => section.title)).toEqual(["第一章", "第二章"]);
  });
});

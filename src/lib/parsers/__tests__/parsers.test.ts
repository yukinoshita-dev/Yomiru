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
});

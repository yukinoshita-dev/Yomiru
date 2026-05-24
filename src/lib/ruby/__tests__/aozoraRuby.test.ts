import { describe, expect, it } from "vitest";

import { parseAozoraRuby } from "@/lib/ruby/aozoraRuby";

describe("parseAozoraRuby", () => {
  it("明示形式のルビを解析する", () => {
    expect(parseAozoraRuby("｜常用漢字外《じょうようかんじがい》")).toEqual({
      text: "常用漢字外",
      ruby: [{ base: "常用漢字外", rt: "じょうようかんじがい" }],
    });
  });

  it("暗黙形式のルビを解析する", () => {
    expect(parseAozoraRuby("吾輩《わがはい》は猫である。")).toEqual({
      text: "吾輩は猫である。",
      ruby: [{ base: "吾輩", rt: "わがはい" }],
    });
  });

  it("暗黙形式で直前が漢字でない場合はルビとして扱わない", () => {
    expect(parseAozoraRuby("あいう《xyz》えお")).toEqual({
      text: "あいうえお",
      ruby: [],
    });
  });

  it("注記を除去する", () => {
    expect(parseAozoraRuby("本文［＃「本文」に傍点］ある。")).toEqual({
      text: "本文ある。",
      ruby: [],
    });
  });

  it("注記内にルビ開始記号が混在しても注記を優先して除去する", () => {
    expect(parseAozoraRuby("［＃ルビ《test》］残り")).toEqual({
      text: "残り",
      ruby: [],
    });
  });

  it("明示形式と暗黙形式が混在しても順序通りに解析する", () => {
    expect(
      parseAozoraRuby(
        "吾輩《わがはい》は｜常用漢字外《じょうようかんじがい》だ。",
      ),
    ).toEqual({
      text: "吾輩は常用漢字外だ。",
      ruby: [
        { base: "吾輩", rt: "わがはい" },
        { base: "常用漢字外", rt: "じょうようかんじがい" },
      ],
    });
  });

  it("暗黙形式では直前の漢字列だけを親文字にする", () => {
    expect(parseAozoraRuby("お腹《なか》減った")).toEqual({
      text: "お腹減った",
      ruby: [{ base: "腹", rt: "なか" }],
    });
  });

  it("暗黙形式では連続漢字をすべて親文字にする", () => {
    expect(parseAozoraRuby("日本語《にほんご》")).toEqual({
      text: "日本語",
      ruby: [{ base: "日本語", rt: "にほんご" }],
    });
  });

  it("明示形式で終端までルビ終了記号がない場合は通常テキストとして扱う", () => {
    expect(parseAozoraRuby("｜壊れた")).toEqual({
      text: "｜壊れた",
      ruby: [],
    });
  });

  it("注記内に閉じ鉤括弧などが混在しても注記終端で除去する", () => {
    expect(parseAozoraRuby("本文［＃「本文」に「強調」］続き")).toEqual({
      text: "本文続き",
      ruby: [],
    });
  });

  it("空入力を解析する", () => {
    expect(parseAozoraRuby("")).toEqual({
      text: "",
      ruby: [],
    });
  });
});

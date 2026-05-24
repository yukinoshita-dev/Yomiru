import { describe, expect, it } from "vitest";
import { render } from "@testing-library/react";

import { RubyText } from "../RubyText";

describe("RubyText", () => {
  it("ルビなしのときは text 全体をそのまま表示する", () => {
    const { container } = render(<RubyText text="普通の文章" tokens={[]} />);
    expect(container.textContent).toBe("普通の文章");
    expect(container.querySelectorAll("ruby")).toHaveLength(0);
  });

  it("ルビありのとき、ruby タグと周辺テキストが両方表示される", () => {
    const { container } = render(
      <RubyText
        text="吾輩は猫である"
        tokens={[{ base: "吾輩", rt: "わがはい" }]}
      />,
    );
    expect(container.textContent).toContain("吾輩");
    expect(container.textContent).toContain("は猫である");
    expect(container.querySelectorAll("ruby")).toHaveLength(1);
    expect(container.querySelectorAll("rt")[0].textContent).toBe("わがはい");
  });

  it("複数のルビがあるとき、間のテキストも表示される", () => {
    const { container } = render(
      <RubyText
        text="吾輩は常用漢字外だ"
        tokens={[
          { base: "吾輩", rt: "わがはい" },
          { base: "常用漢字外", rt: "じょうようかんじがい" },
        ]}
      />,
    );
    expect(container.textContent).toContain("は");
    expect(container.textContent).toContain("だ");
    const rubies = container.querySelectorAll("ruby");
    expect(rubies).toHaveLength(2);
    const rts = container.querySelectorAll("rt");
    expect(rts[0].textContent).toBe("わがはい");
    expect(rts[1].textContent).toBe("じょうようかんじがい");
  });

  it("同じ親文字が複数回出るとき、出現順に対応する", () => {
    const { container } = render(
      <RubyText
        text="春は春だ"
        tokens={[
          { base: "春", rt: "はる" },
          { base: "春", rt: "はる" },
        ]}
      />,
    );
    const rubies = container.querySelectorAll("ruby");
    expect(rubies).toHaveLength(2);
    expect(container.textContent).toContain("は");
    expect(container.textContent).toContain("だ");
  });
});

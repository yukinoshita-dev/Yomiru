import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import Home from "./page";

describe("Home", () => {
  it("renders the Yomiru landing page", () => {
    render(<Home />);

    expect(
      screen.getByRole("heading", {
        name: "よみる",
      }),
    ).toBeInTheDocument();
    expect(
      screen.getByText("文節ごとに読む。目に優しい自動送りリーダー。"),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("link", { name: "ライブラリを開く →" }),
    ).toHaveAttribute("href", "/library");
    expect(screen.getByRole("heading", { name: "集中" })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "PWA対応" })).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { name: "青空文庫対応" }),
    ).toBeInTheDocument();
    expect(
      screen.getByText("Space:再生停止 / 矢印:進む戻る / S:睡眠モード"),
    ).toBeInTheDocument();
  });
});

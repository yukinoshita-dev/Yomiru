import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it } from "vitest";
import Home from "./page";

describe("Home", () => {
  beforeEach(() => {
    window.localStorage.setItem("yomiru:terms:acceptedAt", "2026-05-25T00:00:00.000Z");
  });

  it("renders the Andon landing page", () => {
    render(<Home />);

    expect(screen.getByText("よみる")).toBeInTheDocument();
    expect(screen.getByText("文節ごとに、灯のように。")).toBeInTheDocument();
    expect(screen.getByText("視線を、動かさない")).toBeInTheDocument();
    expect(screen.getByText("夜に、馴染む")).toBeInTheDocument();
    expect(screen.getByText("まどろみへ、降りる")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /ライブラリをひらく/ })).toHaveAttribute(
      "href",
      "/library",
    );
    expect(screen.getByRole("link", { name: "利用規約" })).toHaveAttribute("href", "/terms");
  });

  it("shows terms consent on first visit and stores acceptance", async () => {
    window.localStorage.clear();

    render(<Home />);

    expect(await screen.findByRole("dialog", { name: "ご利用にあたって" })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "利用規約全文 →" })).toHaveAttribute("href", "/terms");

    fireEvent.click(screen.getByRole("button", { name: "同意して続ける" }));

    await waitFor(() => {
      expect(screen.queryByRole("dialog", { name: "ご利用にあたって" })).not.toBeInTheDocument();
    });
    expect(window.localStorage.getItem("yomiru:terms:acceptedAt")).toMatch(/^\d{4}-\d{2}-\d{2}T/);
  });
});

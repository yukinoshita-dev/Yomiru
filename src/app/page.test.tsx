import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import Home from "./page";

describe("Home", () => {
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
  });
});

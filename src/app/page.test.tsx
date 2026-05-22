import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import Home from "./page";

describe("Home", () => {
  it("renders the Yomiru hero", () => {
    render(<Home />);

    expect(
      screen.getByRole("heading", {
        name: "Yomiru - \u6587\u7bc0\u30ea\u30fc\u30c0\u30fc",
      }),
    ).toBeInTheDocument();
    expect(
      screen.getByText(
        "\u6587\u7bc0\u3054\u3068\u306b\u8aad\u3080\u305f\u3081\u306ePWA\u30ea\u30fc\u30c0\u30fc",
      ),
    ).toBeInTheDocument();
  });
});

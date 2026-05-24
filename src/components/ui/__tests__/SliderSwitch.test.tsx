import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { Slider } from "../Slider";
import { Switch } from "../Switch";

describe("Slider", () => {
  it("renders the label, display value, and emits numeric changes", () => {
    const handleChange = vi.fn();

    render(
      <Slider
        label="速度"
        value={1.5}
        min={0.5}
        max={10}
        step={0.1}
        displayValue="1.5秒/文節"
        onChange={handleChange}
      />,
    );

    const input = screen.getByRole("slider", { name: "速度" });
    expect(screen.getByText("速度")).toBeInTheDocument();
    expect(screen.getByText("1.5秒/文節")).toBeInTheDocument();
    expect(input).toHaveAttribute("aria-valuenow", "1.5");
    expect(input).toHaveAttribute("aria-valuemin", "0.5");
    expect(input).toHaveAttribute("aria-valuemax", "10");

    fireEvent.change(input, { target: { value: "2.2" } });

    expect(handleChange).toHaveBeenCalledWith(2.2);
  });
});

describe("Switch", () => {
  it("renders as a switch and toggles the checked state", () => {
    const handleChange = vi.fn();

    render(<Switch label="睡眠モード" checked={false} onChange={handleChange} />);

    const button = screen.getByRole("switch", { name: "睡眠モード" });
    expect(button).toHaveAttribute("aria-checked", "false");

    fireEvent.click(button);

    expect(handleChange).toHaveBeenCalledWith(true);
  });
});

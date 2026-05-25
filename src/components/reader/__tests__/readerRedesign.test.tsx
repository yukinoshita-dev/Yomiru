import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { ReaderHelp } from "../ReaderHelp";
import { ReaderStage } from "../ReaderStage";
import { computeReadingMetrics, formatMs, toChapterKanji } from "@/lib/reader/eta";
import { THEME_PALETTES } from "@/lib/reader/themePalette";
import type { Chunk } from "@/types";

vi.mock("framer-motion", async () => {
  const React = await import("react");
  return {
    AnimatePresence: ({ children }: { children: React.ReactNode }) => <>{children}</>,
    motion: {
      div: ({ children, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
        <div {...props}>{children}</div>
      ),
    },
    useReducedMotion: () => false,
  };
});

const chunk = (index: number, text: string, extra: Partial<Chunk> = {}): Chunk => ({
  id: `chunk-${index}`,
  bookId: "book-1",
  index,
  text,
  ...extra,
});

describe("reader redesign utilities", () => {
  it("computes progress, remaining time, label, and bunsetsu-per-minute", () => {
    expect(
      computeReadingMetrics({
        index: 2,
        totalChunks: 10,
        displayDurationSec: 1.5,
      }),
    ).toEqual({
      progress: 30,
      remainingMs: 10_500,
      remainingLabel: "0:10",
      wpm: 40,
    });
  });

  it("formats milliseconds and chapter numbers for reader chrome", () => {
    expect(formatMs(61_900)).toBe("1:01");
    expect(formatMs(-100)).toBe("0:00");
    expect(toChapterKanji(undefined)).toBe("一");
    expect(toChapterKanji(3)).toBe("三");
    expect(toChapterKanji(12)).toBe("12");
  });

  it("defines palette classes for all persisted themes", () => {
    expect(Object.keys(THEME_PALETTES).sort()).toEqual(["dark", "lamp", "light"]);
    expect(THEME_PALETTES.dark.classes.root).toContain("bg-coal");
    expect(THEME_PALETTES.light.classes.accent).toContain("text-vermillion");
  });
});

describe("ReaderStage", () => {
  it("renders current, previous, and next chunks with ruby support", () => {
    render(
      <ReaderStage
        chunk={chunk(2, "先生と私", { ruby: [{ base: "先生", rt: "せんせい" }] })}
        prevPrev={chunk(0, "遠い前")}
        prev={chunk(1, "すぐ前")}
        next={chunk(3, "すぐ次")}
        nextNext={chunk(4, "遠い次")}
        fadeMs={300}
        fontSize={56}
        palette={THEME_PALETTES.light}
      />,
    );

    expect(screen.getByText("遠い前")).toBeInTheDocument();
    expect(screen.getByText("すぐ前")).toBeInTheDocument();
    expect(screen.getByText("すぐ次")).toBeInTheDocument();
    expect(screen.getByText("遠い次")).toBeInTheDocument();
    expect(screen.getByText("先生")).toBeInTheDocument();
    expect(screen.getByText("せんせい")).toBeInTheDocument();
  });
});

describe("ReaderHelp", () => {
  it("toggles the operation help panel", () => {
    render(<ReaderHelp palette={THEME_PALETTES.light} />);

    expect(screen.queryByRole("dialog", { name: "操作ヘルプ" })).not.toBeInTheDocument();

    const toggle = screen.getByRole("button", { name: "操作ヘルプを開く" });
    fireEvent.click(toggle);

    expect(screen.getByRole("dialog", { name: "操作ヘルプ" })).toBeInTheDocument();
    expect(screen.getByText("再生 / 停止")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "操作ヘルプを閉じる" })).toHaveAttribute(
      "aria-expanded",
      "true",
    );

    fireEvent.click(screen.getByRole("button", { name: "操作ヘルプを閉じる" }));

    expect(screen.queryByRole("dialog", { name: "操作ヘルプ" })).not.toBeInTheDocument();
  });
});

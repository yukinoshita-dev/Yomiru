import type { Theme } from "@/types";

export interface ThemePalette {
  bg: string;
  fg: string;
  bright: string;
  ghost: string;
  accent: string;
  faint: string;
  classes: {
    root: string;
    fgFaint: string;
    fgMid: string;
    fgStrong: string;
    accent: string;
    accentBg: string;
    border: string;
    bunsetsuCurrent: string;
    bunsetsuGhostNear: string;
    bunsetsuGhostFar: string;
    reveal: string;
  };
}

export const THEME_PALETTES: Record<Theme, ThemePalette> = {
  lamp: {
    bg: "#0a0807",
    fg: "#e8d9c0",
    bright: "#fbe7c2",
    ghost: "#e8d9c0",
    accent: "#e8a96a",
    faint: "#e8a96a",
    classes: {
      root: "bg-ink text-cream",
      fgFaint: "text-cream/45",
      fgMid: "text-cream/65",
      fgStrong: "text-paper",
      accent: "text-glow",
      accentBg: "bg-glow",
      border: "border-glow/12",
      bunsetsuCurrent:
        "text-bright [text-shadow:_0_0_18px_rgba(232,169,106,0.45),_0_0_36px_rgba(232,169,106,0.15)]",
      bunsetsuGhostNear: "text-cream/30",
      bunsetsuGhostFar: "text-cream/15",
      reveal: "animate-andon-reveal",
    },
  },
  dark: {
    bg: "#08080a",
    fg: "#d4d6db",
    bright: "#f2f4f8",
    ghost: "#d4d6db",
    accent: "#e8eaef",
    faint: "#d4d6db",
    classes: {
      root: "bg-coal text-fog",
      fgFaint: "text-fog/45",
      fgMid: "text-fog/65",
      fgStrong: "text-snow",
      accent: "text-frost",
      accentBg: "bg-snow",
      border: "border-fog/10",
      bunsetsuCurrent: "text-frost",
      bunsetsuGhostNear: "text-fog/35",
      bunsetsuGhostFar: "text-fog/15",
      reveal: "animate-dark-reveal",
    },
  },
  light: {
    bg: "#f4ecd8",
    fg: "#1a1614",
    bright: "#1a1614",
    ghost: "#1a1614",
    accent: "#a8453a",
    faint: "#1a1614",
    classes: {
      root: "bg-washi text-sumi",
      fgFaint: "text-sumi/45",
      fgMid: "text-sumi/65",
      fgStrong: "text-sumi",
      accent: "text-vermillion",
      accentBg: "bg-vermillion",
      border: "border-sumi/12",
      bunsetsuCurrent: "text-sumi",
      bunsetsuGhostNear: "text-sumi/45",
      bunsetsuGhostFar: "text-sumi/25",
      reveal: "animate-light-reveal",
    },
  },
};

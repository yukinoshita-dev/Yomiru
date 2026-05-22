export type Theme = "light" | "dark" | "lamp";

export interface AppSettings {
  id: "default";
  fontSize: number;
  theme: Theme;
  sleepMode: boolean;
  sleepRampMinutes: number;
  displayDuration: number;
  fadeMs: number;
  seededSamples: boolean;
}

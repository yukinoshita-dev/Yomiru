import { db } from "@/lib/db/database";
import type { AppSettings } from "@/types";

export const DEFAULT_SETTINGS: AppSettings = {
  id: "default",
  fontSize: 28,
  theme: "light",
  sleepMode: false,
  sleepRampMinutes: 20,
  displayDuration: 3.0,
  fadeMs: 180,
  seededSamples: false,
};

export const getSettings = async (): Promise<AppSettings> => {
  const settings = await db.settings.get("default");

  if (settings) {
    return settings;
  }

  await db.settings.put(DEFAULT_SETTINGS);
  return DEFAULT_SETTINGS;
};

export const saveSettings = async (
  patch: Partial<AppSettings>,
): Promise<AppSettings> => {
  const current = await getSettings();
  const next: AppSettings = {
    ...current,
    ...patch,
    id: "default",
  };

  await db.settings.put(next);
  return next;
};

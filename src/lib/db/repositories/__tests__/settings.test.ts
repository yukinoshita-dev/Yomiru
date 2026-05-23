import { afterAll, beforeEach, describe, expect, it } from "vitest";

import { db } from "@/lib/db/database";
import { DEFAULT_SETTINGS, getSettings, saveSettings } from "@/lib/db/repositories";

describe("settings repository", () => {
  beforeEach(async () => {
    await db.delete();
    await db.open();
  });

  afterAll(() => {
    db.close();
  });

  it("returns and persists default settings on first read", async () => {
    await expect(getSettings()).resolves.toEqual(DEFAULT_SETTINGS);
    await expect(db.settings.get("default")).resolves.toEqual(DEFAULT_SETTINGS);
  });

  it("merges partial settings with existing settings", async () => {
    await getSettings();

    await expect(saveSettings({ fontSize: 32, sleepMode: true })).resolves.toEqual({
      ...DEFAULT_SETTINGS,
      fontSize: 32,
      sleepMode: true,
    });
  });
});

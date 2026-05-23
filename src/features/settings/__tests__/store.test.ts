import { afterAll, afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { db } from "@/lib/db/database";
import { DEFAULT_SETTINGS, getSettings, saveSettings } from "@/lib/db/repositories/settings";
import { useSettingsStore } from "@/features/settings/store";

const resetStore = () => {
  useSettingsStore.setState({
    settings: DEFAULT_SETTINGS,
    hydrated: false,
  });
};

describe("settings store", () => {
  beforeEach(async () => {
    await db.delete();
    await db.open();
    resetStore();
  });

  afterEach(() => {
    vi.clearAllTimers();
    vi.useRealTimers();
  });

  afterAll(() => {
    db.close();
  });

  it("uses DEFAULT_SETTINGS as the initial settings", () => {
    expect(useSettingsStore.getState().settings).toEqual(DEFAULT_SETTINGS);
    expect(useSettingsStore.getState().hydrated).toBe(false);
  });

  it("hydrates with DEFAULT_SETTINGS when Dexie has no settings", async () => {
    await useSettingsStore.getState().hydrate();

    expect(useSettingsStore.getState().settings).toEqual(DEFAULT_SETTINGS);
    expect(useSettingsStore.getState().hydrated).toBe(true);
  });

  it("hydrates with existing Dexie settings", async () => {
    const stored = await saveSettings({ theme: "lamp", fontSize: 34 });

    await useSettingsStore.getState().hydrate();

    expect(useSettingsStore.getState().settings).toEqual(stored);
    expect(useSettingsStore.getState().hydrated).toBe(true);
  });

  it("updates store settings immediately", () => {
    vi.useFakeTimers({ toFake: ["setTimeout", "clearTimeout"] });

    useSettingsStore.getState().update({ theme: "dark" });

    expect(useSettingsStore.getState().settings.theme).toBe("dark");
  });

  it("persists updates to Dexie after debounce", async () => {
    vi.useFakeTimers({ toFake: ["setTimeout", "clearTimeout"] });

    useSettingsStore.getState().update({ theme: "dark" });
    await vi.advanceTimersByTimeAsync(200);
    vi.useRealTimers();

    await vi.waitFor(async () => {
      await expect(getSettings()).resolves.toEqual({
        ...DEFAULT_SETTINGS,
        theme: "dark",
      });
    });
  });

  it("debounces rapid updates and persists only the final merged patch", async () => {
    await getSettings();
    vi.useFakeTimers({ toFake: ["setTimeout", "clearTimeout"] });
    const putSpy = vi.spyOn(db.settings, "put");

    useSettingsStore.getState().update({ theme: "dark" });
    useSettingsStore.getState().update({ fontSize: 32 });
    useSettingsStore.getState().update({ theme: "lamp", sleepMode: true });

    await vi.advanceTimersByTimeAsync(199);
    expect(putSpy).not.toHaveBeenCalled();

    await vi.advanceTimersByTimeAsync(1);
    vi.useRealTimers();

    await vi.waitFor(() => {
      expect(putSpy).toHaveBeenCalledTimes(1);
    });
    await expect(getSettings()).resolves.toEqual({
      ...DEFAULT_SETTINGS,
      theme: "lamp",
      fontSize: 32,
      sleepMode: true,
    });
  });

  it("resets store and Dexie settings to DEFAULT_SETTINGS", async () => {
    await saveSettings({ theme: "dark", fontSize: 36 });
    useSettingsStore.getState().update({ theme: "lamp", fontSize: 40 });

    useSettingsStore.getState().reset();

    expect(useSettingsStore.getState().settings).toEqual(DEFAULT_SETTINGS);
    await vi.waitFor(async () => {
      await expect(getSettings()).resolves.toEqual(DEFAULT_SETTINGS);
    });
  });
});

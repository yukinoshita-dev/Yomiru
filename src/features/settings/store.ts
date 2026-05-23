import { create } from "zustand";

import { DEFAULT_SETTINGS, getSettings, saveSettings } from "@/lib/db/repositories/settings";
import type { AppSettings } from "@/types";

interface SettingsState {
  settings: AppSettings;
  hydrated: boolean;
  hydrate: () => Promise<void>;
  update: (patch: Partial<AppSettings>) => void;
  reset: () => void;
}

let hydratePromise: Promise<void> | null = null;
let saveTimer: ReturnType<typeof setTimeout> | null = null;
let pendingPatch: Partial<AppSettings> | null = null;

const clearPendingSave = () => {
  if (saveTimer) {
    clearTimeout(saveTimer);
    saveTimer = null;
  }

  pendingPatch = null;
};

const scheduleSave = (patch: Partial<AppSettings>) => {
  pendingPatch = {
    ...pendingPatch,
    ...patch,
  };

  if (saveTimer) {
    clearTimeout(saveTimer);
  }

  saveTimer = setTimeout(() => {
    const patchToSave = pendingPatch;
    saveTimer = null;
    pendingPatch = null;

    if (!patchToSave) {
      return;
    }

    void saveSettings(patchToSave).catch((error: unknown) => {
      console.error("Failed to save settings", error);
    });
  }, 200);
};

export const useSettingsStore = create<SettingsState>((set, get) => ({
  settings: DEFAULT_SETTINGS,
  hydrated: false,

  hydrate: async () => {
    if (get().hydrated) {
      return;
    }

    if (!hydratePromise) {
      hydratePromise = getSettings()
        .then((settings) => {
          set({
            settings,
            hydrated: true,
          });
        })
        .finally(() => {
          hydratePromise = null;
        });
    }

    await hydratePromise;
  },

  update: (patch) => {
    set((state) => ({
      settings: {
        ...state.settings,
        ...patch,
        id: "default",
      },
    }));

    scheduleSave(patch);
  },

  reset: () => {
    clearPendingSave();
    set({
      settings: DEFAULT_SETTINGS,
      hydrated: true,
    });

    void saveSettings(DEFAULT_SETTINGS).catch((error: unknown) => {
      console.error("Failed to reset settings", error);
    });
  },
}));

"use client";

import { useEffect } from "react";

import { useSettingsStore } from "@/features/settings/store";

export const useSettings = useSettingsStore;

export const useHydrateSettings = () => {
  const hydrate = useSettingsStore((state) => state.hydrate);

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    void hydrate();
  }, [hydrate]);
};

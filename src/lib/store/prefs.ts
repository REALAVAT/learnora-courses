"use client";

import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

type PrefsState = {
  autoplay: boolean;
  emailDigest: boolean;
  set: (patch: Partial<Pick<PrefsState, "autoplay" | "emailDigest">>) => void;
};

export const usePrefs = create<PrefsState>()(
  persist(
    (set) => ({
      autoplay: true,
      emailDigest: true,
      set: (patch) => set(patch),
    }),
    { name: "learnora-prefs", version: 1, storage: createJSONStorage(() => localStorage) },
  ),
);

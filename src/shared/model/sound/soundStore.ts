import { create } from "zustand";
import {
  syncSoundSettings,
  type BgmKind,
} from "@/shared/lib/sound/soundPlayer";
import {
  DEFAULT_SOUND_SETTINGS,
  getSavedSoundSettings,
  saveSoundSettings,
  type SoundSettings,
} from "@/shared/lib/sound/soundSettings";

interface SoundStoreState {
  bgmKind: BgmKind;
  hasLoadedSoundSettings: boolean;
  soundSettings: SoundSettings;
  loadSoundSettings: () => void;
  setBgmKind: (bgmKind: BgmKind) => void;
  updateSoundSettings: (settings: Partial<SoundSettings>) => SoundSettings;
}

export const useSoundStore = create<SoundStoreState>((set, get) => ({
  bgmKind: "site",
  hasLoadedSoundSettings: false,
  soundSettings: DEFAULT_SOUND_SETTINGS,

  loadSoundSettings: () => {
    if (get().hasLoadedSoundSettings) {
      return;
    }

    const soundSettings = getSavedSoundSettings();

    set({
      hasLoadedSoundSettings: true,
      soundSettings,
    });
    syncSoundSettings(soundSettings, get().bgmKind);
  },

  setBgmKind: (bgmKind) => {
    if (get().bgmKind === bgmKind) {
      return;
    }

    set({ bgmKind });
    syncSoundSettings(get().soundSettings, bgmKind);
  },

  updateSoundSettings: (settings) => {
    const soundSettings = {
      ...get().soundSettings,
      ...settings,
    };

    set({ soundSettings });
    saveSoundSettings(soundSettings);
    syncSoundSettings(soundSettings, get().bgmKind);

    return soundSettings;
  },
}));

import { create } from "zustand";
import { syncSoundSettings } from "@/shared/lib/sound/soundPlayer";
import {
  DEFAULT_SOUND_SETTINGS,
  getSavedSoundSettings,
  saveSoundSettings,
  type SoundSettings,
} from "@/shared/lib/sound/soundSettings";

interface SoundStoreState {
  hasLoadedSoundSettings: boolean;
  soundSettings: SoundSettings;
  loadSoundSettings: () => void;
  updateSoundSettings: (settings: Partial<SoundSettings>) => SoundSettings;
}

export const useSoundStore = create<SoundStoreState>((set, get) => ({
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
    syncSoundSettings(soundSettings);
  },

  updateSoundSettings: (settings) => {
    const soundSettings = {
      ...get().soundSettings,
      ...settings,
    };

    set({ soundSettings });
    saveSoundSettings(soundSettings);
    syncSoundSettings(soundSettings);

    return soundSettings;
  },
}));

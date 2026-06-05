export const SOUND_SETTINGS_STORAGE_KEY = "ggogit:sound-settings";
export const DEFAULT_SOUND_VOLUME = 0.15;

export interface SoundSettings {
  bgmVolume: number;
  isBgmEnabled: boolean;
  isSfxEnabled: boolean;
  sfxVolume: number;
}

export const DEFAULT_SOUND_SETTINGS: SoundSettings = {
  bgmVolume: DEFAULT_SOUND_VOLUME,
  isBgmEnabled: false,
  isSfxEnabled: false,
  sfxVolume: DEFAULT_SOUND_VOLUME,
};

const normalizeVolume = (volume: unknown) => {
  if (typeof volume !== "number" || Number.isNaN(volume)) {
    return DEFAULT_SOUND_VOLUME;
  }

  const normalizedVolume = volume > 1 ? volume / 100 : volume;

  return Math.min(1, Math.max(0, normalizedVolume));
};

export const getSavedSoundSettings = () => {
  if (typeof window === "undefined") {
    return DEFAULT_SOUND_SETTINGS;
  }

  const savedSettings = window.localStorage.getItem(SOUND_SETTINGS_STORAGE_KEY);

  if (!savedSettings) {
    return DEFAULT_SOUND_SETTINGS;
  }

  try {
    const parsedSettings = JSON.parse(savedSettings) as Partial<SoundSettings>;

    return {
      ...DEFAULT_SOUND_SETTINGS,
      bgmVolume: normalizeVolume(parsedSettings.bgmVolume),
      isBgmEnabled: false,
      isSfxEnabled: false,
      sfxVolume: normalizeVolume(parsedSettings.sfxVolume),
    };
  } catch {
    return DEFAULT_SOUND_SETTINGS;
  }
};

export const saveSoundSettings = (settings: SoundSettings) => {
  window.localStorage.setItem(
    SOUND_SETTINGS_STORAGE_KEY,
    JSON.stringify({
      bgmVolume: settings.bgmVolume,
      sfxVolume: settings.sfxVolume,
    }),
  );
};

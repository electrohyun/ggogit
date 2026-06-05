import { bgMusic, sfxClick } from "@/assets";
import { Howl, Howler } from "howler";
import type { SoundSettings } from "./soundSettings";

let bgmSound: Howl | null = null;
let clickSound: Howl | null = null;

const getBgmSound = () => {
  bgmSound ??= new Howl({
    loop: true,
    preload: true,
    src: [bgMusic],
  });

  return bgmSound;
};

const getClickSound = () => {
  clickSound ??= new Howl({
    preload: true,
    src: [sfxClick],
  });

  return clickSound;
};

export const syncSoundSettings = (settings: SoundSettings) => {
  const isMuted = !settings.isBgmEnabled && !settings.isSfxEnabled;
  const bgm = getBgmSound();

  Howler.mute(isMuted);
  bgm.volume(settings.bgmVolume);

  if (settings.isBgmEnabled && !bgm.playing()) {
    bgm.play();
  }

  if (!settings.isBgmEnabled && bgm.playing()) {
    bgm.pause();
  }
};

export const playClickSound = (settings: SoundSettings) => {
  if (!settings.isSfxEnabled) {
    return;
  }

  const sound = getClickSound();

  sound.volume(settings.sfxVolume);
  sound.play();
};

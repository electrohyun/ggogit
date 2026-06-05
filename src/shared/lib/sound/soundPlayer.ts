import {
  bgmGame,
  bgmSite,
  sfxClick,
  sfxCorrect,
  sfxModalClosed,
  sfxWrong,
} from "@/assets";
import { Howl, Howler } from "howler";
import type { SoundSettings } from "./soundSettings";

export type BgmKind = "game" | "site";

let activeBgmKind: BgmKind = "site";
let gameBgmSound: Howl | null = null;
let siteBgmSound: Howl | null = null;
let clickSound: Howl | null = null;
let correctSound: Howl | null = null;
let modalClosedSound: Howl | null = null;
let wrongSound: Howl | null = null;

const getGameBgmSound = () => {
  gameBgmSound ??= new Howl({
    loop: true,
    preload: true,
    src: [bgmGame],
  });

  return gameBgmSound;
};

const getSiteBgmSound = () => {
  siteBgmSound ??= new Howl({
    loop: true,
    preload: true,
    src: [bgmSite],
  });

  return siteBgmSound;
};

const getBgmSound = (bgmKind: BgmKind) => {
  return bgmKind === "game" ? getGameBgmSound() : getSiteBgmSound();
};

const getInactiveBgmSound = (bgmKind: BgmKind) => {
  return bgmKind === "game" ? siteBgmSound : gameBgmSound;
};

const getClickSound = () => {
  clickSound ??= new Howl({
    preload: true,
    src: [sfxClick],
  });

  return clickSound;
};

const getCorrectSound = () => {
  correctSound ??= new Howl({
    preload: true,
    src: [sfxCorrect],
  });

  return correctSound;
};

const getModalClosedSound = () => {
  modalClosedSound ??= new Howl({
    preload: true,
    src: [sfxModalClosed],
  });

  return modalClosedSound;
};

const getWrongSound = () => {
  wrongSound ??= new Howl({
    preload: true,
    src: [sfxWrong],
  });

  return wrongSound;
};

const playSfxSound = (settings: SoundSettings, sound: Howl) => {
  if (!settings.isSfxEnabled) {
    return;
  }

  sound.volume(settings.sfxVolume);
  sound.play();
};

export const syncSoundSettings = (
  settings: SoundSettings,
  bgmKind: BgmKind = activeBgmKind,
) => {
  const isMuted = !settings.isBgmEnabled && !settings.isSfxEnabled;
  const bgm = getBgmSound(bgmKind);
  const inactiveBgm = getInactiveBgmSound(bgmKind);

  activeBgmKind = bgmKind;
  Howler.mute(isMuted);
  bgm.volume(settings.bgmVolume);
  inactiveBgm?.pause();

  if (settings.isBgmEnabled && !bgm.playing()) {
    bgm.play();
  }

  if (!settings.isBgmEnabled && bgm.playing()) {
    bgm.pause();
  }
};

export const playClickSound = (settings: SoundSettings) => {
  playSfxSound(settings, getClickSound());
};

export const playCorrectSound = (settings: SoundSettings) => {
  playSfxSound(settings, getCorrectSound());
};

export const playModalClosedSound = (settings: SoundSettings) => {
  playSfxSound(settings, getModalClosedSound());
};

export const playSuccessSound = (settings: SoundSettings) => {
  playCorrectSound(settings);
};

export const playWrongSound = (settings: SoundSettings) => {
  playSfxSound(settings, getWrongSound());
};

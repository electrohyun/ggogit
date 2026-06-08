"use client";

import { ggoggoSmile } from "@/assets/mascot";
import type { CurrentUser } from "@/entities/user";
import { playClickSound } from "@/shared/lib/sound/soundPlayer";
import { useSoundStore } from "@/shared/model/sound/soundStore";
import { SoundLink } from "@/shared/ui/sound-link";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import styles from "./AppShellProfileMenu.module.css";

interface AppShellProfileMenuProps {
  currentUser: CurrentUser;
}

export default function AppShellProfileMenu({
  currentUser,
}: AppShellProfileMenuProps) {
  const [isOpen, setIsOpen] = useState(false);
  const loadSoundSettings = useSoundStore((state) => state.loadSoundSettings);
  const soundSettings = useSoundStore((state) => state.soundSettings);
  const updateSoundSettings = useSoundStore(
    (state) => state.updateSoundSettings,
  );
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    loadSoundSettings();
  }, [loadSoundSettings]);

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    const handlePointerDown = (event: PointerEvent) => {
      if (!containerRef.current?.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    window.addEventListener("pointerdown", handlePointerDown);

    return () => {
      window.removeEventListener("pointerdown", handlePointerDown);
    };
  }, [isOpen]);

  return (
    <div ref={containerRef} className={styles.container}>
      <button
        type="button"
        className={styles.button}
        aria-label="사용자 메뉴 열기"
        aria-expanded={isOpen}
        aria-haspopup="menu"
        onClick={() => {
          playClickSound(soundSettings);
          setIsOpen((current) => !current);
        }}
      >
        <Image
          src={currentUser.avatarUrl ?? ggoggoSmile}
          alt={`${currentUser.name} 프로필`}
          fill
          sizes="50px"
          className={styles.image}
        />
      </button>
      {isOpen ? (
        <div className={styles.menu} role="menu">
          <SoundLink
            className={styles.menuItem}
            href="/profile"
            role="menuitem"
            onClick={() => setIsOpen(false)}
          >
            내 정보
          </SoundLink>
          <SoundLink
            className={styles.menuItem}
            href="/credits"
            role="menuitem"
            onClick={() => setIsOpen(false)}
          >
            크레딧
          </SoundLink>
          <div className={styles.soundPanel}>
            <label className={styles.soundRange}>
              <span>배경음 볼륨</span>
              <input
                type="range"
                min="0"
                max="1"
                step="0.01"
                value={soundSettings.bgmVolume}
                onChange={(event) =>
                  updateSoundSettings({ bgmVolume: Number(event.target.value) })
                }
              />
            </label>
            <label className={styles.soundRange}>
              <span>효과음 볼륨</span>
              <input
                type="range"
                min="0"
                max="1"
                step="0.01"
                value={soundSettings.sfxVolume}
                onChange={(event) => {
                  const nextSettings = updateSoundSettings({
                    sfxVolume: Number(event.target.value),
                  });

                  playClickSound(nextSettings);
                }}
              />
            </label>
          </div>
          <SoundLink
            className={`${styles.menuItem} ${styles.logoutItem}`}
            href="/auth/logout"
            prefetch={false}
            role="menuitem"
            onClick={() => setIsOpen(false)}
          >
            로그아웃
          </SoundLink>
        </div>
      ) : null}
    </div>
  );
}

"use client";

import Image from "next/image";
import { useState } from "react";

import { playClickSound } from "@/shared/lib/sound/soundPlayer";
import { useSoundStore } from "@/shared/model/sound/soundStore";
import { Modal } from "@/shared/ui/modal";
import { SoundLink } from "@/shared/ui/sound-link";
import { ggoggoPodium } from "@/assets/mascot";

import styles from "./ChallengePage.module.css";

export default function ChallengeStartControl() {
  const [isOpen, setIsOpen] = useState(false);
  const soundSettings = useSoundStore((state) => state.soundSettings);

  const openStartModal = () => {
    playClickSound(soundSettings);
    setIsOpen(true);
  };

  return (
    <>
      <button
        type="button"
        className={styles.startButton}
        onClick={openStartModal}
      >
        도전 시작하기
      </button>

      {isOpen && (
        <Modal title="오늘의 도전을 시작할까요?" onClose={() => setIsOpen(false)}>
          <div className={styles.startModalContent}>
            <Image
              src={ggoggoPodium}
              alt=""
              width={180}
              className={styles.startModalImage}
            />
            <p>
              5문제를 모두 풀면 오늘의 랭킹에 기록돼요. 준비되면 바로
              시작해요.
            </p>
            <div className={styles.startModalActions}>
              <button
                type="button"
                className={styles.startModalGhostButton}
                onClick={() => setIsOpen(false)}
              >
                닫기
              </button>
              <SoundLink
                href="/challenge/play"
                className={styles.startModalStartButton}
              >
                시작하기
              </SoundLink>
            </div>
          </div>
        </Modal>
      )}
    </>
  );
}

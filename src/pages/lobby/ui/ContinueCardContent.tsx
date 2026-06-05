"use client";

import Image from "next/image";
import { useState } from "react";
import { ggoggoWalk } from "@/assets/mascot";
import type { MiniQuizStage } from "@/entities/mini-quiz";
import StageStartModal from "@/features/study-quiz/ui/StageStartModal";
import { playClickSound } from "@/shared/lib/sound/soundPlayer";
import { useSoundStore } from "@/shared/model/sound/soundStore";
import styles from "./ContinueCardContent.module.css";

interface ContinueCardContentProps {
  chapterNumber: number;
  href: string;
  progressPercent: number;
  stage: MiniQuizStage;
  stageNumber: string;
  stageTitle: string;
  totalProgressText: string;
}

export default function ContinueCardContent({
  chapterNumber,
  href,
  progressPercent,
  stage,
  stageNumber,
  stageTitle,
  totalProgressText,
}: ContinueCardContentProps) {
  const [isOpen, setIsOpen] = useState(false);
  const soundSettings = useSoundStore((state) => state.soundSettings);
  const isLocked = stage.status === "locked";
  const openStartModal = () => {
    playClickSound(soundSettings);
    setIsOpen(true);
  };

  return (
    <>
      <div className={styles.continueCard}>
        <button
          type="button"
          className={styles.mobileCardLink}
          aria-label={`${stageNumber} ${stageTitle} 이어하기`}
          onClick={openStartModal}
        />
        <div className={styles.continueInfo}>
          <div className={styles.stageInfo}>
            <p className={styles.stageNumber}>{stageNumber}</p>
            <h3 className={styles.stageTitle}>{stageTitle}</h3>
          </div>
          <div className={styles.progressActions}>
            <div className={styles.progressRow}>
              <div
                className={styles.progressTrack}
                role="progressbar"
                aria-label="스테이지 진행률"
                aria-valuemin={0}
                aria-valuemax={100}
                aria-valuenow={progressPercent}
              >
                <div
                  className={styles.progressFill}
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
              <span className={styles.progressText}>{totalProgressText}</span>
            </div>
            <button
              type="button"
              className={styles.continueButton}
              onClick={openStartModal}
            >
              이어하기
            </button>
          </div>
        </div>
        <Image
          src={ggoggoWalk}
          alt="ggoggo walking"
          width={230}
          className={styles.continueImage}
          priority
          fetchPriority="high"
          sizes="230px"
        />
      </div>
      {isOpen && (
        <StageStartModal
          chapterNumber={chapterNumber}
          isLocked={isLocked}
          onClose={() => setIsOpen(false)}
          stage={stage}
          stageNumber={stage.stageNumber}
          startButtonLabel="이어하기"
          startHref={href}
        />
      )}
    </>
  );
}

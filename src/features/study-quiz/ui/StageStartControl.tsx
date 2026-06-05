"use client";

import { useState } from "react";
import { CheckCircle2, LockKeyhole, PlayCircle } from "lucide-react";

import type {
  MiniQuizStage,
  StageStatus,
} from "@/entities/mini-quiz";
import { playClickSound } from "@/shared/lib/sound/soundPlayer";
import { useSoundStore } from "@/shared/model/sound/soundStore";
import StageStartModal from "./StageStartModal";
import styles from "./StageStartControl.module.css";

interface StageStartControlProps {
  chapterId: string;
  chapterTitle: string;
  chapterNumber: number;
  stage: MiniQuizStage;
  stageNumber: number;
}

const STATUS_LABELS = {
  completed: "완료했어요",
  available: "시작할 수 있어요",
  locked: "이전 스테이지를 완료하면 열려요",
} as const satisfies Record<StageStatus, string>;

const STATUS_ICONS = {
  completed: CheckCircle2,
  available: PlayCircle,
  locked: LockKeyhole,
} as const satisfies Record<StageStatus, typeof CheckCircle2>;

export default function StageStartControl({
  chapterId,
  chapterTitle,
  chapterNumber,
  stage,
  stageNumber,
}: StageStartControlProps) {
  const [isOpen, setIsOpen] = useState(false);
  const soundSettings = useSoundStore((state) => state.soundSettings);
  const StageIcon = STATUS_ICONS[stage.status];
  const isLocked = stage.status === "locked";
  const startHref = `/study/${chapterId}/${stage.id}`;
  const handleOpenStage = () => {
    playClickSound(soundSettings);
    setIsOpen(true);
  };

  return (
    <>
      <button
        type="button"
        className={styles.stageNode}
        data-status={stage.status}
        aria-label={`${chapterTitle} ${stage.title}: ${STATUS_LABELS[stage.status]}`}
        onClick={handleOpenStage}
      >
        <span className={styles.stageBadge}>
          <StageIcon size={22} aria-hidden="true" />
        </span>
        <span className={styles.stageContent}>
          <span className={styles.stageStep}>Stage {stageNumber}</span>
          <strong>{stage.title}</strong>
          <code>{stage.command}</code>
          <span
            className={styles.stageStars}
            aria-label={`별 ${stage.starCount}개`}
          >
            {Array.from({ length: 3 }, (_, index) => (
              <span
                key={index}
                data-filled={index < stage.starCount ? "true" : "false"}
                aria-hidden="true"
              >
                ★
              </span>
            ))}
          </span>
        </span>
      </button>

      {isOpen && (
        <StageStartModal
          chapterNumber={chapterNumber}
          isLocked={isLocked}
          onClose={() => setIsOpen(false)}
          stage={stage}
          stageNumber={stageNumber}
          startButtonLabel={
            stage.status === "completed" ? "다시 풀기" : "시작하기"
          }
          startHref={startHref}
        />
      )}
    </>
  );
}

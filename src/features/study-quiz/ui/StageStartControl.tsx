"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { CheckCircle2, LockKeyhole, PlayCircle } from "lucide-react";

import { Modal } from "@/shared/ui/modal";
import { ggoggoAdventure } from "@/assets/mascot";
import type {
  MiniQuizStage,
  StageStatus,
} from "@/entities/mini-quiz";
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
  const StageIcon = STATUS_ICONS[stage.status];
  const isLocked = stage.status === "locked";
  const startHref = `/study/${chapterId}/${stage.id}`;

  return (
    <>
      <button
        type="button"
        className={styles.stageNode}
        data-status={stage.status}
        aria-label={`${chapterTitle} ${stage.title}: ${STATUS_LABELS[stage.status]}`}
        onClick={() => setIsOpen(true)}
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
        <Modal
          title={isLocked ? "아직 열리지 않았어요" : "스테이지를 시작해요"}
          onClose={() => setIsOpen(false)}
        >
          <div className={styles.stageModalContent}>
            <div className={styles.stageModalText}>
              <p className={styles.stageModalStep}>
                Chapter {chapterNumber} · Stage {stageNumber}
              </p>
              <h3>{stage.title}</h3>
            </div>
            <Image
              src={ggoggoAdventure}
              alt=""
              width={180}
              height={150}
              className={styles.stageModalImage}
            />
            <p className={styles.stageModalDescription}>{stage.description}</p>
            <div className={styles.stageModalTableWrap}>
              <table className={styles.stageModalTable}>
                <thead>
                  <tr>
                    <th scope="col">핵심 명령어</th>
                    <th scope="col">문제 수</th>
                    <th scope="col">클리어 조건</th>
                    <th scope="col">에너지</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>{stage.command}</td>
                    <td>5문제</td>
                    <td>3문제</td>
                    <td>번개 3개</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <p className={styles.stageModalPrompt}>
              {isLocked
                ? "이전 스테이지를 먼저 완료하면 열려요."
                : "준비되면 바로 시작해요."}
            </p>
            <div className={styles.stageModalActions}>
              <button
                type="button"
                className={styles.stageModalGhostButton}
                onClick={() => setIsOpen(false)}
              >
                닫기
              </button>
              {!isLocked && (
                <Link className={styles.stageModalStartButton} href={startHref}>
                  {stage.status === "completed" ? "다시 풀기" : "시작하기"}
                </Link>
              )}
            </div>
          </div>
        </Modal>
      )}
    </>
  );
}

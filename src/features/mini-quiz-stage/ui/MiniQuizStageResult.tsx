import Image from "next/image";
import Link from "next/link";
import { RotateCcw } from "lucide-react";

import { ggoggoCheck } from "@/assets/mascot";
import styles from "./MiniQuizStageClient.module.css";

interface MiniQuizStageResultProps {
  chapterNumber: number;
  correctCount: number;
  energy: number;
  isCleared: boolean;
  onRetry: () => void;
  questionCount: number;
  resultPercent: number;
  stageNumber: number;
  stageTitle: string;
  starCount: number;
}

export default function MiniQuizStageResult({
  chapterNumber,
  correctCount,
  energy,
  isCleared,
  onRetry,
  questionCount,
  resultPercent,
  stageNumber,
  stageTitle,
  starCount,
}: MiniQuizStageResultProps) {
  return (
    <div className={styles.quizPage}>
      <section className={styles.resultPanel} aria-labelledby="result-title">
        <div className={styles.resultHero}>
          <div className={styles.resultText}>
            <p className={styles.eyebrow}>
              Chapter {chapterNumber} · Stage {stageNumber}
            </p>
            <h1 id="result-title">
              {isCleared ? "스테이지를 클리어했어요!" : "다시 도전해봐요"}
            </h1>
            <p>{stageTitle}</p>
          </div>
          <Image
            src={ggoggoCheck}
            alt=""
            width={180}
            height={160}
            className={styles.resultMascot}
            priority
          />
        </div>

        <div className={styles.resultScore}>
          <div className={styles.resultStars} aria-label={`별 ${starCount}개`}>
            {Array.from({ length: 3 }, (_, index) => (
              <span
                key={index}
                data-filled={index < starCount ? "true" : "false"}
                aria-hidden="true"
              >
                ★
              </span>
            ))}
          </div>
          <div className={styles.resultMetrics}>
            <div>
              <span>정답</span>
              <strong>
                {correctCount} / {questionCount}
              </strong>
            </div>
            <div>
              <span>점수</span>
              <strong>{resultPercent}점</strong>
            </div>
            <div>
              <span>남은 번개</span>
              <strong>{energy}개</strong>
            </div>
          </div>
          <p>
            {isCleared
              ? "별을 모았어요. 더 높은 별을 노려 다시 풀 수도 있어요."
              : "3문제 이상 맞히면 별을 받을 수 있어요."}
          </p>
        </div>

        <div className={styles.resultActions}>
          <button
            type="button"
            className={styles.secondaryButton}
            onClick={onRetry}
          >
            <RotateCcw size={18} aria-hidden="true" />
            다시 풀기
          </button>
          <Link href="/study" className={styles.primaryLink}>
            스테이지 선택으로
          </Link>
        </div>
      </section>
    </div>
  );
}

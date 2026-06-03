import Image from "next/image";
import Link from "next/link";

import { ggoggoCheck } from "@/assets/mascot";
import { formatElapsedTime } from "../model/quizUtils";
import styles from "./ChallengeQuizClient.module.css";

interface ChallengeQuizResultProps {
  correctCount: number;
  elapsedMs: number;
  questionCount: number;
  score: number;
}

export default function ChallengeQuizResult({
  correctCount,
  elapsedMs,
  questionCount,
  score,
}: ChallengeQuizResultProps) {
  return (
    <div className={styles.challengeQuizPage}>
      <section className={styles.resultPanel} aria-labelledby="result-title">
        <div className={styles.resultHero}>
          <div className={styles.resultText}>
            <p className={styles.eyebrow}>Challenge · 오늘의 미니 퀴즈</p>
            <h1 id="result-title">오늘의 도전을 마쳤어요!</h1>
            <p>오늘의 랭킹에 기록됐어요.</p>
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

        <div className={styles.resultMetrics}>
          <div>
            <span>정답</span>
            <strong>
              {correctCount} / {questionCount}
            </strong>
          </div>
          <div>
            <span>풀이 시간</span>
            <strong>{formatElapsedTime(elapsedMs)}</strong>
          </div>
          <div>
            <span>점수</span>
            <strong>{score}점</strong>
          </div>
        </div>

        <Link href="/challenge#ranking" className={styles.primaryLink}>
          오늘의 랭킹 확인하기
        </Link>
      </section>
    </div>
  );
}

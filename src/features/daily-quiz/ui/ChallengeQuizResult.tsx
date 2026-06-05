import Image from "next/image";

import { ggoggoCheck } from "@/assets/mascot";
import { SoundLink } from "@/shared/ui/sound-link";
import { formatElapsedTime } from "../model/quizUtils";
import styles from "./ChallengeQuizResult.module.css";
import { useChallengeQuizContext } from "./ChallengeQuizProvider";

export default function ChallengeQuizResult() {
  const { correctCount, elapsedMs, questionCount, result, score } =
    useChallengeQuizContext();
  const resultMessage = result?.rankingEligible
    ? result.earnedBeans > 0 || result.streakIncremented
      ? "오늘의 랭킹에 기록되고 보상이 지급됐어요."
      : "오늘의 랭킹에 기록됐어요."
    : result?.alreadyCompleted
      ? "오늘은 이미 기록을 남겼어요. 이번 도전은 결과만 확인해요."
      : "게스트 결과는 저장하지 않아요. 로그인하면 랭킹에 도전할 수 있어요.";

  return (
    <div className={styles.challengeQuizPage}>
      <section className={styles.resultPanel} aria-labelledby="result-title">
        <div className={styles.resultHero}>
          <div className={styles.resultText}>
            <p className={styles.eyebrow}>Challenge · 오늘의 미니 퀴즈</p>
            <h1 id="result-title">오늘의 도전을 마쳤어요!</h1>
            <p>{resultMessage}</p>
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

        <SoundLink href="/challenge#ranking" className={styles.primaryLink}>
          오늘의 랭킹 확인하기
        </SoundLink>
      </section>
    </div>
  );
}

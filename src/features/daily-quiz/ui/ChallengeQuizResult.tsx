import Image from "next/image";
import { useEffect, useState } from "react";

import { AuthRequiredModal } from "@/features/auth";
import { useCurrentUserStore } from "@/entities/user";
import { trackEvent } from "@/shared/lib/analytics";
import { SoundLink } from "@/shared/ui/sound-link";
import { ggoggoCheck } from "@/assets/mascot";

import { formatElapsedTime } from "../model/quizUtils";
import styles from "./ChallengeQuizResult.module.css";
import { useChallengeQuizContext } from "./ChallengeQuizProvider";

export default function ChallengeQuizResult() {
  const { correctCount, elapsedMs, questionCount, result, score } =
    useChallengeQuizContext();
  const authRole = useCurrentUserStore((state) => state.currentUser.authRole);
  const [isAuthModalDismissed, setIsAuthModalDismissed] = useState(false);
  const isAnonymous = authRole === "anonymous";
  const isAuthModalOpen = isAnonymous && !isAuthModalDismissed;
  const resultMessage = isAnonymous
    ? "지금 결과는 저장되지 않았어요. 로그인하면 랭킹에 도전할 수 있어요."
    : result?.rankingEligible
    ? result.earnedBeans > 0 || result.streakIncremented
      ? "오늘의 랭킹에 기록되고 보상이 지급됐어요."
      : "오늘의 랭킹에 기록됐어요."
    : result?.alreadyCompleted
      ? "오늘은 이미 기록을 남겼어요. 이번 도전은 결과만 확인해요."
      : "지금 결과는 저장되지 않았어요. 로그인하면 랭킹에 도전할 수 있어요.";

  useEffect(() => {
    if (!isAuthModalOpen) {
      return;
    }

    trackEvent("anonymous_save_prompt_auto_shown", {
      source: "challenge",
    });
  }, [isAuthModalOpen]);

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

        <div className={styles.resultActions}>
          <SoundLink href="/challenge#ranking" className={styles.primaryLink}>
            오늘의 랭킹 확인하기
          </SoundLink>
        </div>
      </section>
      {isAuthModalOpen && (
        <AuthRequiredModal
          title="로그인하면 기록을 저장할 수 있어요"
          description="지금 결과는 저장되지 않아요. 로그인하면 오늘의 챌린지 결과와 랭킹 기록을 저장할 수 있어요."
          reason="save_progress"
          source="challenge"
          onClose={() => setIsAuthModalDismissed(true)}
        />
      )}
    </div>
  );
}

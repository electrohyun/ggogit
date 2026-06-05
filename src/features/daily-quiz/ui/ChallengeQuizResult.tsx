import Image from "next/image";
import { useState } from "react";

import { ggoggoCheck } from "@/assets/mascot";
import { useCurrentUserStore } from "@/entities/user";
import { AuthRequiredModal } from "@/features/auth";
import { trackEvent } from "@/shared/lib/analytics";
import { SoundLink } from "@/shared/ui/sound-link";
import { formatElapsedTime } from "../model/quizUtils";
import styles from "./ChallengeQuizResult.module.css";
import { useChallengeQuizContext } from "./ChallengeQuizProvider";

export default function ChallengeQuizResult() {
  const { correctCount, elapsedMs, questionCount, result, score } =
    useChallengeQuizContext();
  const authRole = useCurrentUserStore((state) => state.currentUser.authRole);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const isAnonymous = authRole === "anonymous";
  const resultMessage = isAnonymous
    ? "지금 결과는 저장되지 않았어요. 로그인하면 랭킹에 도전할 수 있어요."
    : result?.rankingEligible
    ? result.earnedBeans > 0 || result.streakIncremented
      ? "오늘의 랭킹에 기록되고 보상이 지급됐어요."
      : "오늘의 랭킹에 기록됐어요."
    : result?.alreadyCompleted
      ? "오늘은 이미 기록을 남겼어요. 이번 도전은 결과만 확인해요."
      : "게스트 결과는 저장하지 않아요. 로그인하면 랭킹에 도전할 수 있어요.";

  const handleSavePrompt = () => {
    trackEvent("anonymous_save_attempt", {
      source: "challenge",
    });
    setIsAuthModalOpen(true);
  };

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
          {isAnonymous && (
            <button
              type="button"
              className={styles.primaryButton}
              onClick={handleSavePrompt}
            >
              기록 저장하기
            </button>
          )}
          <SoundLink href="/challenge#ranking" className={styles.primaryLink}>
            오늘의 랭킹 확인하기
          </SoundLink>
        </div>
      </section>
      {isAuthModalOpen && (
        <AuthRequiredModal
          title="로그인해야 기록을 저장할 수 있어요"
          description="게스트로 시작하거나 로그인하면 오늘의 챌린지 결과와 랭킹 기록을 저장할 수 있어요."
          reason="save_progress"
          source="challenge"
          onClose={() => setIsAuthModalOpen(false)}
        />
      )}
    </div>
  );
}

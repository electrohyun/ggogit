import Image from "next/image";
import { Bean } from "lucide-react";

import { Modal } from "@/shared/ui/modal";
import { ggoggoThumbsUp } from "@/assets/mascot";
import { stageStreak } from "@/assets/stats";

import { useChallengeQuizContext } from "./ChallengeQuizProvider";
import styles from "./ChallengeQuizRewardModal.module.css";

export default function ChallengeQuizRewardModal() {
  const {
    closeRewardModal,
    isRewardModalOpen,
    result,
    rewardModalKind,
  } = useChallengeQuizContext();

  if (!isRewardModalOpen || !result) {
    return null;
  }

  if (rewardModalKind === "beans") {
    return (
      <Modal title="콩을 받았어요!" onClose={closeRewardModal}>
        <div className={styles.rewardModalContent} data-kind="beans">
          <div className={styles.visualStage}>
            <Image
              src={ggoggoThumbsUp}
              alt=""
              width={150}
              height={150}
              className={styles.mascotImage}
            />
            <div className={styles.beanBurst} aria-hidden="true">
              <span className={styles.beanIcon}>
                <Bean size={30} strokeWidth={2.4} />
              </span>
              <span className={styles.beanIcon}>
                <Bean size={22} strokeWidth={2.4} />
              </span>
              <span className={styles.beanIcon}>
                <Bean size={18} strokeWidth={2.4} />
              </span>
            </div>
          </div>
          <div className={styles.rewardText}>
            <p>오늘의 퀴즈 랭킹 반영 보상</p>
            <strong>
              <Bean size={28} strokeWidth={2.4} aria-hidden="true" />
              +{result.earnedBeans}
            </strong>
          </div>
        </div>
      </Modal>
    );
  }

  return (
    <Modal title="연속 학습 갱신!" onClose={closeRewardModal}>
      <div className={styles.rewardModalContent} data-kind="streak">
        <div className={styles.visualStage}>
          <Image
            src={stageStreak}
            alt=""
            width={128}
            height={128}
            className={styles.streakImage}
          />
        </div>
        <div className={styles.rewardText}>
          <p>오늘의 퀴즈로 학습 기록을 이어갔어요.</p>
          <strong>+1일</strong>
        </div>
      </div>
    </Modal>
  );
}


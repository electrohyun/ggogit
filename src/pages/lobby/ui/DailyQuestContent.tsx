"use client";

import styles from "./DailyQuestContent.module.css";
import type { DailyQuest } from "@/entities/daily-quest";
import {
  claimDailyQuestRewardsAction,
  type ClaimDailyQuestRewardsState,
} from "@/features/daily-quest/api/dailyQuest.actions";
import { playSuccessSound } from "@/shared/lib/sound/soundPlayer";
import { useSoundStore } from "@/shared/model/sound/soundStore";
import { BeanIcon, CheckCircleIcon, CircleIcon } from "lucide-react";
import { useActionState, useEffect, useRef } from "react";

interface DailyQuestContentProps {
  isAuthenticated: boolean;
  quests: DailyQuest[];
}

const INITIAL_CLAIM_STATE: ClaimDailyQuestRewardsState = {
  earnedBeans: 0,
  message: null,
  success: false,
};

export default function DailyQuestContent({
  isAuthenticated,
  quests,
}: DailyQuestContentProps) {
  const [claimState, claimAction, isClaimPending] = useActionState(
    claimDailyQuestRewardsAction,
    INITIAL_CLAIM_STATE,
  );
  const previousClaimStateRef = useRef(claimState);
  const soundSettings = useSoundStore((state) => state.soundSettings);
  const claimableReward = quests.reduce(
    (sum, quest) => (quest.status === "completed" ? sum + quest.reward : sum),
    0,
  );
  const isClaimDisabled =
    !isAuthenticated || claimableReward === 0 || isClaimPending;
  const buttonLabel = isAuthenticated
    ? isClaimPending
      ? "받는 중"
      : claimableReward > 0
      ? "보상 받기"
      : "데일리 퀘스트 완료!"
    : "로그인 후 받기";

  useEffect(() => {
    if (
      previousClaimStateRef.current !== claimState &&
      claimState.success &&
      claimState.earnedBeans > 0
    ) {
      playSuccessSound(soundSettings);
    }

    previousClaimStateRef.current = claimState;
  }, [claimState, soundSettings]);

  return (
    <div className={styles.dailyQuestCard}>
      <div className={styles.dailyQuestList}>
        {quests.map((quest) => {
          const isInProgress = quest.status === "inProgress";
          const StatusIcon = isInProgress ? CircleIcon : CheckCircleIcon;

          return (
            <div
              key={quest.id}
              className={styles.dailyQuestItem}
              data-status={quest.status}
            >
              <StatusIcon
                size={20}
                color={isInProgress ? "gray" : "#4CAF50"}
              />
              <div className={styles.questContainer}>
                <p className={styles.questContent}>{quest.title}</p>
                <p className={styles.progress}>
                  {quest.currentProgress}/{quest.targetProgress}
                </p>
              </div>
              <div className={styles.rewardContainer}>
                <BeanIcon size={16} fill="#80DD68" />
                <span>+{quest.reward}</span>
              </div>
              {quest.status === "claimed" && (
                <span className={styles.claimedOverlay}>수령 완료</span>
              )}
            </div>
          );
        })}
      </div>
      <form action={claimAction} className={styles.receiveForm}>
        <button className={styles.receiveButton} disabled={isClaimDisabled}>
          <span>{buttonLabel}</span>
        </button>
      </form>
      {claimState.message && (
        <p className={styles.claimMessage} data-success={claimState.success}>
          {claimState.message}
        </p>
      )}
    </div>
  );
}

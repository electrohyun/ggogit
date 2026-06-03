import styles from "./DailyQuestContent.module.css";
import type { DailyQuest } from "@/entities/daily-quest";
import { BeanIcon, CheckCircleIcon, CircleIcon } from "lucide-react";

const DAILY_QUESTS = [
  {
    id: "clear-stages",
    title: "스테이지 3회 완료하기",
    currentProgress: 3,
    targetProgress: 3,
    reward: 20,
    status: "completed",
  },
  {
    id: "daily-quiz",
    title: "오늘의 퀴즈 해결하기",
    currentProgress: 0,
    targetProgress: 1,
    reward: 30,
    status: "inProgress",
  },
  {
    id: "random-quiz",
    title: "랜덤 문제 10개 풀기",
    currentProgress: 10,
    targetProgress: 10,
    reward: 50,
    status: "claimed",
  },
] as const satisfies readonly DailyQuest[];

const CLAIMABLE_REWARD = DAILY_QUESTS.reduce(
  (sum, quest) => (quest.status === "completed" ? sum + quest.reward : sum),
  0
);

export default function DailyQuestContent() {
  return (
    <div className={styles.dailyQuestCard}>
      <div className={styles.dailyQuestList}>
        {DAILY_QUESTS.map((quest) => {
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
                <span>{quest.reward}</span>
              </div>
              {quest.status === "claimed" && (
                <span className={styles.claimedOverlay}>완료!</span>
              )}
            </div>
          );
        })}
      </div>
      <button className={styles.receiveButton}>
        <span>모두 받기</span>
        <div className={styles.beanContainer}>
          <BeanIcon size={16} fill="#80DD68" />
          <span>{CLAIMABLE_REWARD}</span>
        </div>
      </button>
    </div>
  );
}

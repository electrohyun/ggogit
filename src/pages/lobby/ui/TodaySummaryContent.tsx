import { BookOpen, TimerIcon, TrophyIcon } from "lucide-react";

import styles from "./TodaySummaryContent.module.css";

interface TodaySummaryContentProps {
  challengeCompleted: boolean;
  joinedDayCount: number;
  learnedStageCount: number;
}

export default function TodaySummaryContent({
  challengeCompleted,
  joinedDayCount,
  learnedStageCount,
}: TodaySummaryContentProps) {
  const summaryItems = [
    {
      id: "learned-stages",
      label: "학습한 스테이지",
      value: String(learnedStageCount),
      icon: BookOpen,
    },
    {
      id: "challenge-completed",
      label: "오늘의 챌린지",
      value: challengeCompleted ? "완료" : "미완료",
      icon: TrophyIcon,
    },
    {
      id: "joined-days",
      label: "함께한 날",
      value: `${joinedDayCount}일째`,
      icon: TimerIcon,
    },
  ] as const;

  return (
    <div className={styles.todaySummaryCard}>
      <div className={styles.todaySummaryCardContent}>
        {summaryItems.map((item) => {
          const Icon = item.icon;

          return (
            <div key={item.id} className={styles.summaryItem}>
              <div className={styles.summaryKind}>
                <Icon size={32} />
                <p>{item.label}</p>
              </div>
              <p>{item.value}</p>
            </div>
          );
        })}
      </div>
      <div className={styles.todaySummaryFooter}></div>
    </div>
  );
}

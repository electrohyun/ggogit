import { BookOpen, TimerIcon, TrophyIcon } from "lucide-react";
import styles from "./TodaySummaryContent.module.css";

const TODAY_SUMMARY_ITEMS = [
  {
    id: "learned-stages",
    label: "학습한 스테이지",
    value: "3",
    icon: BookOpen,
  },
  {
    id: "completed-missions",
    label: "완료한 미션",
    value: "12",
    icon: TrophyIcon,
  },
  {
    id: "study-time",
    label: "학습 시간",
    value: "1h 32m",
    icon: TimerIcon,
  },
] as const;

export default function TodaySummaryContent() {
  return (
    <div className={styles.todaySummaryCard}>
      <div className={styles.todaySummaryCardContent}>
        {TODAY_SUMMARY_ITEMS.map((item) => {
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

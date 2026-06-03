import Image from "next/image";
import { ggoggoGreet } from "@/assets/mascot";
import styles from "./StreakCardContent.module.css";

const STREAK_DAYS = [
  { label: "월", status: "missed" },
  { label: "화", status: "completed" },
  { label: "수", status: "completed" },
  { label: "목", status: "completed" },
  { label: "금", status: "today" },
  { label: "토", status: "completed" },
  { label: "일", status: "completed" },
] as const;

export default function StreakCardContent() {
  return (
    <div className={styles.streakCard}>
      <div className={styles.streakCardContent}>
        <div className={styles.streakInfo}>
          <div className={styles.streakCountContainer}>
            <p className={styles.streakCount}>6</p>
            <p>일</p>
          </div>
          <p className={styles.streakMessage}>연속 달성중! 🔥</p>
        </div>
        <Image src={ggoggoGreet} alt="ggoggo greet" width={120} />
      </div>
      <div className={styles.streakFooter}>
        {STREAK_DAYS.map((day) => (
          <div key={day.label} className={styles.dayItem}>
            <span className={`${styles.dayCircle} ${styles[day.status]}`}>
              {day.status !== "missed" && "🔥"}
            </span>
            <span className={styles.dayLabel}>{day.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

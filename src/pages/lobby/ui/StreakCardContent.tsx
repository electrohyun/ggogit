import Image from "next/image";
import { ggoggoGreet } from "@/assets/mascot";
import { stageStreak } from "@/assets/stats";
import styles from "./StreakCardContent.module.css";

type StreakDayStatus = "completed" | "today" | "missed" | "upcoming";

interface StreakCardContentProps {
  currentStreakDays: number;
  lastStudiedOn: string | null;
}

const DAY_LABELS = ["일", "월", "화", "수", "목", "금", "토"] as const;
const MS_PER_DAY = 1000 * 60 * 60 * 24;

const getDateKey = (date: Date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
};

const getStartOfDay = (date: Date) => {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
};

const getStreakDays = ({
  currentStreakDays,
  lastStudiedOn,
}: StreakCardContentProps) => {
  const today = getStartOfDay(new Date());
  const dayOfWeek = today.getDay();
  const weekStart = new Date(today);
  weekStart.setDate(today.getDate() - dayOfWeek);
  const lastStudiedDate = lastStudiedOn
    ? getStartOfDay(new Date(`${lastStudiedOn}T00:00:00`))
    : null;
  const lastStudiedDateKey = lastStudiedDate ? getDateKey(lastStudiedDate) : "";
  const daysSinceLastStudy = lastStudiedDate
    ? Math.floor((today.getTime() - lastStudiedDate.getTime()) / MS_PER_DAY)
    : null;
  const isBroken =
    currentStreakDays > 0 &&
    daysSinceLastStudy !== null &&
    daysSinceLastStudy > 1;
  const visibleStreakDays = isBroken ? 0 : currentStreakDays;
  const streakEndDate =
    lastStudiedDate && daysSinceLastStudy !== null && daysSinceLastStudy <= 1
      ? lastStudiedDate
      : null;
  const streakStartDate =
    streakEndDate && visibleStreakDays > 0
      ? new Date(
          streakEndDate.getFullYear(),
          streakEndDate.getMonth(),
          streakEndDate.getDate() - visibleStreakDays + 1,
        )
      : null;

  const days = Array.from({ length: 7 }, (_, index) => {
    const date = new Date(weekStart);
    date.setDate(weekStart.getDate() + index);
    const dateKey = getDateKey(date);
    const isFuture = date.getTime() > today.getTime();
    const isToday = dateKey === getDateKey(today);
    const isInCurrentStreak =
      streakStartDate !== null &&
      streakEndDate !== null &&
      date.getTime() >= streakStartDate.getTime() &&
      date.getTime() <= streakEndDate.getTime();
    const status: StreakDayStatus = isInCurrentStreak
      ? "completed"
      : isToday
        ? "today"
        : isFuture
          ? "upcoming"
          : "missed";

    return {
      dateKey,
      label: DAY_LABELS[date.getDay()],
      status,
    };
  });

  return {
    days,
    isBroken,
    isTodayStudied: lastStudiedDateKey === getDateKey(today),
    visibleStreakDays,
  };
};

export default function StreakCardContent({
  currentStreakDays,
  lastStudiedOn,
}: StreakCardContentProps) {
  const { days, isBroken, isTodayStudied, visibleStreakDays } = getStreakDays({
    currentStreakDays,
    lastStudiedOn,
  });
  const streakMessage = isBroken
    ? "스트릭이 끊겼어요..."
    : isTodayStudied
      ? "오늘 학습 완료!"
      : "오늘도 학습해요!";

  return (
    <div className={styles.streakCard}>
      <div className={styles.streakCardContent}>
        <div className={styles.streakInfo}>
          <div className={styles.streakCountContainer}>
            <p className={styles.streakCount}>{visibleStreakDays}</p>
            <p>일</p>
          </div>
          <p className={styles.streakMessage}>{streakMessage}</p>
        </div>
        <Image src={ggoggoGreet} alt="ggoggo greet" width={120} />
      </div>
      <div className={styles.streakFooter}>
        {days.map((day) => (
          <div key={day.dateKey} className={styles.dayItem}>
            <span className={`${styles.dayCircle} ${styles[day.status]}`}>
              <Image
                src={stageStreak}
                alt=""
                width={28}
                height={28}
                className={styles.flameImage}
              />
            </span>
            <span className={styles.dayLabel}>{day.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

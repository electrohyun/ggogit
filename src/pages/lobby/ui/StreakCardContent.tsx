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
const KST_TIME_ZONE = "Asia/Seoul";

const getDateKey = (date: Date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
};

const getDateFromKey = (dateKey: string) => {
  const [year = "0", month = "1", day = "1"] = dateKey.split("-");

  return new Date(Number(year), Number(month) - 1, Number(day));
};

const getKstDateKey = () => {
  const formatter = new Intl.DateTimeFormat("en-CA", {
    day: "2-digit",
    month: "2-digit",
    timeZone: KST_TIME_ZONE,
    year: "numeric",
  });
  const dateParts = formatter.formatToParts(new Date());
  const year = dateParts.find((part) => part.type === "year")?.value ?? "";
  const month = dateParts.find((part) => part.type === "month")?.value ?? "";
  const day = dateParts.find((part) => part.type === "day")?.value ?? "";

  return `${year}-${month}-${day}`;
};

const getStartOfDay = (date: Date) => {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
};

const getStreakDays = ({
  currentStreakDays,
  lastStudiedOn,
}: StreakCardContentProps) => {
  const today = getStartOfDay(getDateFromKey(getKstDateKey()));
  const dayOfWeek = today.getDay();
  const weekStart = new Date(today);
  weekStart.setDate(today.getDate() - dayOfWeek);
  const lastStudiedDate = lastStudiedOn
    ? getStartOfDay(getDateFromKey(lastStudiedOn))
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
        <Image
          src={ggoggoGreet}
          alt="ggoggo greet"
          width={120}
          priority
          sizes="120px"
        />
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

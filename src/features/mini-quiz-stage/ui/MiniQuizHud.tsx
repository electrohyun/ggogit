import { Clock3, Zap } from "lucide-react";

import { useMiniQuizStageContext } from "./MiniQuizStageProvider";
import styles from "./MiniQuizHud.module.css";

export default function MiniQuizHud() {
  const { displayTimeLeft, energy, timeLeftMs, timeLimitMs, timerPercent } =
    useMiniQuizStageContext();

  return (
    <div className={styles.quizHud} aria-label="퀴즈 상태">
      <div className={styles.energyMeter} aria-label={`남은 번개 ${energy}개`}>
        {Array.from({ length: 3 }, (_, index) => (
          <Zap
            key={index}
            size={22}
            aria-hidden="true"
            data-active={index < energy}
          />
        ))}
      </div>
      <div
        className={styles.timerTrack}
        role="progressbar"
        aria-label="남은 시간"
        aria-valuemin={0}
        aria-valuemax={timeLimitMs}
        aria-valuenow={timeLeftMs}
      >
        <div className={styles.timerFill} style={{ width: `${timerPercent}%` }} />
      </div>
      <span className={styles.timeChip}>
        <Clock3 size={18} aria-hidden="true" />
        {displayTimeLeft}초
      </span>
    </div>
  );
}

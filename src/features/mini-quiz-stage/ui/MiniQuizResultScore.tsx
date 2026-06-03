import { useMiniQuizStageContext } from "./MiniQuizStageProvider";
import styles from "./MiniQuizResultScore.module.css";

export default function MiniQuizResultScore() {
  const {
    correctCount,
    energy,
    isCleared,
    questionCount,
    resultPercent,
    starCount,
  } = useMiniQuizStageContext();

  return (
    <div className={styles.resultScore}>
      <div className={styles.resultStars} aria-label={`별 ${starCount}개`}>
        {Array.from({ length: 3 }, (_, index) => (
          <span
            key={index}
            data-filled={index < starCount ? "true" : "false"}
            aria-hidden="true"
          >
            ★
          </span>
        ))}
      </div>
      <div className={styles.resultMetrics}>
        <div>
          <span>정답</span>
          <strong>
            {correctCount} / {questionCount}
          </strong>
        </div>
        <div>
          <span>점수</span>
          <strong>{resultPercent}점</strong>
        </div>
        <div>
          <span>남은 번개</span>
          <strong>{energy}개</strong>
        </div>
      </div>
      <p>
        {isCleared
          ? "별을 모았어요. 더 높은 별을 노려 다시 풀 수도 있어요."
          : "3문제 이상 맞히면 별을 받을 수 있어요."}
      </p>
    </div>
  );
}

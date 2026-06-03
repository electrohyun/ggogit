import { useMiniQuizStageContext } from "./MiniQuizStageProvider";
import styles from "./MiniQuizFeedback.module.css";

export default function MiniQuizFeedback() {
  const { currentQuestion, isCorrect, isFeedback } = useMiniQuizStageContext();

  if (!isFeedback) {
    return null;
  }

  return (
    <div className={styles.feedbackBox} data-correct={isCorrect}>
      <strong>{isCorrect ? "정답이에요!" : "아쉬워요!"}</strong>
      <p>{currentQuestion.explanation}</p>
    </div>
  );
}

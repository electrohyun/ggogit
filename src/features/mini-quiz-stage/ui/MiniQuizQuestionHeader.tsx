import { useMiniQuizStageContext } from "./MiniQuizStageProvider";
import styles from "./MiniQuizQuestionHeader.module.css";

export default function MiniQuizQuestionHeader() {
  const {
    chapterNumber,
    currentIndex,
    currentQuestion,
    progressPercent,
    questionCount,
    stageNumber,
  } = useMiniQuizStageContext();

  return (
    <div className={styles.questionHeader}>
      <p className={styles.eyebrow}>
        Chapter {chapterNumber} · Stage {stageNumber}
      </p>
      <div
        className={styles.progressTrack}
        role="progressbar"
        aria-label="문제 진행률"
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={progressPercent}
      >
        <div
          className={styles.progressFill}
          style={{ width: `${progressPercent}%` }}
        />
      </div>
      <span className={styles.progressCount}>
        {currentIndex + 1} / {questionCount}
      </span>
      <h1 id="question-title">{currentQuestion.question}</h1>
    </div>
  );
}

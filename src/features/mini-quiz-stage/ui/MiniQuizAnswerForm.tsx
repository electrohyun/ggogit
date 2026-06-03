import {
  CheckCircle2,
  Circle,
  CircleCheck,
  XCircle,
} from "lucide-react";

import { useMiniQuizStageContext } from "./MiniQuizStageProvider";
import styles from "./MiniQuizAnswerForm.module.css";

export default function MiniQuizAnswerForm() {
  const {
    commandAnswer,
    currentQuestion,
    isFeedback,
    selectedAnswer,
    setCommandAnswer,
    submittedAnswer,
    selectAnswer,
  } = useMiniQuizStageContext();

  if (currentQuestion.type === "command") {
    return (
      <label className={styles.commandAnswer}>
        <span>명령어 입력</span>
        <input
          value={commandAnswer}
          placeholder={currentQuestion.placeholder}
          disabled={isFeedback}
          onChange={(event) => setCommandAnswer(event.target.value)}
        />
      </label>
    );
  }

  if (!currentQuestion.options) {
    return null;
  }

  return (
    <div className={styles.optionGrid}>
      {currentQuestion.options.map((option) => {
        const isSelected = selectedAnswer === option;
        const isAnswer = currentQuestion.answer === option;
        const status =
          submittedAnswer && isAnswer
            ? "correct"
            : submittedAnswer && isSelected
              ? "wrong"
              : isSelected
                ? "selected"
                : "idle";

        return (
          <button
            key={option}
            type="button"
            className={styles.optionButton}
            data-status={status}
            disabled={isFeedback}
            onClick={() => selectAnswer(option)}
          >
            <span className={styles.optionIcon}>
              {submittedAnswer ? (
                isAnswer ? (
                  <CheckCircle2 size={20} aria-hidden="true" />
                ) : isSelected ? (
                  <XCircle size={20} aria-hidden="true" />
                ) : (
                  <Circle size={20} aria-hidden="true" />
                )
              ) : isSelected ? (
                <CircleCheck size={20} aria-hidden="true" />
              ) : (
                <Circle size={20} aria-hidden="true" />
              )}
            </span>
            <span>{option}</span>
          </button>
        );
      })}
    </div>
  );
}

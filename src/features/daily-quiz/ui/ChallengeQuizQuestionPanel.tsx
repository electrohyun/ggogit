import Image from "next/image";
import Link from "next/link";
import {
  ArrowLeft,
  CheckCircle2,
  Circle,
  CircleCheck,
  Clock3,
  Send,
  Sparkles,
  XCircle,
} from "lucide-react";

import { ggoggoThumbsUp } from "@/assets/mascot";
import { formatElapsedTime, normalizeCommand } from "../model/quizUtils";
import styles from "./ChallengeQuizQuestionPanel.module.css";
import { useChallengeQuizContext } from "./ChallengeQuizProvider";

export default function ChallengeQuizQuestionPanel() {
  const {
    commandAnswer,
    correctAnswer,
    currentIndex,
    currentQuestion,
    elapsedMs,
    errorMessage,
    isCorrect,
    isFeedback,
    isPending,
    progressPercent,
    questionCount,
    selectedAnswer,
    setCommandAnswer,
    submittedAnswer,
    goNext,
    selectAnswer,
    submitAnswer,
  } = useChallengeQuizContext();

  return (
    <div className={styles.challengeQuizPage}>
      <Link href="/challenge" className={styles.backLink}>
        <ArrowLeft size={18} aria-hidden="true" />
        도전 화면으로
      </Link>

      <section className={styles.questionPanel} aria-labelledby="question-title">
        <div className={styles.questionHeader}>
          <p className={styles.eyebrow}>Challenge · 오늘의 미니 퀴즈</p>
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
          <span className={styles.elapsedChip}>
            <Clock3 size={18} aria-hidden="true" />
            {formatElapsedTime(elapsedMs)}
          </span>
          <h1 id="question-title">{currentQuestion.question}</h1>
        </div>

        <div className={styles.questionBody}>
          <div className={styles.questionDescription}>
            <Sparkles size={22} aria-hidden="true" />
            <p>{currentQuestion.description}</p>
          </div>
          <Image
            src={ggoggoThumbsUp}
            alt="응원하는 꼬꼬"
            width={150}
            className={styles.quizMascot}
            priority
          />
        </div>

        {currentQuestion.type === "mcq" && currentQuestion.options && (
          <div className={styles.optionGrid}>
            {currentQuestion.options.map((option) => {
              const isSelected = selectedAnswer === option.id;
              const isAnswer = correctAnswer === option.id;
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
                  key={option.id}
                  type="button"
                  className={styles.optionButton}
                  data-status={status}
                  disabled={isFeedback || isPending}
                  onClick={() => selectAnswer(option.id)}
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
                  <span>{option.text}</span>
                </button>
              );
            })}
          </div>
        )}

        {currentQuestion.type === "command" && (
          <label className={styles.commandAnswer}>
            <span>명령어 입력</span>
            <input
              value={commandAnswer}
              placeholder={currentQuestion.placeholder}
              disabled={isFeedback || isPending}
              onChange={(event) => setCommandAnswer(event.target.value)}
            />
          </label>
        )}

        {isFeedback && (
          <div className={styles.feedbackBox} data-correct={isCorrect}>
            <strong>{isCorrect ? "정답이에요!" : "아쉬워요!"}</strong>
            <p>{currentQuestion.explanation}</p>
          </div>
        )}

        {errorMessage && <p className={styles.errorMessage}>{errorMessage}</p>}

        <div className={styles.quizActions}>
          {isFeedback ? (
            <button
              type="button"
              className={styles.primaryButton}
              disabled={isPending}
              onClick={goNext}
            >
              {isPending
                ? "저장 중..."
                : currentIndex === questionCount - 1
                  ? "결과 보기"
                  : "다음 문제 풀기"}
            </button>
          ) : (
            <button
              type="button"
              className={styles.primaryButton}
              disabled={
                isPending ||
                (currentQuestion.type === "command"
                  ? normalizeCommand(commandAnswer).length === 0
                  : !selectedAnswer)
              }
              onClick={() =>
                submitAnswer(
                  currentQuestion.type === "command"
                    ? commandAnswer
                    : selectedAnswer
                )
              }
            >
              <Send size={18} aria-hidden="true" />
              {isPending ? "채점 중..." : "제출하기"}
            </button>
          )}
        </div>
      </section>
    </div>
  );
}

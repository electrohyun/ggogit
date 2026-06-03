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
  Zap,
} from "lucide-react";

import { ggoggoThumbsUp } from "@/assets/mascot";
import type { QuizQuestion } from "../model/types";
import { normalizeCommand } from "../model/quizUtils";
import styles from "./MiniQuizStageClient.module.css";

interface MiniQuizQuestionPanelProps {
  chapterNumber: number;
  commandAnswer: string;
  currentIndex: number;
  currentQuestion: QuizQuestion;
  displayTimeLeft: number;
  energy: number;
  isCorrect: boolean;
  isFeedback: boolean;
  onCommandAnswerChange: (answer: string) => void;
  onNext: () => void;
  onSelect: (answer: string) => void;
  onSubmit: (answer: string | null) => void;
  progressPercent: number;
  questionCount: number;
  selectedAnswer: string | null;
  stageNumber: number;
  submittedAnswer: string | null;
  timeLeftMs: number;
  timeLimitMs: number;
  timerPercent: number;
}

export default function MiniQuizQuestionPanel({
  chapterNumber,
  commandAnswer,
  currentIndex,
  currentQuestion,
  displayTimeLeft,
  energy,
  isCorrect,
  isFeedback,
  onCommandAnswerChange,
  onNext,
  onSelect,
  onSubmit,
  progressPercent,
  questionCount,
  selectedAnswer,
  stageNumber,
  submittedAnswer,
  timeLeftMs,
  timeLimitMs,
  timerPercent,
}: MiniQuizQuestionPanelProps) {
  return (
    <div className={styles.quizPage}>
      <Link href="/study" className={styles.backLink}>
        <ArrowLeft size={18} aria-hidden="true" />
        스테이지 선택으로
      </Link>

      <section className={styles.questionPanel} aria-labelledby="question-title">
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
            <div
              className={styles.timerFill}
              style={{ width: `${timerPercent}%` }}
            />
          </div>
          <span className={styles.timeChip}>
            <Clock3 size={18} aria-hidden="true" />
            {displayTimeLeft}초
          </span>
        </div>

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
                  onClick={() => onSelect(option)}
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
        )}

        {currentQuestion.type === "command" && (
          <label className={styles.commandAnswer}>
            <span>명령어 입력</span>
            <input
              value={commandAnswer}
              placeholder={currentQuestion.placeholder}
              disabled={isFeedback}
              onChange={(event) => onCommandAnswerChange(event.target.value)}
            />
          </label>
        )}

        {isFeedback && (
          <div className={styles.feedbackBox} data-correct={isCorrect}>
            <strong>{isCorrect ? "정답이에요!" : "아쉬워요!"}</strong>
            <p>{currentQuestion.explanation}</p>
          </div>
        )}

        <div className={styles.quizActions}>
          {isFeedback ? (
            <button
              type="button"
              className={styles.primaryButton}
              onClick={onNext}
            >
              {currentIndex === questionCount - 1 ? "결과 보기" : "다음 문제 풀기"}
            </button>
          ) : (
            <button
              type="button"
              className={styles.primaryButton}
              disabled={
                currentQuestion.type === "command"
                  ? normalizeCommand(commandAnswer).length === 0
                  : !selectedAnswer
              }
              onClick={() =>
                onSubmit(
                  currentQuestion.type === "command"
                    ? commandAnswer
                    : selectedAnswer
                )
              }
            >
              <Send size={18} aria-hidden="true" />
              제출하기
            </button>
          )}
        </div>
      </section>
    </div>
  );
}

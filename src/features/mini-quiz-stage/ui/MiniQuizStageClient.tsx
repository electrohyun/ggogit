"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  Clock3,
  CheckCircle2,
  Circle,
  CircleCheck,
  RotateCcw,
  Send,
  Sparkles,
  Zap,
  XCircle,
} from "lucide-react";

import Modal from "@/shared/ui/modal/Modal";
import ggoggoCheck from "@/assets/ggoggo_check1.webp";
import ggoggoHuk from "@/assets/ggoggo_huk2.webp";
import ggoggoThumbsUp from "@/assets/ggoggo_thumbs_up.webp";
import type {
  MiniQuizChapter,
  MiniQuizStage,
} from "@/features/study-quiz/mock/miniQuizContent";
import styles from "./page.module.css";

interface QuizQuestion {
  id: string;
  type: "mcq" | "command";
  question: string;
  description: string;
  options?: string[];
  placeholder?: string;
  answer: string;
  explanation: string;
}

interface MiniQuizStageClientProps {
  chapter: MiniQuizChapter;
  stage: MiniQuizStage;
  chapterNumber: number;
  stageNumber: number;
}

function buildQuizQuestions(
  chapter: MiniQuizChapter,
  stage: MiniQuizStage
): QuizQuestion[] {
  const otherCommands = chapter.commands.filter(
    (command) => command !== stage.command
  );
  const fallbackOptions = ["git stash", "git tag", "git diff"];
  const commandOptions = [
    stage.command,
    ...otherCommands,
    ...fallbackOptions,
  ].slice(0, 4);

  return [
    {
      id: "meaning",
      type: "mcq",
      question: `${stage.title}에서 가장 먼저 떠올릴 명령어는 무엇인가요?`,
      description: "이번 스테이지의 핵심 명령어를 골라봐요.",
      options: commandOptions,
      answer: stage.command,
      explanation: `${stage.command}는 이 스테이지의 핵심 명령어예요.`,
    },
    {
      id: "situation",
      type: "mcq",
      question: `언제 ${stage.command}를 사용하면 좋을까요?`,
      description: "명령어는 사용하는 순간과 함께 기억하면 좋아요.",
      options: [
        stage.description,
        "브라우저 캐시를 비울 때 사용해요.",
        "패키지를 설치할 때만 사용해요.",
        "디자인 파일을 내보낼 때 사용해요.",
      ],
      answer: stage.description,
      explanation: "명령어는 상황과 함께 기억하면 더 오래 남아요.",
    },
    {
      id: "flow",
      type: "mcq",
      question: "Git 학습에서 가장 먼저 확인해야 하는 흐름은 무엇인가요?",
      description: "Git이 변경사항을 어떤 단계로 다루는지 떠올려요.",
      options: [
        "작업 디렉터리, 스테이징 영역, 저장소의 관계예요.",
        "브라우저 화면 크기와 색상표의 관계예요.",
        "컴퓨터 전원과 충전기의 관계예요.",
        "파일 이름과 폴더 아이콘의 관계예요.",
      ],
      answer: "작업 디렉터리, 스테이징 영역, 저장소의 관계예요.",
      explanation: "Git은 변경사항이 어디에 있는지 이해하는 것이 중요해요.",
    },
    {
      id: "mistake",
      type: "mcq",
      question: "명령어를 헷갈렸을 때 가장 좋은 태도는 무엇인가요?",
      description: "실수했을 때 바로 삭제하기보다 상태를 먼저 확인해요.",
      options: [
        "상태를 확인하고 다음 행동을 고르면 돼요.",
        "무조건 같은 명령어를 여러 번 입력해요.",
        "에러 메시지는 읽지 않아도 괜찮아요.",
        "저장소를 바로 삭제해요.",
      ],
      answer: "상태를 확인하고 다음 행동을 고르면 돼요.",
      explanation: "Git에서는 현재 상태를 차분히 확인하는 습관이 좋아요.",
    },
    {
      id: "command",
      type: "command",
      question: `${stage.command} 명령어를 직접 입력해요.`,
      description: "앞뒤 공백과 연속 공백은 정리되지만, 명령어는 정확히 입력해요.",
      placeholder: `예: ${stage.command}`,
      answer: stage.command,
      explanation: `${stage.command}를 직접 입력하면 이 스테이지의 핵심 흐름을 익힐 수 있어요.`,
    },
  ];
}

function normalizeCommand(command: string) {
  return command.trim().replace(/\s+/g, " ");
}

function getQuestionLimit(question: QuizQuestion) {
  return question.type === "command" ? 45 : 20;
}

function getQuestionLimitMs(question: QuizQuestion) {
  return getQuestionLimit(question) * 1000;
}

function getStarCount(correctCount: number) {
  if (correctCount >= 5) {
    return 3;
  }

  if (correctCount === 4) {
    return 2;
  }

  if (correctCount === 3) {
    return 1;
  }

  return 0;
}

export default function MiniQuizStageClient({
  chapter,
  stage,
  chapterNumber,
  stageNumber,
}: MiniQuizStageClientProps) {
  const router = useRouter();
  const questions = useMemo(
    () => buildQuizQuestions(chapter, stage),
    [chapter, stage]
  );
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [commandAnswer, setCommandAnswer] = useState("");
  const [submittedAnswer, setSubmittedAnswer] = useState<string | null>(null);
  const [correctCount, setCorrectCount] = useState(0);
  const [energy, setEnergy] = useState(3);
  const [isResult, setIsResult] = useState(false);
  const [isFailed, setIsFailed] = useState(false);

  const currentQuestion = questions[currentIndex];
  const timeLimitMs = getQuestionLimitMs(currentQuestion);
  const [timeLeftMs, setTimeLeftMs] = useState(timeLimitMs);
  const isFeedback = submittedAnswer !== null;
  const normalizedSubmittedAnswer =
    currentQuestion.type === "command" && submittedAnswer
      ? normalizeCommand(submittedAnswer)
      : submittedAnswer;
  const isCorrect = normalizedSubmittedAnswer === currentQuestion.answer;
  const progressPercent = Math.round(
    ((currentIndex + (isFeedback ? 1 : 0)) / questions.length) * 100
  );
  const timerPercent = Math.max(0, (timeLeftMs / timeLimitMs) * 100);
  const displayTimeLeft = Math.ceil(timeLeftMs / 1000);
  const resultPercent = Math.round((correctCount / questions.length) * 100);
  const starCount = getStarCount(correctCount);
  const isCleared = starCount > 0;

  const submitAnswer = useCallback(
    (answer: string | null) => {
      if (isFeedback) {
        return;
      }

      const nextSubmittedAnswer = answer ?? "";
      const normalizedAnswer =
        currentQuestion.type === "command"
          ? normalizeCommand(nextSubmittedAnswer)
          : nextSubmittedAnswer;
      const nextIsCorrect = normalizedAnswer === currentQuestion.answer;

      setSubmittedAnswer(nextSubmittedAnswer);

      if (nextIsCorrect) {
        setCorrectCount((count) => count + 1);
        return;
      }

      setEnergy((currentEnergy) => {
        const nextEnergy = Math.max(0, currentEnergy - 1);

        if (nextEnergy === 0) {
          setIsFailed(true);
        }

        return nextEnergy;
      });
    },
    [currentQuestion, isFeedback]
  );

  useEffect(() => {
    if (isFeedback || isResult || isFailed) {
      return;
    }

    if (timeLeftMs <= 0) {
      const timeoutSubmitId = window.setTimeout(() => {
        submitAnswer(
          currentQuestion.type === "command"
            ? commandAnswer || null
            : selectedAnswer
        );
      }, 0);

      return () => window.clearTimeout(timeoutSubmitId);
    }

    const timerId = window.setTimeout(() => {
      setTimeLeftMs((milliseconds) => Math.max(0, milliseconds - 50));
    }, 50);

    return () => window.clearTimeout(timerId);
  }, [
    commandAnswer,
    currentQuestion.type,
    isFailed,
    isFeedback,
    isResult,
    selectedAnswer,
    submitAnswer,
    timeLeftMs,
  ]);

  function handleSelect(answer: string) {
    if (isFeedback) {
      return;
    }

    setSelectedAnswer(answer);
  }

  function handleNext() {
    if (currentIndex === questions.length - 1) {
      setIsResult(true);
      return;
    }

    const nextIndex = currentIndex + 1;

    setCurrentIndex(nextIndex);
    setTimeLeftMs(getQuestionLimitMs(questions[nextIndex]));
    setSelectedAnswer(null);
    setCommandAnswer("");
    setSubmittedAnswer(null);
  }

  function handleRetry() {
    setCurrentIndex(0);
    setSelectedAnswer(null);
    setCommandAnswer("");
    setSubmittedAnswer(null);
    setCorrectCount(0);
    setEnergy(3);
    setIsResult(false);
    setIsFailed(false);
    setTimeLeftMs(getQuestionLimitMs(questions[0]));
  }

  function handleFailClose() {
    router.push("/study");
  }

  if (isResult) {
    return (
      <div className={styles.quizPage}>
        <section className={styles.resultPanel} aria-labelledby="result-title">
          <div className={styles.resultHero}>
            <div className={styles.resultText}>
              <p className={styles.eyebrow}>
                Chapter {chapterNumber} · Stage {stageNumber}
              </p>
              <h1 id="result-title">
                {isCleared ? "스테이지를 클리어했어요!" : "다시 도전해봐요"}
              </h1>
              <p>{stage.title}</p>
            </div>
            <Image
              src={ggoggoCheck}
              alt=""
              width={180}
              height={160}
              className={styles.resultMascot}
              priority
            />
          </div>

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
                  {correctCount} / {questions.length}
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

          <div className={styles.resultActions}>
            <button
              type="button"
              className={styles.secondaryButton}
              onClick={handleRetry}
            >
              <RotateCcw size={18} aria-hidden="true" />
              다시 풀기
            </button>
            <Link href="/study" className={styles.primaryLink}>
              스테이지 선택으로
            </Link>
          </div>
        </section>
      </div>
    );
  }

  return (
    <div className={styles.quizPage}>
      {isFailed && (
        <Modal title="에너지가 방전됐어요" onClose={handleFailClose}>
          <div className={styles.failModalContent}>
            <Image
              src={ggoggoHuk}
              alt=""
              width={180}
              height={150}
              className={styles.failModalImage}
            />
            <p>스테이지 선택 화면에서 다시 도전해요.</p>
            <Link href="/study" className={styles.primaryLink}>
              스테이지 선택으로
            </Link>
          </div>
        </Modal>
      )}

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
            {currentIndex + 1} / {questions.length}
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
                  onClick={() => handleSelect(option)}
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

        <div className={styles.quizActions}>
          {isFeedback ? (
            <button
              type="button"
              className={styles.primaryButton}
              onClick={handleNext}
            >
              {currentIndex === questions.length - 1
                ? "결과 보기"
                : "다음 문제 풀기"}
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
                  submitAnswer(
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

"use client";

import { useEffect, useMemo, useState } from "react";
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

import ggoggoCheck from "@/assets/ggoggo_check1.webp";
import ggoggoThumbsUp from "@/assets/ggoggo_thumbs_up.webp";
import styles from "./page.module.css";

interface ChallengeQuestion {
  id: string;
  type: "mcq" | "command";
  question: string;
  description: string;
  options?: string[];
  placeholder?: string;
  answer: string;
  explanation: string;
}

const questions = [
  {
    id: "daily-mcq-01",
    type: "mcq",
    question: "git status는 무엇을 확인하는 명령어인가요?",
    description: "작업 중인 변경사항과 스테이징 상태를 떠올려요.",
    options: [
      "현재 변경사항이 어떤 상태인지 확인해요.",
      "원격 저장소에 커밋을 올려요.",
      "새 브랜치를 자동으로 만들어요.",
      "최근 커밋 기록을 삭제해요.",
    ],
    answer: "현재 변경사항이 어떤 상태인지 확인해요.",
    explanation: "git status는 작업 디렉터리와 스테이징 영역의 상태를 보여줘요.",
  },
  {
    id: "daily-mcq-02",
    type: "mcq",
    question: "git add app.js를 실행하면 app.js는 어디로 올라가나요?",
    description: "커밋하기 전에 파일을 준비하는 단계를 생각해요.",
    options: [
      "원격 저장소",
      "스테이징 영역",
      "브랜치 목록",
      "커밋 메시지",
    ],
    answer: "스테이징 영역",
    explanation: "git add는 변경사항을 커밋할 준비 영역에 올려요.",
  },
  {
    id: "daily-mcq-03",
    type: "mcq",
    question: "git branch feature를 실행하면 어떤 일이 일어나나요?",
    description: "브랜치를 만드는 것과 이동하는 것은 다른 동작이에요.",
    options: [
      "feature라는 새 브랜치가 만들어져요.",
      "feature 브랜치로 자동 이동해요.",
      "feature라는 커밋 메시지가 만들어져요.",
      "feature 원격 저장소가 삭제돼요.",
    ],
    answer: "feature라는 새 브랜치가 만들어져요.",
    explanation: "git branch feature는 브랜치를 만들지만 자동으로 이동하지는 않아요.",
  },
  {
    id: "daily-mcq-04",
    type: "mcq",
    question: "git push는 어떤 방향으로 커밋을 옮기나요?",
    description: "push와 pull의 방향을 비교해요.",
    options: [
      "로컬 커밋을 원격 저장소로 올려요.",
      "원격 변경사항을 로컬로 가져와요.",
      "현재 폴더를 Git 저장소로 시작해요.",
      "작업 중 변경사항을 되돌려요.",
    ],
    answer: "로컬 커밋을 원격 저장소로 올려요.",
    explanation: "push는 내 로컬 커밋을 GitHub 같은 원격 저장소로 올리는 흐름이에요.",
  },
  {
    id: "daily-command-01",
    type: "command",
    question: "현재 저장소의 변경 상태를 확인하는 명령어를 입력해요.",
    description: "Git 명령어 뒤에 상태를 확인한다는 단어를 붙여요.",
    placeholder: "예: git ...",
    answer: "git status",
    explanation: "git status를 입력하면 현재 변경사항과 스테이징 상태를 확인할 수 있어요.",
  },
] as const satisfies readonly ChallengeQuestion[];

function normalizeCommand(command: string) {
  return command.trim().replace(/\s+/g, " ");
}

function formatElapsedTime(milliseconds: number) {
  const totalSeconds = Math.floor(milliseconds / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;

  return `${minutes}:${String(seconds).padStart(2, "0")}`;
}

function calculateScore(correctCount: number, elapsedMs: number) {
  const elapsedSeconds = Math.floor(elapsedMs / 1000);
  const speedBonus = Math.max(0, 300 - elapsedSeconds * 3);

  return correctCount * 200 + speedBonus;
}

export default function ChallengeQuizClient() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [commandAnswer, setCommandAnswer] = useState("");
  const [submittedAnswer, setSubmittedAnswer] = useState<string | null>(null);
  const [correctCount, setCorrectCount] = useState(0);
  const [elapsedMs, setElapsedMs] = useState(0);
  const [isResult, setIsResult] = useState(false);

  const currentQuestion = questions[currentIndex];
  const isFeedback = submittedAnswer !== null;
  const normalizedSubmittedAnswer =
    currentQuestion.type === "command" && submittedAnswer
      ? normalizeCommand(submittedAnswer)
      : submittedAnswer;
  const isCorrect = normalizedSubmittedAnswer === currentQuestion.answer;
  const progressPercent = Math.round(
    ((currentIndex + (isFeedback ? 1 : 0)) / questions.length) * 100
  );
  const score = useMemo(
    () => calculateScore(correctCount, elapsedMs),
    [correctCount, elapsedMs]
  );

  useEffect(() => {
    if (isResult) {
      return;
    }

    const timerId = window.setInterval(() => {
      setElapsedMs((milliseconds) => milliseconds + 1000);
    }, 1000);

    return () => window.clearInterval(timerId);
  }, [isResult]);

  function handleSelect(answer: string) {
    if (isFeedback) {
      return;
    }

    setSelectedAnswer(answer);
  }

  function submitAnswer(answer: string | null) {
    if (isFeedback) {
      return;
    }

    const nextSubmittedAnswer = answer ?? "";
    const normalizedAnswer =
      currentQuestion.type === "command"
        ? normalizeCommand(nextSubmittedAnswer)
        : nextSubmittedAnswer;

    setSubmittedAnswer(nextSubmittedAnswer);

    if (normalizedAnswer === currentQuestion.answer) {
      setCorrectCount((count) => count + 1);
    }
  }

  function handleNext() {
    if (currentIndex === questions.length - 1) {
      setIsResult(true);
      return;
    }

    setCurrentIndex((index) => index + 1);
    setSelectedAnswer(null);
    setCommandAnswer("");
    setSubmittedAnswer(null);
  }

  if (isResult) {
    return (
      <div className={styles.challengeQuizPage}>
        <section className={styles.resultPanel} aria-labelledby="result-title">
          <div className={styles.resultHero}>
            <div className={styles.resultText}>
              <p className={styles.eyebrow}>Challenge · 오늘의 미니 퀴즈</p>
              <h1 id="result-title">오늘의 도전을 마쳤어요!</h1>
              <p>오늘의 랭킹에 기록됐어요.</p>
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

          <div className={styles.resultMetrics}>
            <div>
              <span>정답</span>
              <strong>
                {correctCount} / {questions.length}
              </strong>
            </div>
            <div>
              <span>풀이 시간</span>
              <strong>{formatElapsedTime(elapsedMs)}</strong>
            </div>
            <div>
              <span>점수</span>
              <strong>{score}점</strong>
            </div>
          </div>

          <Link href="/challenge#ranking" className={styles.primaryLink}>
            오늘의 랭킹 확인하기
          </Link>
        </section>
      </div>
    );
  }

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
            {currentIndex + 1} / {questions.length}
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

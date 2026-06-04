"use client";

import {
  createContext,
  type ReactNode,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import { useRouter } from "next/navigation";

import {
  getQuestionLimitMs,
  getStarCount,
  normalizeCommand,
} from "../model/quizUtils";
import type { QuizQuestion } from "../model/types";

interface MiniQuizStageProviderProps {
  children: ReactNode;
  chapterNumber: number;
  questions: QuizQuestion[];
  stageNumber: number;
  stageTitle: string;
}

interface MiniQuizStageContextValue {
  chapterNumber: number;
  commandAnswer: string;
  correctCount: number;
  currentIndex: number;
  currentQuestion: QuizQuestion;
  displayTimeLeft: number;
  energy: number;
  isCleared: boolean;
  isCorrect: boolean;
  isFailed: boolean;
  isFeedback: boolean;
  isResult: boolean;
  progressPercent: number;
  questionCount: number;
  resultPercent: number;
  selectedAnswer: string | null;
  setCommandAnswer: (answer: string) => void;
  stageNumber: number;
  stageTitle: string;
  starCount: number;
  submittedAnswer: string | null;
  submitAnswer: (answer: string | null) => void;
  timeLeftMs: number;
  timeLimitMs: number;
  timerPercent: number;
  closeFailModal: () => void;
  goNext: () => void;
  retry: () => void;
  selectAnswer: (answer: string) => void;
}

const MiniQuizStageContext = createContext<MiniQuizStageContextValue | null>(
  null,
);

export function useMiniQuizStageContext() {
  const context = useContext(MiniQuizStageContext);

  if (!context) {
    throw new Error(
      "useMiniQuizStageContext must be used within MiniQuizStageProvider",
    );
  }

  return context;
}

export default function MiniQuizStageProvider({
  children,
  chapterNumber,
  questions,
  stageNumber,
  stageTitle,
}: MiniQuizStageProviderProps) {
  const router = useRouter();
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
  // TODO: 50ms 리렌더링이 발생하는 문제 있음.
  const [timeLeftMs, setTimeLeftMs] = useState(timeLimitMs);
  const isFeedback = submittedAnswer !== null;
  const normalizedSubmittedAnswer =
    currentQuestion.type === "command" && submittedAnswer
      ? normalizeCommand(submittedAnswer)
      : submittedAnswer;
  const isCorrect = normalizedSubmittedAnswer === currentQuestion.answer;
  const progressPercent = Math.round(
    ((currentIndex + (isFeedback ? 1 : 0)) / questions.length) * 100,
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
    [currentQuestion, isFeedback],
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
            : selectedAnswer,
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

  const selectAnswer = (answer: string) => {
    if (isFeedback) {
      return;
    }

    setSelectedAnswer(answer);
  };

  const goNext = () => {
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
  };

  const retry = () => {
    setCurrentIndex(0);
    setSelectedAnswer(null);
    setCommandAnswer("");
    setSubmittedAnswer(null);
    setCorrectCount(0);
    setEnergy(3);
    setIsResult(false);
    setIsFailed(false);
    setTimeLeftMs(getQuestionLimitMs(questions[0]));
  };

  const closeFailModal = () => {
    router.push("/study");
  };

  const value = {
    chapterNumber,
    commandAnswer,
    correctCount,
    currentIndex,
    currentQuestion,
    displayTimeLeft,
    energy,
    isCleared,
    isCorrect,
    isFailed,
    isFeedback,
    isResult,
    progressPercent,
    questionCount: questions.length,
    resultPercent,
    selectedAnswer,
    setCommandAnswer,
    stageNumber,
    stageTitle,
    starCount,
    submittedAnswer,
    submitAnswer,
    timeLeftMs,
    timeLimitMs,
    timerPercent,
    closeFailModal,
    goNext,
    retry,
    selectAnswer,
  };

  return (
    <MiniQuizStageContext.Provider value={value}>
      {children}
    </MiniQuizStageContext.Provider>
  );
}

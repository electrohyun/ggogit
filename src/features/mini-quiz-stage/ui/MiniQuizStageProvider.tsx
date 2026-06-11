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

import { useCurrentUserStore } from "@/entities/user";
import {
  playCorrectSound,
  playWrongSound,
} from "@/shared/lib/sound/soundPlayer";
import { useSoundStore } from "@/shared/model/sound/soundStore";

import { submitMiniQuizAnswer } from "../api/miniQuizStage.actions";
import {
  getQuestionLimitMs,
  getStarCount,
  normalizeCommand,
} from "../model/quizUtils";
import type { QuizQuestion } from "../model/types";

interface MiniQuizStageProviderProps {
  attemptId: string | null;
  children: ReactNode;
  chapterNumber: number;
  questions: QuizQuestion[];
  stageNumber: number;
  stageTitle: string;
}

type RewardModalKind = "beans" | "streak" | null;

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
  isRewardModalOpen: boolean;
  isSubmitting: boolean;
  progressPercent: number;
  questionCount: number;
  resultPercent: number;
  selectedAnswer: string | null;
  setCommandAnswer: (answer: string) => void;
  stageNumber: number;
  stageTitle: string;
  starCount: number;
  stageRewardBeans: number;
  rewardModalKind: RewardModalKind;
  streakIncremented: boolean;
  submittedAnswer: string | null;
  submitAnswer: (answer: string | null) => void;
  timeLeftMs: number;
  timeLimitMs: number;
  timerPercent: number;
  closeFailModal: () => void;
  closeRewardModal: () => void;
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
  attemptId,
  children,
  chapterNumber,
  questions,
  stageNumber,
  stageTitle,
}: MiniQuizStageProviderProps) {
  const router = useRouter();
  const soundSettings = useSoundStore((state) => state.soundSettings);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [commandAnswer, setCommandAnswer] = useState("");
  const [submittedAnswer, setSubmittedAnswer] = useState<string | null>(null);
  const [correctCount, setCorrectCount] = useState(0);
  const [energy, setEnergy] = useState(3);
  const [isResult, setIsResult] = useState(false);
  const [isFailed, setIsFailed] = useState(false);
  const [rewardModalKind, setRewardModalKind] =
    useState<RewardModalKind>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [starCount, setStarCount] = useState(0);
  const [stageRewardBeans, setStageRewardBeans] = useState(0);
  const [streakIncremented, setStreakIncremented] = useState(false);
  const [currentFeedback, setCurrentFeedback] = useState<{
    correctAnswer: string;
    explanation: string;
    isCorrect: boolean;
  } | null>(null);

  const currentQuestion = {
    ...questions[currentIndex],
    answer: currentFeedback?.correctAnswer ?? "",
    explanation: currentFeedback?.explanation ?? "",
  };
  const timeLimitMs = getQuestionLimitMs(currentQuestion);
  // TODO: 50ms 리렌더링이 발생하는 문제 있음.
  const [timeLeftMs, setTimeLeftMs] = useState(timeLimitMs);
  const isFeedback = submittedAnswer !== null && currentFeedback !== null;
  const isCorrect = currentFeedback?.isCorrect ?? false;
  const progressPercent = Math.round(
    ((currentIndex + (isFeedback ? 1 : 0)) / questions.length) * 100,
  );
  const timerPercent = Math.max(0, (timeLeftMs / timeLimitMs) * 100);
  const displayTimeLeft = Math.ceil(timeLeftMs / 1000);
  const resultPercent = Math.round((correctCount / questions.length) * 100);
  const isCleared = starCount > 0;

  const submitAnswer = useCallback(
    async (answer: string | null) => {
      if (isFeedback || isSubmitting) {
        return;
      }

      const nextSubmittedAnswer = answer ?? "";
      const submitReason = timeLeftMs <= 0 ? "timeout" : "manual";

      setIsSubmitting(true);

      try {
        const question = questions[currentIndex];
        const result = attemptId
          ? await submitMiniQuizAnswer({
              attemptId,
              questionId: question.id,
              submittedAnswer: nextSubmittedAnswer,
              submitReason,
            })
          : (() => {
              const isCommandQuestion = question.type === "command";
              const isAnswerCorrect = isCommandQuestion
                ? normalizeCommand(nextSubmittedAnswer) ===
                  normalizeCommand(question.answer)
                : nextSubmittedAnswer === question.answer;
              const nextCorrectCount = correctCount + (isAnswerCorrect ? 1 : 0);
              const nextEnergy = Math.max(0, energy - (isAnswerCorrect ? 0 : 1));
              const nextStatus =
                currentIndex === questions.length - 1
                  ? nextCorrectCount >= 3
                    ? "completed"
                    : "failed"
                  : nextEnergy <= 0
                    ? "failed"
                    : "in_progress";

              return {
                correctAnswer: question.answer,
                correctCount: nextCorrectCount,
                earnedBeans: 0,
                energy: nextEnergy,
                explanation: question.explanation,
                isCorrect: isAnswerCorrect,
                isFailed: nextStatus === "failed",
                starCount:
                  nextStatus === "completed" ? getStarCount(nextCorrectCount) : 0,
                status: nextStatus,
                streakIncremented: false,
              };
            })();

        setSubmittedAnswer(nextSubmittedAnswer);
        setCurrentFeedback({
          correctAnswer: result.correctAnswer,
          explanation: result.explanation,
          isCorrect: result.isCorrect,
        });
        setCorrectCount(result.correctCount);
        setEnergy(result.energy);
        setStarCount(result.starCount);
        setIsFailed(result.isFailed);
        setStageRewardBeans(result.earnedBeans);
        setStreakIncremented(result.streakIncremented);
        if (result.isCorrect) {
          playCorrectSound(soundSettings);
        } else {
          playWrongSound(soundSettings);
        }

        if (result.earnedBeans > 0 || result.streakIncremented) {
          const { currentUser, updateCurrentUser } =
            useCurrentUserStore.getState();

          updateCurrentUser({
            currentBeans: currentUser.currentBeans + result.earnedBeans,
            currentStreakDays:
              currentUser.currentStreakDays +
              (result.streakIncremented ? 1 : 0),
          });
        }
      } finally {
        setIsSubmitting(false);
      }
    },
    [
      attemptId,
      correctCount,
      currentIndex,
      energy,
      isFeedback,
      isSubmitting,
      questions,
      soundSettings,
      timeLeftMs,
    ],
  );

  useEffect(() => {
    if (isFeedback || isResult || isFailed || isSubmitting) {
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
    isSubmitting,
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
      if (isCleared) {
        playCorrectSound(soundSettings);
      }
      setRewardModalKind(
        stageRewardBeans > 0
          ? "beans"
          : streakIncremented
            ? "streak"
            : null,
      );
      return;
    }

    const nextIndex = currentIndex + 1;

    setCurrentIndex(nextIndex);
    setTimeLeftMs(getQuestionLimitMs(questions[nextIndex]));
    setSelectedAnswer(null);
    setCommandAnswer("");
    setSubmittedAnswer(null);
    setCurrentFeedback(null);
  };

  const retry = () => {
    window.location.reload();
  };

  const closeFailModal = () => {
    router.push("/study");
  };

  const closeRewardModal = () => {
    setRewardModalKind((currentKind) =>
      currentKind === "beans" && streakIncremented ? "streak" : null,
    );
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
    isRewardModalOpen: rewardModalKind !== null,
    isSubmitting,
    progressPercent,
    questionCount: questions.length,
    resultPercent,
    selectedAnswer,
    setCommandAnswer,
    stageNumber,
    stageTitle,
    starCount,
    stageRewardBeans,
    rewardModalKind,
    streakIncremented,
    submittedAnswer,
    submitAnswer,
    timeLeftMs,
    timeLimitMs,
    timerPercent,
    closeFailModal,
    closeRewardModal,
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

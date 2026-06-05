"use client";

import {
  createContext,
  type ReactNode,
  useContext,
  useEffect,
  useMemo,
  useState,
  useTransition,
} from "react";

import {
  getOrCreateGuestIdentity,
  useCurrentUserStore,
} from "@/entities/user";
import {
  playCorrectSound,
  playSuccessSound,
  playWrongSound,
} from "@/shared/lib/sound/soundPlayer";
import { useSoundStore } from "@/shared/model/sound/soundStore";
import {
  gradeDailyQuizAnswer,
  submitDailyQuiz,
} from "../api/dailyQuiz.actions";
import { calculateScore, normalizeCommand } from "../model/quizUtils";
import type {
  ChallengeQuestion,
  DailyQuizAnswer,
  DailyQuizResult,
} from "../model/types";

interface ChallengeQuizProviderProps {
  children: ReactNode;
  questions: ChallengeQuestion[];
  quizDate: string;
}

type RewardModalKind = "beans" | "streak" | null;

interface ChallengeQuizContextValue {
  commandAnswer: string;
  correctAnswer: string | null;
  correctCount: number;
  currentIndex: number;
  currentQuestion: ChallengeQuestion;
  elapsedMs: number;
  errorMessage: string | null;
  isCorrect: boolean;
  isFeedback: boolean;
  isPending: boolean;
  isResult: boolean;
  isRewardModalOpen: boolean;
  progressPercent: number;
  questionCount: number;
  result: DailyQuizResult | null;
  rewardModalKind: RewardModalKind;
  score: number;
  selectedAnswer: string | null;
  setCommandAnswer: (answer: string) => void;
  submittedAnswer: string | null;
  closeRewardModal: () => void;
  goNext: () => void;
  selectAnswer: (answer: string) => void;
  submitAnswer: (answer: string | null) => void;
}

const ChallengeQuizContext =
  createContext<ChallengeQuizContextValue | null>(null);

export function useChallengeQuizContext() {
  const context = useContext(ChallengeQuizContext);

  if (!context) {
    throw new Error(
      "useChallengeQuizContext must be used within ChallengeQuizProvider",
    );
  }

  return context;
}

export default function ChallengeQuizProvider({
  children,
  questions,
  quizDate,
}: ChallengeQuizProviderProps) {
  const soundSettings = useSoundStore((state) => state.soundSettings);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [commandAnswer, setCommandAnswer] = useState("");
  const [submittedAnswer, setSubmittedAnswer] = useState<string | null>(null);
  const [correctAnswer, setCorrectAnswer] = useState<string | null>(null);
  const [feedbackExplanation, setFeedbackExplanation] = useState("");
  const [correctCount, setCorrectCount] = useState(0);
  const [answers, setAnswers] = useState<DailyQuizAnswer[]>([]);
  const [elapsedMs, setElapsedMs] = useState(0);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isResult, setIsResult] = useState(false);
  const [isFinalizing, setIsFinalizing] = useState(false);
  const [result, setResult] = useState<DailyQuizResult | null>(null);
  const [rewardModalKind, setRewardModalKind] =
    useState<RewardModalKind>(null);
  const [isPending, startTransition] = useTransition();

  const currentQuestion = questions[currentIndex];
  const isFeedback = submittedAnswer !== null;
  const isCorrect = correctAnswer !== null && submittedAnswer === correctAnswer;
  const progressPercent = Math.round(
    ((currentIndex + (isFeedback ? 1 : 0)) / questions.length) * 100,
  );
  const score = useMemo(
    () => result?.score ?? calculateScore(correctCount, elapsedMs),
    [correctCount, elapsedMs, result?.score],
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

  const selectAnswer = (answer: string) => {
    if (isFeedback || isPending) {
      return;
    }

    setSelectedAnswer(answer);
  };

  const submitAnswer = (answer: string | null) => {
    if (isFeedback || isPending) {
      return;
    }

    const nextSubmittedAnswer =
      currentQuestion.type === "command" ? normalizeCommand(answer ?? "") : answer ?? "";

    setErrorMessage(null);

    startTransition(async () => {
      try {
        const gradedAnswer = await gradeDailyQuizAnswer({
          quizDate,
          questionId: currentQuestion.id,
          submittedAnswer: nextSubmittedAnswer,
        });
        const nextAnswer = {
          questionId: currentQuestion.id,
          submittedAnswer: nextSubmittedAnswer,
        };

        setSubmittedAnswer(nextSubmittedAnswer);
        setCorrectAnswer(gradedAnswer.correctAnswer);
        setFeedbackExplanation(gradedAnswer.explanation);
        setAnswers((previousAnswers) => [...previousAnswers, nextAnswer]);
        if (gradedAnswer.isCorrect) {
          playCorrectSound(soundSettings);
        } else {
          playWrongSound(soundSettings);
        }

        if (gradedAnswer.isCorrect) {
          setCorrectCount((count) => count + 1);
        }
      } catch (error) {
        setErrorMessage(
          error instanceof Error
            ? error.message
            : "데일리 퀴즈 답안을 채점하지 못했습니다.",
        );
      }
    });
  };

  const goNext = () => {
    if (isFinalizing) {
      return;
    }

    if (currentIndex === questions.length - 1) {
      setErrorMessage(null);
      setIsFinalizing(true);

      startTransition(async () => {
        try {
          const { currentUser } = useCurrentUserStore.getState();
          const isAnonymous = currentUser.authRole === "anonymous";
          const guestIdentity = currentUser.authRole === "guest"
            ? getOrCreateGuestIdentity()
            : null;
          const nextResult = isAnonymous
            ? {
                alreadyCompleted: false,
                correctCount,
                earnedBeans: 0,
                rankingEligible: false,
                score: calculateScore(correctCount, elapsedMs),
                streakIncremented: false,
              }
            : await submitDailyQuiz({
                answers,
                elapsedMs,
                guestName: guestIdentity?.guestName,
                guestSessionId: guestIdentity?.guestSessionId,
                quizDate,
              });

          setResult(nextResult);
          setCorrectCount(nextResult.correctCount);
          setIsResult(true);
          playSuccessSound(soundSettings);

          if (nextResult.earnedBeans > 0 || nextResult.streakIncremented) {
            const { currentUser: latestCurrentUser, updateCurrentUser } =
              useCurrentUserStore.getState();

            updateCurrentUser({
              currentBeans:
                latestCurrentUser.currentBeans + nextResult.earnedBeans,
              currentStreakDays:
                latestCurrentUser.currentStreakDays +
                (nextResult.streakIncremented ? 1 : 0),
            });
          }

          setRewardModalKind(
            nextResult.earnedBeans > 0
              ? "beans"
              : nextResult.streakIncremented
                ? "streak"
                : null,
          );
        } catch (error) {
          setErrorMessage(
            error instanceof Error
              ? error.message
              : "데일리 퀴즈 결과를 저장하지 못했습니다.",
          );
        } finally {
          setIsFinalizing(false);
        }
      });

      return;
    }

    setCurrentIndex((index) => index + 1);
    setSelectedAnswer(null);
    setCommandAnswer("");
    setSubmittedAnswer(null);
    setCorrectAnswer(null);
    setFeedbackExplanation("");
    setErrorMessage(null);
  };

  const closeRewardModal = () => {
    setRewardModalKind((currentKind) =>
      currentKind === "beans" && result?.streakIncremented ? "streak" : null,
    );
  };

  const value = {
    commandAnswer,
    correctAnswer,
    correctCount,
    currentIndex,
    currentQuestion: {
      ...currentQuestion,
      explanation: feedbackExplanation,
    },
    elapsedMs,
    errorMessage,
    isCorrect,
    isFeedback,
    isPending: isPending || isFinalizing,
    isResult,
    isRewardModalOpen: rewardModalKind !== null,
    progressPercent,
    questionCount: questions.length,
    result,
    rewardModalKind,
    score,
    selectedAnswer,
    setCommandAnswer,
    submittedAnswer,
    closeRewardModal,
    goNext,
    selectAnswer,
    submitAnswer,
  };

  return (
    <ChallengeQuizContext.Provider value={value}>
      {children}
    </ChallengeQuizContext.Provider>
  );
}

"use client";

import {
  createContext,
  type ReactNode,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

import { calculateScore, normalizeCommand } from "../model/quizUtils";
import type { ChallengeQuestion } from "../model/types";

const QUESTIONS = [
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

interface ChallengeQuizProviderProps {
  children: ReactNode;
}

interface ChallengeQuizContextValue {
  commandAnswer: string;
  correctCount: number;
  currentIndex: number;
  currentQuestion: ChallengeQuestion;
  elapsedMs: number;
  isCorrect: boolean;
  isFeedback: boolean;
  isResult: boolean;
  progressPercent: number;
  questionCount: number;
  score: number;
  selectedAnswer: string | null;
  setCommandAnswer: (answer: string) => void;
  submittedAnswer: string | null;
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
      "useChallengeQuizContext must be used within ChallengeQuizProvider"
    );
  }

  return context;
}

export default function ChallengeQuizProvider({
  children,
}: ChallengeQuizProviderProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [commandAnswer, setCommandAnswer] = useState("");
  const [submittedAnswer, setSubmittedAnswer] = useState<string | null>(null);
  const [correctCount, setCorrectCount] = useState(0);
  const [elapsedMs, setElapsedMs] = useState(0);
  const [isResult, setIsResult] = useState(false);

  const currentQuestion = QUESTIONS[currentIndex];
  const isFeedback = submittedAnswer !== null;
  const normalizedSubmittedAnswer =
    currentQuestion.type === "command" && submittedAnswer
      ? normalizeCommand(submittedAnswer)
      : submittedAnswer;
  const isCorrect = normalizedSubmittedAnswer === currentQuestion.answer;
  const progressPercent = Math.round(
    ((currentIndex + (isFeedback ? 1 : 0)) / QUESTIONS.length) * 100
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

  const selectAnswer = (answer: string) => {
    if (isFeedback) {
      return;
    }

    setSelectedAnswer(answer);
  };

  const submitAnswer = (answer: string | null) => {
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
  };

  const goNext = () => {
    if (currentIndex === QUESTIONS.length - 1) {
      setIsResult(true);
      return;
    }

    setCurrentIndex((index) => index + 1);
    setSelectedAnswer(null);
    setCommandAnswer("");
    setSubmittedAnswer(null);
  };

  const value = {
    commandAnswer,
    correctCount,
    currentIndex,
    currentQuestion,
    elapsedMs,
    isCorrect,
    isFeedback,
    isResult,
    progressPercent,
    questionCount: QUESTIONS.length,
    score,
    selectedAnswer,
    setCommandAnswer,
    submittedAnswer,
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

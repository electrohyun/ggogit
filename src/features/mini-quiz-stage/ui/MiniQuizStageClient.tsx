"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";

import type {
  MiniQuizChapter,
  MiniQuizStage,
} from "@/entities/mini-quiz";
import {
  buildQuizQuestions,
  getQuestionLimitMs,
  getStarCount,
  normalizeCommand,
} from "../model/quizUtils";
import MiniQuizFailModal from "./MiniQuizFailModal";
import MiniQuizQuestionPanel from "./MiniQuizQuestionPanel";
import MiniQuizStageResult from "./MiniQuizStageResult";

interface MiniQuizStageClientProps {
  chapter: MiniQuizChapter;
  stage: MiniQuizStage;
  chapterNumber: number;
  stageNumber: number;
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

  const handleSelect = (answer: string) => {
    if (isFeedback) {
      return;
    }

    setSelectedAnswer(answer);
  };

  const handleNext = () => {
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

  const handleRetry = () => {
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

  const handleFailClose = () => {
    router.push("/study");
  };

  if (isResult) {
    return (
      <MiniQuizStageResult
        chapterNumber={chapterNumber}
        correctCount={correctCount}
        energy={energy}
        isCleared={isCleared}
        onRetry={handleRetry}
        questionCount={questions.length}
        resultPercent={resultPercent}
        stageNumber={stageNumber}
        stageTitle={stage.title}
        starCount={starCount}
      />
    );
  }

  return (
    <>
      {isFailed && <MiniQuizFailModal onClose={handleFailClose} />}
      <MiniQuizQuestionPanel
        chapterNumber={chapterNumber}
        commandAnswer={commandAnswer}
        currentIndex={currentIndex}
        currentQuestion={currentQuestion}
        displayTimeLeft={displayTimeLeft}
        energy={energy}
        isCorrect={isCorrect}
        isFeedback={isFeedback}
        onCommandAnswerChange={setCommandAnswer}
        onNext={handleNext}
        onSelect={handleSelect}
        onSubmit={submitAnswer}
        progressPercent={progressPercent}
        questionCount={questions.length}
        selectedAnswer={selectedAnswer}
        stageNumber={stageNumber}
        submittedAnswer={submittedAnswer}
        timeLeftMs={timeLeftMs}
        timeLimitMs={timeLimitMs}
        timerPercent={timerPercent}
      />
    </>
  );
}

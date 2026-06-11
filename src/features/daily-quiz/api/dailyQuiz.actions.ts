"use server";

import { createClient } from "@/shared/lib/supabase/server";

import type { DailyQuizAnswer, DailyQuizResult } from "../model/types";

interface GradeDailyQuizAnswerParams {
  quizDate: string;
  questionId: string;
  submittedAnswer: string;
}

interface GradeDailyQuizAnswerRow {
  correct_answer: string;
  explanation: string;
  is_correct: boolean;
}

export interface GradeDailyQuizAnswerResult {
  correctAnswer: string;
  explanation: string;
  isCorrect: boolean;
}

interface SubmitDailyQuizParams {
  answers: DailyQuizAnswer[];
  elapsedMs: number;
  guestName?: string;
  guestSessionId?: string;
  quizDate: string;
}

interface SubmitDailyQuizRow {
  already_completed: boolean;
  correct_count: number;
  earned_beans: number;
  ranking_eligible: boolean;
  score: number;
  streak_incremented: boolean;
}

export const gradeDailyQuizAnswer = async ({
  quizDate,
  questionId,
  submittedAnswer,
}: GradeDailyQuizAnswerParams): Promise<GradeDailyQuizAnswerResult> => {
  const supabase = await createClient();
  const { data, error } = await supabase
    .rpc("grade_daily_git_quiz_answer", {
      p_question_id: questionId,
      p_quiz_date: quizDate,
      p_submitted_answer: submittedAnswer,
    })
    .single();

  if (error || !data) {
    throw new Error(error?.message ?? "데일리 퀴즈 답안을 채점하지 못했습니다.");
  }

  const result = data as GradeDailyQuizAnswerRow;

  return {
    correctAnswer: result.correct_answer,
    explanation: result.explanation,
    isCorrect: result.is_correct,
  };
};

export const submitDailyQuiz = async ({
  answers,
  elapsedMs,
  guestName,
  guestSessionId,
  quizDate,
}: SubmitDailyQuizParams): Promise<DailyQuizResult> => {
  const supabase = await createClient();
  const { data, error } = await supabase
    .rpc("submit_daily_git_quiz_attempt", {
      p_answers: answers.map((answer) => ({
        question_id: answer.questionId,
        submitted_answer: answer.submittedAnswer,
      })),
      p_elapsed_ms: elapsedMs,
      p_guest_name: guestName ?? null,
      p_guest_session_id: guestSessionId ?? null,
      p_quiz_date: quizDate,
    })
    .single();

  if (error || !data) {
    throw new Error(error?.message ?? "데일리 퀴즈 결과를 저장하지 못했습니다.");
  }

  const result = data as SubmitDailyQuizRow;

  return {
    alreadyCompleted: result.already_completed,
    correctCount: result.correct_count,
    earnedBeans: result.earned_beans,
    rankingEligible: result.ranking_eligible,
    score: result.score,
    streakIncremented: result.streak_incremented,
  };
};

"use server";

import { createClient } from "@/shared/lib/supabase/server";

interface SubmitMiniQuizAnswerParams {
  attemptId: string;
  questionId: string;
  submittedAnswer: string;
  submitReason: "manual" | "timeout";
}

export interface SubmitMiniQuizAnswerResult {
  correctAnswer: string;
  correctCount: number;
  earnedBeans: number;
  energy: number;
  explanation: string;
  isCorrect: boolean;
  isFailed: boolean;
  starCount: number;
  status: "in_progress" | "completed" | "failed" | "abandoned";
  streakIncremented: boolean;
}

interface SubmitMiniQuizAnswerRow {
  correct_answer: string;
  correct_count: number;
  earned_beans: number;
  explanation: string;
  is_correct: boolean;
  remaining_energy: number;
  star_count: number;
  attempt_status: SubmitMiniQuizAnswerResult["status"];
  streak_incremented: boolean;
}

export const submitMiniQuizAnswer = async ({
  attemptId,
  questionId,
  submittedAnswer,
  submitReason,
}: SubmitMiniQuizAnswerParams): Promise<SubmitMiniQuizAnswerResult> => {
  const supabase = await createClient();
  const { data, error } = await supabase
    .rpc("submit_mini_quiz_question_answer", {
      p_stage_attempt_id: attemptId,
      p_question_id: questionId,
      p_submitted_answer: submittedAnswer,
      p_submit_reason: submitReason,
    })
    .single();

  if (error || !data) {
    throw new Error(error?.message ?? "미니 퀴즈 답안을 채점하지 못했습니다.");
  }

  const result = data as SubmitMiniQuizAnswerRow;

  return {
    correctAnswer: result.correct_answer,
    correctCount: result.correct_count,
    earnedBeans: result.earned_beans,
    energy: result.remaining_energy,
    explanation: result.explanation,
    isCorrect: result.is_correct,
    isFailed: result.attempt_status === "failed",
    starCount: result.star_count,
    status: result.attempt_status,
    streakIncremented: result.streak_incremented,
  };
};

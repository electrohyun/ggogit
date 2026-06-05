import type { SupabaseClient } from "@supabase/supabase-js";

import type { ChallengeOption, ChallengeQuestion } from "../model/types";

interface DailyQuizSetRow {
  question_ids: string[];
  quiz_date: string;
}

interface DailyQuizQuestionRow {
  category: string;
  id: string;
  options: unknown;
  placeholder: string | null;
  question: string;
  type: "mcq" | "command";
}

interface DailyQuizAttemptRow {
  correct_count: number;
  elapsed_ms: number;
  score: number;
}

interface RankingAttemptRow {
  author_role: "user" | "guest";
  correct_count: number;
  elapsed_ms: number;
  profile_name: string | null;
  rank_number: number;
  score: number;
  user_id: string;
}

export interface DailyQuizPlayData {
  questions: ChallengeQuestion[];
  quizDate: string;
}

export interface DailyQuizRankingItem {
  correctCount: number | null;
  elapsedMs: number | null;
  name: string | null;
  rank: number;
  score: number | null;
}

export interface DailyQuizSummaryData {
  myRecord: {
    correctCount: number;
    elapsedMs: number;
    score: number;
  } | null;
  questionCount: number;
  quizDate: string;
  rankings: DailyQuizRankingItem[];
}

const QUESTION_COUNT = 5;

const parseOptions = (options: unknown): ChallengeOption[] | undefined => {
  if (!Array.isArray(options)) {
    return undefined;
  }

  return options
    .filter(
      (option): option is ChallengeOption =>
        typeof option === "object" &&
        option !== null &&
        "id" in option &&
        "text" in option &&
        typeof option.id === "string" &&
        typeof option.text === "string",
    )
    .map((option) => ({
      id: option.id,
      text: option.text,
    }));
};

const getQuestionDescription = (category: string) => {
  switch (category) {
    case "meaning":
      return "명령어가 하는 일을 떠올려요.";
    case "situation":
      return "명령어를 쓰는 상황과 함께 기억해요.";
    case "result":
      return "명령어를 실행한 뒤 생기는 변화를 생각해요.";
    case "mistake":
      return "헷갈리기 쉬운 지점을 확인해요.";
    case "command":
      return "명령어를 직접 입력해요.";
    default:
      return "문제를 읽고 알맞은 답을 골라요.";
  }
};

const getDailyQuizSet = async (supabase: SupabaseClient) => {
  const { data, error } = await supabase
    .rpc("get_or_create_daily_git_quiz_set")
    .single();

  if (error || !data) {
    throw new Error(error?.message ?? "오늘의 데일리 퀴즈를 불러오지 못했습니다.");
  }

  return data as DailyQuizSetRow;
};

export const getDailyQuizPlayData = async (
  supabase: SupabaseClient,
): Promise<DailyQuizPlayData | null> => {
  try {
    const quizSet = await getDailyQuizSet(supabase);
    const { data: questions, error } = await supabase
      .from("mini_quiz_questions")
      .select("id,type,category,question,placeholder,options")
      .in("id", quizSet.question_ids);

    if (error || !questions) {
      throw new Error(error?.message ?? "데일리 퀴즈 문제를 불러오지 못했습니다.");
    }

    const questionRows = questions as DailyQuizQuestionRow[];
    const questionById = new Map(
      questionRows.map((question) => [question.id, question]),
    );

    return {
      quizDate: quizSet.quiz_date,
      questions: quizSet.question_ids
        .map((questionId) => questionById.get(questionId))
        .filter((question): question is DailyQuizQuestionRow => Boolean(question))
        .map((question) => ({
          id: question.id,
          type: question.type,
          question: question.question,
          description: getQuestionDescription(question.category),
          options: parseOptions(question.options),
          placeholder: question.placeholder ?? undefined,
          explanation: "",
        })),
    };
  } catch (error) {
    console.error("데일리 퀴즈 플레이 데이터를 불러오지 못했습니다.", error);

    return null;
  }
};

export const getDailyQuizSummaryData = async (
  supabase: SupabaseClient,
): Promise<DailyQuizSummaryData | null> => {
  try {
    const quizSet = await getDailyQuizSet(supabase);
    const {
      data: { user },
    } = await supabase.auth.getUser();
    const [
      { data: rankingsData, error: rankingsError },
      { data: myRecord, error: myRecordError },
    ] = await Promise.all([
      supabase.rpc("get_daily_git_quiz_ranking", {
        p_limit: QUESTION_COUNT,
        p_quiz_date: quizSet.quiz_date,
      }),
      user
        ? supabase
            .from("daily_git_quiz_attempts")
            .select("correct_count,elapsed_ms,score")
            .eq("quiz_date", quizSet.quiz_date)
            .eq("user_id", user.id)
            .eq("status", "completed")
            .maybeSingle()
        : Promise.resolve({ data: null, error: null }),
    ]);

    if (rankingsError || myRecordError) {
      throw new Error(
        rankingsError?.message ??
          myRecordError?.message ??
          "데일리 퀴즈 랭킹을 불러오지 못했습니다.",
      );
    }

    const rankingRows = (rankingsData ?? []) as RankingAttemptRow[];
    const rankings = Array.from({ length: QUESTION_COUNT }, (_, index) => {
      const attempt = rankingRows[index];

      if (!attempt) {
        return {
          rank: index + 1,
          name: null,
          correctCount: null,
          elapsedMs: null,
          score: null,
        };
      }

      return {
        rank: Number(attempt.rank_number),
        name:
          attempt.profile_name ??
          (attempt.author_role === "guest" ? "게스트 꼬깃러" : "이름 없는 꼬깃러"),
        correctCount: attempt.correct_count,
        elapsedMs: attempt.elapsed_ms,
        score: attempt.score,
      };
    });
    const myRecordRow = myRecord as DailyQuizAttemptRow | null;

    return {
      myRecord: myRecordRow
        ? {
            correctCount: myRecordRow.correct_count,
            elapsedMs: myRecordRow.elapsed_ms,
            score: myRecordRow.score,
          }
        : null,
      questionCount: QUESTION_COUNT,
      quizDate: quizSet.quiz_date,
      rankings,
    };
  } catch (error) {
    console.error("데일리 퀴즈 요약 데이터를 불러오지 못했습니다.", error);

    return null;
  }
};

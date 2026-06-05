import type { SupabaseClient } from "@supabase/supabase-js";

import type { QuizOption, QuizQuestion } from "../model/types";

interface ChapterRow {
  id: string;
  display_order: number;
  title: string;
}

interface StageRow {
  chapter_id: string;
  stage_number: number;
  title: string;
}

interface QuestionRow {
  id: string;
  display_order: number;
  type: "mcq" | "command";
  category: string;
  question: string;
  placeholder: string | null;
  options: unknown;
}

export interface MiniQuizStagePlayData {
  attemptId: string;
  chapterNumber: number;
  questions: QuizQuestion[];
  stageNumber: number;
  stageTitle: string;
}

const parseOptions = (options: unknown): QuizOption[] | undefined => {
  if (!Array.isArray(options)) {
    return undefined;
  }

  return options
    .filter(
      (option): option is QuizOption =>
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

export const getMiniQuizStagePlayData = async (
  supabase: SupabaseClient,
  chapterId: string,
  stageNumber: number,
): Promise<MiniQuizStagePlayData | null> => {
  const [
    { data: chapters, error: chaptersError },
    { data: stage, error: stageError },
    { data: questions, error: questionsError },
    { data: attemptId, error: attemptError },
  ] = await Promise.all([
    supabase
      .from("mini_quiz_chapters")
      .select("id,display_order,title")
      .order("display_order", { ascending: true }),
    supabase
      .from("mini_quiz_stages")
      .select("chapter_id,stage_number,title")
      .eq("chapter_id", chapterId)
      .eq("stage_number", stageNumber)
      .maybeSingle(),
    supabase
      .from("mini_quiz_questions")
      .select("id,display_order,type,category,question,placeholder,options")
      .eq("chapter_id", chapterId)
      .eq("stage_number", stageNumber)
      .order("display_order", { ascending: true }),
    supabase.rpc("start_mini_quiz_stage_attempt", {
      p_chapter_id: chapterId,
      p_stage_number: stageNumber,
    }),
  ]);

  if (
    chaptersError ||
    stageError ||
    questionsError ||
    attemptError ||
    !chapters ||
    !stage ||
    !questions ||
    !attemptId
  ) {
    console.error("미니 퀴즈 스테이지 데이터를 불러오지 못했습니다.", {
      attemptError,
      chaptersError,
      questionsError,
      stageError,
    });

    return null;
  }

  const chapterRows = chapters as ChapterRow[];
  const stageRow = stage as StageRow;
  const questionRows = questions as QuestionRow[];
  const chapterNumber =
    chapterRows.findIndex((chapter) => chapter.id === stageRow.chapter_id) + 1;

  return {
    attemptId: String(attemptId),
    chapterNumber,
    questions: questionRows.map((question): QuizQuestion => {
      return {
        id: question.id,
        type: question.type,
        question: question.question,
        description: getQuestionDescription(question.category),
        options: parseOptions(question.options),
        placeholder: question.placeholder ?? undefined,
        answer: "",
        explanation: "",
      };
    }),
    stageNumber: stageRow.stage_number,
    stageTitle: stageRow.title,
  };
};

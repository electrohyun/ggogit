import type { SupabaseClient } from "@supabase/supabase-js";

import { buildQuizQuestions } from "../model/quizUtils";

import type { QuizOption, QuizQuestion } from "../model/types";

interface ChapterRow {
  id: string;
  commands: string[];
  description: string;
  display_order: number;
  title: string;
}

interface StageRow {
  display_order: number;
  chapter_id: string;
  command: string;
  description: string;
  title: string;
  stage_number: number;
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
  attemptId: string | null;
  chapterNumber: number;
  questions: QuizQuestion[];
  stageNumber: number;
  stageTitle: string;
}

interface GetMiniQuizStagePlayDataOptions {
  shouldCreateAttempt?: boolean;
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
  { shouldCreateAttempt = true }: GetMiniQuizStagePlayDataOptions = {},
): Promise<MiniQuizStagePlayData | null> => {
  const [
    { data: chapters, error: chaptersError },
    { data: stage, error: stageError },
    { data: questions, error: questionsError },
    attemptResult,
  ] = await Promise.all([
    supabase
      .from("mini_quiz_chapters")
      .select("id,display_order,title,description,commands")
      .order("display_order", { ascending: true }),
    supabase
      .from("mini_quiz_stages")
      .select("chapter_id,stage_number,display_order,title,command,description")
      .eq("chapter_id", chapterId)
      .eq("stage_number", stageNumber)
      .maybeSingle(),
    supabase
      .from("mini_quiz_questions")
      .select("id,display_order,type,category,question,placeholder,options")
      .eq("chapter_id", chapterId)
      .eq("stage_number", stageNumber)
      .order("display_order", { ascending: true }),
    shouldCreateAttempt
      ? supabase.rpc("start_mini_quiz_stage_attempt", {
          p_chapter_id: chapterId,
          p_stage_number: stageNumber,
        })
      : Promise.resolve({ data: null, error: null }),
  ]);
  const { data: attemptId, error: attemptError } = attemptResult;

  if (
    chaptersError ||
    stageError ||
    questionsError ||
    !chapters ||
    !stage ||
    !questions ||
    (shouldCreateAttempt && (attemptError || !attemptId))
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
  const chapterIndex = chapterRows.findIndex(
    (chapter) => chapter.id === stageRow.chapter_id,
  );
  const chapterNumber = chapterIndex + 1;
  const chapterRow = chapterRows[chapterIndex];

  if (!chapterRow) {
    return null;
  }

  if (!shouldCreateAttempt) {
    return {
      attemptId: null,
      chapterNumber,
      questions: buildQuizQuestions(
        {
          badgeName: "",
          commands: chapterRow.commands,
          description: chapterRow.description,
          id: chapterRow.id,
          stages: [],
          title: chapterRow.title,
        },
        {
          command: stageRow.command,
          description: stageRow.description,
          id: String(stageRow.stage_number),
          stageNumber: stageRow.stage_number,
          starCount: 0,
          status: "available",
          title: stageRow.title,
        },
      ),
      stageNumber: stageRow.stage_number,
      stageTitle: stageRow.title,
    };
  }

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

import { notFound } from "next/navigation";

import {
  findMiniQuizStage,
  MINI_QUIZ_CHAPTERS,
} from "@/entities/mini-quiz";
import { MiniQuizStageClient } from "@/features/mini-quiz-stage";

interface MiniQuizStagePageProps {
  params: Promise<{
    chapterId: string;
    stageId: string;
  }>;
}

export default async function MiniQuizStagePage({
  params,
}: MiniQuizStagePageProps) {
  const { chapterId, stageId } = await params;
  const match = findMiniQuizStage(chapterId, stageId);

  if (!match) {
    notFound();
  }

  const stageNumber =
    match.chapter.stages.findIndex((stage) => stage.id === match.stage.id) + 1;
  const chapterNumber =
    MINI_QUIZ_CHAPTERS.findIndex((chapter) => chapter.id === match.chapter.id) +
    1;

  return (
    <MiniQuizStageClient
      chapter={match.chapter}
      stage={match.stage}
      chapterNumber={chapterNumber}
      stageNumber={stageNumber}
    />
  );
}

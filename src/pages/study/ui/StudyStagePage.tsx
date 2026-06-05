import { notFound } from "next/navigation";

import {
  getMiniQuizStagePlayData,
  MiniQuizStageProvider,
  MiniQuizStageView,
} from "@/features/mini-quiz-stage";
import { createClient } from "@/shared/lib/supabase/server";

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
  const stageNumber = Number(stageId);

  if (!Number.isInteger(stageNumber) || stageNumber <= 0) {
    notFound();
  }

  const supabase = await createClient();
  const stageData = await getMiniQuizStagePlayData(
    supabase,
    chapterId,
    stageNumber,
  );

  if (!stageData) {
    notFound();
  }

  return (
    <MiniQuizStageProvider
      attemptId={stageData.attemptId}
      chapterNumber={stageData.chapterNumber}
      questions={stageData.questions}
      stageNumber={stageData.stageNumber}
      stageTitle={stageData.stageTitle}
    >
      <MiniQuizStageView />
    </MiniQuizStageProvider>
  );
}

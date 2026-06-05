import type { Metadata } from "next";

export { StudyStagePage as default } from "@/pages/study";

interface StudyStageRouteProps {
  params: Promise<{
    chapterId: string;
    stageId: string;
  }>;
}

export const generateMetadata = async ({
  params,
}: StudyStageRouteProps): Promise<Metadata> => {
  const { chapterId, stageId } = await params;

  return {
    title: `스테이지 ${stageId}`,
    description: `${chapterId} 챕터의 ${stageId} 스테이지에서 Git 퀴즈를 풉니다.`,
  };
};

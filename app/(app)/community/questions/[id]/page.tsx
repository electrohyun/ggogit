import type { Metadata } from "next";
import { createPageMetadata } from "@/shared/lib/seo/metadata";

export { CommunityQuestionDetailPage as default } from "@/pages/community";

interface CommunityQuestionDetailRouteProps {
  params: Promise<{
    id: string;
  }>;
}

export const generateMetadata = async ({
  params,
}: CommunityQuestionDetailRouteProps): Promise<Metadata> => {
  const { id } = await params;

  return createPageMetadata({
    title: "질문 상세",
    description: "꼬깃 커뮤니티의 질문과 답변을 확인합니다.",
    path: `/community/questions/${id}`,
  });
};

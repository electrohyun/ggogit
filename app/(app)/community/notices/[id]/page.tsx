import type { Metadata } from "next";
import { createPageMetadata } from "@/shared/lib/seo/metadata";

export { CommunityNoticeDetailPage as default } from "@/pages/community";

interface CommunityNoticeDetailRouteProps {
  params: Promise<{
    id: string;
  }>;
}

export const generateMetadata = async ({
  params,
}: CommunityNoticeDetailRouteProps): Promise<Metadata> => {
  const { id } = await params;

  return createPageMetadata({
    title: "공지사항 상세",
    description: "꼬깃 서비스의 공지사항 상세 내용을 확인합니다.",
    path: `/community/notices/${id}`,
  });
};

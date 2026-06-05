import { createPageMetadata } from "@/shared/lib/seo/metadata";

export { CommunityQuestionNewPage as default } from "@/pages/community";

export const metadata = createPageMetadata({
  title: "질문 작성",
  description: "Git 학습 중 궁금한 점을 꼬깃 커뮤니티에 남깁니다.",
  noIndex: true,
  path: "/community/questions/new",
});

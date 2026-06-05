import { createPageMetadata } from "@/shared/lib/seo/metadata";

export { CommunityQuestionsPage as default } from "@/pages/community";

export const metadata = createPageMetadata({
  title: "질문과 답변",
  description: "Git 학습 중 궁금한 점을 묻고 답하는 꼬깃 질문 게시판입니다.",
  path: "/community/questions",
});

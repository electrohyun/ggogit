import { createPageMetadata } from "@/shared/lib/seo/metadata";

export { StudyPage as default } from "@/pages/study";

export const metadata = createPageMetadata({
  title: "학습하기",
  description: "Git 개념을 스테이지별 퀴즈로 익히는 꼬깃 학습 화면입니다.",
  path: "/study",
});

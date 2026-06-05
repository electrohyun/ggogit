import { createPageMetadata } from "@/shared/lib/seo/metadata";

export { ChallengePage as default } from "@/pages/challenge";

export const metadata = createPageMetadata({
  title: "오늘의 챌린지",
  description: "매일 새롭게 Git 퀴즈에 도전하는 꼬깃 챌린지 화면입니다.",
  path: "/challenge",
});

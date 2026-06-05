import { createPageMetadata } from "@/shared/lib/seo/metadata";

export { ChallengePlayPage as default } from "@/pages/challenge";

export const metadata = createPageMetadata({
  title: "챌린지 플레이",
  description: "오늘의 Git 챌린지 문제를 풀고 결과를 확인합니다.",
  noIndex: true,
  path: "/challenge/play",
});

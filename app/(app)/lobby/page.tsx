import { createPageMetadata } from "@/shared/lib/seo/metadata";

export { LobbyPage as default } from "@/pages/lobby";

export const metadata = createPageMetadata({
  title: "로비",
  description: "꼬깃의 학습, 챌린지, 데일리 퀘스트를 시작하는 로비입니다.",
  path: "/lobby",
});

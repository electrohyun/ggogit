import { createPageMetadata } from "@/shared/lib/seo/metadata";

export { CreditsPage as default } from "@/pages/credits";

export const metadata = createPageMetadata({
  title: "크레딧",
  description: "꼬깃을 만든 이유와 도움을 준 사람들, 에셋 출처를 소개합니다.",
  path: "/credits",
});

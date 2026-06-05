import { createPageMetadata } from "@/shared/lib/seo/metadata";

export { CommunityTipsPage as default } from "@/pages/community";

export const metadata = createPageMetadata({
  title: "팁 모음",
  description: "Git 학습에 도움이 되는 꼬깃의 팁을 모아봅니다.",
  path: "/community/tips",
});

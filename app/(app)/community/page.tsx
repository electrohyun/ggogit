import { createPageMetadata } from "@/shared/lib/seo/metadata";

export { CommunityPage as default } from "@/pages/community";

export const metadata = createPageMetadata({
  title: "커뮤니티",
  description: "꼬깃 사용자들이 방명록과 질문을 남기는 커뮤니티입니다.",
  path: "/community",
});

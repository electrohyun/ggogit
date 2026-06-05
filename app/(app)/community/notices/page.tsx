import { createPageMetadata } from "@/shared/lib/seo/metadata";

export { CommunityNoticesPage as default } from "@/pages/community";

export const metadata = createPageMetadata({
  title: "공지사항",
  description: "꼬깃 서비스의 공지사항을 확인합니다.",
  path: "/community/notices",
});

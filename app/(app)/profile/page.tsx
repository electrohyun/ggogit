import { createPageMetadata } from "@/shared/lib/seo/metadata";

export { ProfilePage as default } from "@/pages/profile";

export const metadata = createPageMetadata({
  title: "내 정보",
  description: "꼬깃의 프로필과 학습 기록, 획득 배지를 확인합니다.",
  noIndex: true,
  path: "/profile",
});

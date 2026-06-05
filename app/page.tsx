import { HomePage } from "@/pages/home";
import { createPageMetadata } from "@/shared/lib/seo/metadata";

export const dynamic = "force-static";

export const metadata = createPageMetadata({
  title: "가장 친절한 Git 여행",
  description: "게임처럼 Git 개념을 배우는 꼬깃의 시작 화면입니다.",
  path: "/",
});

export default HomePage;

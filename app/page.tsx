import type { Metadata } from "next";
import { HomePage } from "@/pages/home";

export const dynamic = "force-static";

export const metadata: Metadata = {
  title: "가장 친절한 Git 여행",
  description: "게임처럼 Git 개념을 배우는 꼬깃의 시작 화면입니다.",
};

export default HomePage;

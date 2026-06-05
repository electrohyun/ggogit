import type { Metadata } from "next";

export { CreditsPage as default } from "@/pages/credits";

export const dynamic = "force-static";

export const metadata: Metadata = {
  title: "크레딧",
  description: "꼬깃을 만든 이유와 도움을 준 사람들, 에셋 출처를 소개합니다.",
  openGraph: {
    title: "크레딧 | 꼬깃",
    description:
      "꼬깃을 만든 이유와 도움을 준 사람들, 에셋 출처를 소개합니다.",
    images: [
      {
        url: "/images/og/og.png",
        width: 1672,
        height: 941,
        alt: "꼬깃 로고와 꼬꼬 마스코트",
      },
    ],
  },
};

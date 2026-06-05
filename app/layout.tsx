import type { Metadata } from "next";
import localFont from "next/font/local";
import { Analytics } from "@vercel/analytics/next";
import "./globals.css";

const pretendard = localFont({
  src: "../src/assets/fonts/PretendardVariable.woff2",
  variable: "--font-pretendard",
  display: "swap",
});

const schoolSafeDiary = localFont({
  src: "../src/assets/fonts/school-safe-diary.otf",
  variable: "--font-school-safe-diary",
  display: "swap",
  weight: "400",
});

const cascadiaCode = localFont({
  src: "../src/assets/fonts/CascadiaCode.woff2",
  variable: "--font-cascadia-code",
  display: "swap",
});

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL
  ? process.env.NEXT_PUBLIC_SITE_URL
  : process.env.VERCEL_URL
    ? `https://${process.env.VERCEL_URL}`
    : "http://localhost:3000";
const OG_IMAGE = {
  url: "/images/og/og.png",
  width: 1672,
  height: 941,
  alt: "꼬깃 로고와 꼬꼬 마스코트",
};

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "꼬깃",
    template: "%s | 꼬깃",
  },
  description: "Git 그래프 중심 퍼즐 학습 게임",
  openGraph: {
    title: "꼬깃",
    description: "Git 그래프 중심 퍼즐 학습 게임",
    siteName: "꼬깃",
    locale: "ko_KR",
    type: "website",
    images: [OG_IMAGE],
  },
  twitter: {
    card: "summary_large_image",
    title: "꼬깃",
    description: "Git 그래프 중심 퍼즐 학습 게임",
    images: [OG_IMAGE],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="ko"
      className={`${pretendard.variable} ${schoolSafeDiary.variable} ${cascadiaCode.variable}`}
    >
      <body>
        {children}
        <Analytics />
      </body>
    </html>
  );
}

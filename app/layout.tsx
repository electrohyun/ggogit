import type { Metadata } from "next";
import localFont from "next/font/local";
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

export const metadata: Metadata = {
  title: "꼬깃",
  description: "Git 그래프 중심 퍼즐 학습 게임",
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
      <body>{children}</body>
    </html>
  );
}

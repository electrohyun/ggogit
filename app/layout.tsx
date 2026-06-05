import type { Metadata } from "next";
import localFont from "next/font/local";
import { Analytics } from "@vercel/analytics/next";
import {
  getSiteUrl,
  OG_IMAGE,
  SITE_DESCRIPTION,
  SITE_NAME,
} from "@/shared/lib/seo/metadata";
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
  metadataBase: new URL(getSiteUrl()),
  applicationName: SITE_NAME,
  title: {
    default: SITE_NAME,
    template: `%s | ${SITE_NAME}`,
  },
  description: SITE_DESCRIPTION,
  keywords: ["Git", "깃", "Git 학습", "Git 퀴즈", "꼬깃"],
  openGraph: {
    title: SITE_NAME,
    description: SITE_DESCRIPTION,
    siteName: SITE_NAME,
    locale: "ko_KR",
    type: "website",
    images: [OG_IMAGE],
  },
  twitter: {
    card: "summary_large_image",
    title: SITE_NAME,
    description: SITE_DESCRIPTION,
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

import type { Metadata } from "next";

export const SITE_NAME = "꼬깃";
export const SITE_DESCRIPTION =
  "게임처럼 Git 개념을 배우는 Git 학습 퀴즈 서비스입니다.";

export const getSiteUrl = () =>
  process.env.NEXT_PUBLIC_SITE_URL
    ? process.env.NEXT_PUBLIC_SITE_URL
    : process.env.VERCEL_URL
      ? `https://${process.env.VERCEL_URL}`
      : "http://localhost:3000";

export const OG_IMAGE = {
  url: "/images/og/og.png",
  width: 1672,
  height: 941,
  alt: "꼬깃 로고와 꼬꼬 마스코트",
};

interface CreatePageMetadataParams {
  description: string;
  noIndex?: boolean;
  path?: string;
  title: string;
}

export const createPageMetadata = ({
  description,
  noIndex = false,
  path,
  title,
}: CreatePageMetadataParams): Metadata => ({
  title,
  description,
  alternates: path
    ? {
        canonical: path,
      }
    : undefined,
  openGraph: {
    title: `${title} | ${SITE_NAME}`,
    description,
    images: [OG_IMAGE],
  },
  twitter: {
    card: "summary_large_image",
    title: `${title} | ${SITE_NAME}`,
    description,
    images: [OG_IMAGE],
  },
  robots: noIndex
    ? {
        follow: false,
        index: false,
      }
    : undefined,
});

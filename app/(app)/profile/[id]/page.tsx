import type { Metadata } from "next";

import { ProfilePage } from "@/pages/profile";
import { createPageMetadata } from "@/shared/lib/seo/metadata";

interface ProfileDetailPageProps {
  params: Promise<{
    id: string;
  }>;
}

export const generateMetadata = async ({
  params,
}: ProfileDetailPageProps): Promise<Metadata> => {
  const { id } = await params;

  return createPageMetadata({
    title: "프로필",
    description: `${id} 사용자의 꼬깃 프로필과 학습 기록을 확인합니다.`,
    noIndex: true,
    path: `/profile/${id}`,
  });
};

export default async function ProfileDetailPage({
  params,
}: ProfileDetailPageProps) {
  const { id } = await params;

  return <ProfilePage userId={id} />;
}

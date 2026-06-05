import { ProfilePage } from "@/pages/profile";

interface ProfileDetailPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function ProfileDetailPage({
  params,
}: ProfileDetailPageProps) {
  const { id } = await params;

  return <ProfilePage userId={id} />;
}

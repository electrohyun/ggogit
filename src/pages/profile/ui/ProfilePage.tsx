import { getUserProfile } from "@/features/profile";
import { createClient } from "@/shared/lib/supabase/server";
import ProfileEditableFields from "./ProfileEditableFields";
import styles from "./ProfilePage.module.css";

interface ProfilePageProps {
  userId?: string;
}

export default async function ProfilePage({ userId }: ProfilePageProps) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  const userProfile = await getUserProfile(supabase, userId);
  const canEdit = Boolean(user?.id && (!userId || user.id === userId));

  return (
    <div className={styles.container}>
      <ProfileEditableFields userProfile={userProfile} canEdit={canEdit} />
    </div>
  );
}

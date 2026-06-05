import { getUserProfile } from "@/features/profile";
import { GUEST_NAME_COOKIE } from "@/entities/user/model/guestIdentity";
import { createClient } from "@/shared/lib/supabase/server";
import { cookies } from "next/headers";
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
  const cookieStore = await cookies();
  const guestName = cookieStore.get(GUEST_NAME_COOKIE)?.value;
  const userProfile = await getUserProfile(supabase, userId, guestName);
  const canEdit = Boolean(user?.id && (!userId || user.id === userId));

  return (
    <div className={styles.container}>
      <ProfileEditableFields userProfile={userProfile} canEdit={canEdit} />
    </div>
  );
}

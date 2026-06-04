import { getUserProfile } from "@/features/profile";
import { createClient } from "@/shared/lib/supabase/server";
import ProfileEditableFields from "./ProfileEditableFields";
import styles from "./ProfilePage.module.css";

export default async function ProfilePage() {
  const supabase = await createClient();
  const userProfile = await getUserProfile(supabase);

  return (
    <div className={styles.container}>
      <ProfileEditableFields userProfile={userProfile} />
    </div>
  );
}

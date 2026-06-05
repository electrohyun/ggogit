import { GUEST_NAME_COOKIE } from "@/entities/user/model/guestIdentity";
import { getUserProfile } from "@/features/profile";
import { createClient } from "@/shared/lib/supabase/server";
import { cookies } from "next/headers";
import ProfileEditableFields from "./ProfileEditableFields";
import ProfileLoginPrompt from "./ProfileLoginPrompt";
import styles from "./ProfilePage.module.css";

interface ProfilePageProps {
  userId?: string;
}

const decodeCookieValue = (value: string | undefined) => {
  if (!value) {
    return undefined;
  }

  try {
    return decodeURIComponent(value);
  } catch {
    return value;
  }
};

export default async function ProfilePage({ userId }: ProfilePageProps) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  const isAnonymousViewer = !user || user.is_anonymous;

  const cookieStore = await cookies();
  const guestName = decodeCookieValue(cookieStore.get(GUEST_NAME_COOKIE)?.value);

  const userProfile = await getUserProfile(supabase, userId, guestName);
  const canEdit = Boolean(user?.id && (!userId || user.id === userId));

  return (
    <div className={styles.container}>
      {isAnonymousViewer && !userId ? <ProfileLoginPrompt /> : null}
      <ProfileEditableFields userProfile={userProfile} canEdit={canEdit} />
    </div>
  );
}

import { getCommunityPostsByBoard } from "@/features/community/api/communityPosts";
import { createClient } from "@/shared/lib/supabase/server";

import CommunityGuestbookList from "./CommunityGuestbookList";
import styles from "./CommunityPage.module.css";

export default async function CommunityPage() {
  const supabase = await createClient();
  const guestbookPosts = await getCommunityPostsByBoard(supabase, "guestbook");

  return (
    <div className={styles.container}>
      <div className={styles.titleRow}>
        <h1>방명록</h1>
        <p>({guestbookPosts.length})</p>
      </div>
      <CommunityGuestbookList entries={guestbookPosts} />
    </div>
  );
}

import { getCommunityPostsByBoard } from "@/features/community/api/communityPosts";
import { createClient } from "@/shared/lib/supabase/server";

import CommunityTipList from "./CommunityTipList";
import styles from "./CommunityTipsPage.module.css";

export default async function TipsPage() {
  const supabase = await createClient();
  const tips = await getCommunityPostsByBoard(supabase, "tip");

  return (
    <div className={styles.container}>
      <div className={styles.titleRow}>
        <h1>팁 모음</h1>
      </div>
      <CommunityTipList tips={tips} />
    </div>
  );
}

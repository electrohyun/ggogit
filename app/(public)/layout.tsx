import type { ReactNode } from "react";
import { createClient } from "@supabase/supabase-js";

import { ANONYMOUS_CURRENT_USER } from "@/entities/user";
import { getLatestCommunityPostsByBoard } from "@/features/community/api/communityPosts";
import { AppShell } from "@/widgets/app-shell";

const PUBLIC_NOTICE_LIMIT = 5;

const createPublicSupabaseClient = () =>
  createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    },
  );

export default async function PublicLayout({
  children,
}: {
  children: ReactNode;
}) {
  const supabase = createPublicSupabaseClient();
  const notices = await getLatestCommunityPostsByBoard(
    supabase,
    "notice",
    PUBLIC_NOTICE_LIMIT,
  );

  return (
    <AppShell
      initialCurrentUser={ANONYMOUS_CURRENT_USER}
      initialGuestSessionId={undefined}
      notices={notices}
    >
      {children}
    </AppShell>
  );
}

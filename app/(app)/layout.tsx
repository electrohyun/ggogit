import type { ReactNode } from "react";
import { cookies } from "next/headers";
import {
  GUEST_ENTRY_COOKIE,
  GUEST_NAME_COOKIE,
  GUEST_SESSION_ID_COOKIE,
} from "@/entities/user/model/guestIdentity";
import { getCurrentUser } from "@/features/auth";
import { getLatestCommunityPostsByBoard } from "@/features/community/api/communityPosts";
import { createClient } from "@/shared/lib/supabase/server";
import { AppShell } from "@/widgets/app-shell";

export default async function AppLayout({ children }: { children: ReactNode }) {
  const supabase = await createClient();
  const { data } = await supabase.auth.getClaims();

  const cookieStore = await cookies();
  const isGuest = cookieStore.get(GUEST_ENTRY_COOKIE)?.value === "guest";
  const guestName = cookieStore.get(GUEST_NAME_COOKIE)?.value;
  const guestSessionId = cookieStore.get(GUEST_SESSION_ID_COOKIE)?.value;

  const initialCurrentUser = await getCurrentUser({
    claims: data?.claims ?? null,
    guestName,
    supabase,
  });
  const notices = await getLatestCommunityPostsByBoard(supabase, "notice", 5);

  return (
    <AppShell
      initialCurrentUser={initialCurrentUser}
      initialGuestSessionId={isGuest ? guestSessionId : undefined}
      notices={notices}
    >
      {children}
    </AppShell>
  );
}

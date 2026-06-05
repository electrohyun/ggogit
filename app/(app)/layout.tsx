import type { ReactNode } from "react";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { getCurrentUser } from "@/features/auth";
import { getLatestCommunityPostsByBoard } from "@/features/community/api/communityPosts";
import { GUEST_ENTRY_COOKIE } from "@/features/auth/model/currentUser";
import { createClient } from "@/shared/lib/supabase/server";
import { AppShell } from "@/widgets/app-shell";

export default async function AppLayout({ children }: { children: ReactNode }) {
  const supabase = await createClient();
  const { data } = await supabase.auth.getClaims();

  const cookieStore = await cookies();
  const isGuest = cookieStore.get(GUEST_ENTRY_COOKIE)?.value === "guest";

  if (!data?.claims && !isGuest) {
    redirect("/");
  }

  const initialCurrentUser = await getCurrentUser({
    claims: data?.claims ?? null,
    isGuest,
    supabase,
  });
  const notices = await getLatestCommunityPostsByBoard(supabase, "notice", 5);

  return (
    <AppShell initialCurrentUser={initialCurrentUser} notices={notices}>
      {children}
    </AppShell>
  );
}

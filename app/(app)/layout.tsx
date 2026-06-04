import type { ReactNode } from "react";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import {
  getViewerAvatarUrl,
  getViewerName,
  GUEST_ENTRY_COOKIE,
} from "@/features/auth/model/session";
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

  const viewerName = getViewerName(data?.claims ?? null);
  const viewerAvatarUrl = getViewerAvatarUrl(data?.claims ?? null);

  return (
    <AppShell viewerAvatarUrl={viewerAvatarUrl} viewerName={viewerName}>
      {children}
    </AppShell>
  );
}

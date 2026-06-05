import type { ReactNode } from "react";

import { ANONYMOUS_CURRENT_USER } from "@/entities/user";
import { AppShell } from "@/widgets/app-shell";

export default function PublicLayout({ children }: { children: ReactNode }) {
  return (
    <AppShell
      initialCurrentUser={ANONYMOUS_CURRENT_USER}
      initialGuestSessionId={undefined}
      notices={[]}
    >
      {children}
    </AppShell>
  );
}

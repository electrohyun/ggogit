import type { ReactNode } from "react";

import CommunityPreviewPanel from "./CommunityPreviewPanel";
import CommunityTabs from "./CommunityTabs";
import styles from "./CommunityLayout.module.css";

export default function CommunityLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    <div className={styles.container}>
      <div className={styles.contentGrid}>
        <div className={styles.boardColumn}>
          <CommunityTabs />
          <main className={styles.mainContent}>{children}</main>
        </div>
        <aside className={`${styles.previewPanel} ${styles.desktopOnly}`}>
          <CommunityPreviewPanel />
        </aside>
      </div>
    </div>
  );
}

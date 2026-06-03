"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import styles from "./layout.module.css";

const COMMUNITY_TABS = [
  { href: "/community", label: "방명록" },
  { href: "/community/questions", label: "질문과 대답" },
  { href: "/community/notices", label: "공지사항" },
  { href: "/community/tips", label: "팁 모음" },
];

export default function CommunityTabs() {
  const pathname = usePathname();

  return (
    <nav className={styles.tabbar} aria-label="커뮤니티 메뉴">
      {COMMUNITY_TABS.map((tab) => {
        const isActive = pathname === tab.href;

        return (
          <Link
            key={tab.href}
            href={tab.href}
            className={`${styles.tab} ${isActive ? styles.activeTab : ""}`}
          >
            {tab.label}
          </Link>
        );
      })}
    </nav>
  );
}

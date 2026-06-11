import Image, { type StaticImageData } from "next/image";

import {
  stage1Badge,
  stage2Badge,
  stage3Badge,
  stage4Badge,
  stage5Badge,
} from "@/assets/badges";

import styles from "./RecentBadgeContent.module.css";

const EMPTY_BADGE_MESSAGE = "획득한 배지가 없습니다.";
const BADGE_IMAGES = [
  stage1Badge,
  stage2Badge,
  stage3Badge,
  stage4Badge,
  stage5Badge,
] as const;

export interface RecentBadge {
  badgeName: string;
  chapterDisplayOrder: number;
  chapterTitle: string;
  claimedAt: string;
}

interface RecentBadgeContentProps {
  badge: RecentBadge | null;
}

const formatClaimedDate = (claimedAt: string) => {
  return new Intl.DateTimeFormat("ko-KR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }).format(new Date(claimedAt));
};

export default function RecentBadgeContent({ badge }: RecentBadgeContentProps) {
  if (!badge) {
    return (
      <div className={styles.recentBadgeContent}>
        <p>{EMPTY_BADGE_MESSAGE}</p>
      </div>
    );
  }

  const badgeImage =
    (BADGE_IMAGES[badge.chapterDisplayOrder - 1] as StaticImageData | undefined) ??
    stage1Badge;

  return (
    <div className={styles.recentBadgeContent}>
      <Image
        src={badgeImage}
        alt=""
        width={92}
        height={92}
        className={styles.badgeImage}
      />
      <div className={styles.badgeText}>
        <strong>{badge.badgeName}</strong>
        <span>{badge.chapterTitle}</span>
        <time dateTime={badge.claimedAt}>{formatClaimedDate(badge.claimedAt)}</time>
      </div>
    </div>
  );
}

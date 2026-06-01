import styles from "./RecentBadgeContent.module.css";

const EMPTY_BADGE_MESSAGE = "획득한 배지가 없습니다.";

export default function RecentBadgeContent() {
  return (
    <div className={styles.recentBadgeContent}>
      <p>{EMPTY_BADGE_MESSAGE}</p>
    </div>
  );
}

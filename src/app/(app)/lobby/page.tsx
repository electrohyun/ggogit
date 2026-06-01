import Card from "@/app/_components/Card";
import styles from "./page.module.css";
import ContinueCardContent from "./ContinueCardContent";
import StreakCardContent from "@/app/(app)/lobby/StreakCardContent";
import TodaySummaryContent from "@/app/(app)/lobby/TodaySummaryContent";
import DailyQuestContent from "@/app/(app)/lobby/DailyQuestContent";
import RecentBadgeContent from "@/app/(app)/lobby/RecentBadgeContent";
import LearningRouteContent from "@/app/(app)/lobby/LearningRouteContent";
import CommunityContent from "@/app/(app)/lobby/CommunityContent";
import DailyTipContent from "@/app/(app)/lobby/DailyTipContent";
import QuickActions from "@/app/(app)/lobby/QuickActions";

export default function LobbyPage() {
  return (
    <>
      <div className={styles.lobbyGrid}>
        <Card
          id="continue-card"
          title="이어하기"
          className={`${styles.span4} ${styles.backgroundPrimaryStrong}`}
        >
          <ContinueCardContent />
        </Card>
        <Card
          id="streak-card"
          title="연속 학습"
          className={`${styles.span2} ${styles.backgroundPrimaryPale} ${styles.desktopOnly}`}
        >
          <StreakCardContent />
        </Card>
        <QuickActions className={styles.mobileOnly} />
        <Card
          id="today-summary-card"
          title="오늘의 학습 요약"
          className={`${styles.span2} ${styles.backgroundSecondaryPale} ${styles.desktopOnly}`}
        >
          <TodaySummaryContent />
        </Card>
        <Card
          id="daily-quest-card"
          title="데일리 퀘스트"
          headerAction={<a href="#">13:45 남음</a>}
          className={`${styles.span3} ${styles.backgroundPrimaryPale} `}
        >
          <DailyQuestContent />
        </Card>
        <Card
          id="learning-route-card"
          title="추천 학습 루트"
          className={`${styles.span3} ${styles.backgroundPrimaryPale} ${styles.desktopOnly}`}
        >
          <LearningRouteContent />
        </Card>
        <Card
          id="recent-badge-card"
          title="획득한 배지"
          headerAction={<a href="#">모두 보기</a>}
          className={`${styles.span2} ${styles.backgroundPrimaryPale} ${styles.desktopOnly}`}
        >
          <RecentBadgeContent />
        </Card>
        <Card
          id="community-card"
          title="커뮤니티 인기 질문"
          headerAction={<a href="#">더 보기</a>}
          className={`${styles.span4} ${styles.backgroundPrimaryPale} ${styles.desktopOnly}`}
        >
          <CommunityContent />
        </Card>
        <Card
          id="daily-tip-card"
          title="오늘의 팁"
          className={`${styles.span4} ${styles.backgroundPrimaryPale} `}
        >
          <DailyTipContent />
        </Card>
      </div>
    </>
  );
}

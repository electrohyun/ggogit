import Link from "next/link";
import { getLatestCommunityPostsByBoard } from "@/features/community/api/communityPosts";
import { createClient } from "@/shared/lib/supabase/server";
import { Card } from "@/shared/ui/card";
import styles from "./LobbyPage.module.css";
import CommunityContent from "./CommunityContent";
import ContinueCardContent from "./ContinueCardContent";
import DailyQuestContent from "./DailyQuestContent";
import DailyTipContent from "./DailyTipContent";
import LearningRouteContent from "./LearningRouteContent";
import QuickActions from "./QuickActions";
import RecentBadgeContent from "./RecentBadgeContent";
import StreakCardContent from "./StreakCardContent";
import TodaySummaryContent from "./TodaySummaryContent";

const POPULAR_QUESTION_COUNT = 3;
const DAILY_TIP_POOL_SIZE = 7;

export default async function LobbyPage() {
  const supabase = await createClient();
  const [questionPosts, latestTips] = await Promise.all([
    getLatestCommunityPostsByBoard(supabase, "question", 20),
    getLatestCommunityPostsByBoard(supabase, "tip", DAILY_TIP_POOL_SIZE),
  ]);
  const popularQuestions = [...questionPosts]
    .sort((firstQuestion, secondQuestion) => {
      const firstScore =
        firstQuestion.likeCount * 2 +
        firstQuestion.commentCount * 3 +
        firstQuestion.viewCount;
      const secondScore =
        secondQuestion.likeCount * 2 +
        secondQuestion.commentCount * 3 +
        secondQuestion.viewCount;

      return secondScore - firstScore;
    })
    .slice(0, POPULAR_QUESTION_COUNT);
  const dailyTip =
    latestTips.length > 0
      ? latestTips[new Date().getDay() % latestTips.length]
      : null;

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
          headerAction={<Link href="/community/questions">더 보기</Link>}
          className={`${styles.span4} ${styles.backgroundPrimaryPale} ${styles.desktopOnly}`}
        >
          <CommunityContent questions={popularQuestions} />
        </Card>
        <Card
          id="daily-tip-card"
          title="오늘의 팁"
          className={`${styles.span4} ${styles.backgroundPrimaryPale} `}
        >
          <DailyTipContent tip={dailyTip} />
        </Card>
      </div>
    </>
  );
}

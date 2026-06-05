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
import RecentBadgeContent, { type RecentBadge } from "./RecentBadgeContent";
import StreakCardContent from "./StreakCardContent";
import TodaySummaryContent from "./TodaySummaryContent";

const POPULAR_QUESTION_COUNT = 3;
const DAILY_TIP_POOL_SIZE = 7;

interface LobbyActivityStats {
  currentStreakDays: number;
  lastStudiedOn: string | null;
}

interface ContinueStage {
  href: string;
  progressPercent: number;
  stageNumber: string;
  stageTitle: string;
  totalProgressText: string;
}

const getLatestBadge = async (
  supabase: Awaited<ReturnType<typeof createClient>>,
): Promise<RecentBadge | null> => {
  const { data: badge } = await supabase
    .from("user_chapter_badges")
    .select("chapter_id,claimed_at")
    .order("claimed_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (!badge) {
    return null;
  }

  const { data: chapter } = await supabase
    .from("mini_quiz_chapters")
    .select("display_order,title,badge_name")
    .eq("id", badge.chapter_id)
    .maybeSingle();

  if (!chapter) {
    return null;
  }

  return {
    badgeName: String(chapter.badge_name),
    chapterDisplayOrder: Number(chapter.display_order),
    chapterTitle: String(chapter.title),
    claimedAt: String(badge.claimed_at),
  };
};

const getContinueStage = async (
  supabase: Awaited<ReturnType<typeof createClient>>,
): Promise<ContinueStage> => {
  const [
    {
      data: { user },
    },
    { data: chapters },
    { data: stages },
  ] = await Promise.all([
    supabase.auth.getUser(),
    supabase
      .from("mini_quiz_chapters")
      .select("id,display_order")
      .order("display_order", { ascending: true }),
    supabase
      .from("mini_quiz_stages")
      .select("chapter_id,stage_number,display_order,title,unlock_stage_number")
      .order("display_order", { ascending: true }),
  ]);
  const progressQuery = user
    ? await supabase
        .from("user_stage_progress")
        .select("chapter_id,stage_number,first_cleared_at")
        .eq("user_id", user.id)
    : { data: [] };
  const chapterRows = chapters ?? [];
  const stageRows = stages ?? [];
  const progressRows = progressQuery.data ?? [];
  const progressKeys = new Set(
    progressRows
      .filter((progress) => progress.first_cleared_at)
      .map((progress) => `${progress.chapter_id}:${progress.stage_number}`),
  );
  const clearedStageCount = progressKeys.size;
  const totalStageCount = stageRows.length;
  const progressPercent =
    totalStageCount > 0
      ? Math.round((clearedStageCount / totalStageCount) * 100)
      : 0;
  const orderedStages = chapterRows.flatMap((chapter) =>
    stageRows
      .filter((stage) => stage.chapter_id === chapter.id)
      .map((stage) => ({
        ...stage,
        chapterDisplayOrder: chapter.display_order,
      })),
  );
  const nextStage =
    orderedStages.find((stage) => {
      const stageKey = `${stage.chapter_id}:${stage.stage_number}`;
      const unlockStageKey = `${stage.chapter_id}:${stage.unlock_stage_number}`;

      return (
        !progressKeys.has(stageKey) &&
        (!stage.unlock_stage_number || progressKeys.has(unlockStageKey))
      );
    }) ?? orderedStages[orderedStages.length - 1];

  if (!nextStage) {
    return {
      href: "/study",
      progressPercent: 0,
      stageNumber: "학습하기",
      stageTitle: "첫 스테이지를 시작해요",
      totalProgressText: "0 / 0",
    };
  }

  return {
    href: `/study/${nextStage.chapter_id}/${nextStage.stage_number}`,
    progressPercent,
    stageNumber: `${nextStage.chapterDisplayOrder}-${nextStage.stage_number}`,
    stageTitle:
      progressPercent === 100 ? "모든 스테이지를 완료했어요" : nextStage.title,
    totalProgressText: `${clearedStageCount} / ${totalStageCount}`,
  };
};

const getLobbyActivityStats = async (
  supabase: Awaited<ReturnType<typeof createClient>>,
): Promise<LobbyActivityStats> => {
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return {
      currentStreakDays: 0,
      lastStudiedOn: null,
    };
  }

  const { data } = await supabase
    .from("user_activity_stats")
    .select("current_streak_days,last_studied_on")
    .eq("user_id", user.id)
    .maybeSingle();

  return {
    currentStreakDays: data?.current_streak_days ?? 0,
    lastStudiedOn: data?.last_studied_on ?? null,
  };
};

export default async function LobbyPage() {
  const supabase = await createClient();
  const [questionPosts, latestTips, latestBadge, activityStats, continueStage] =
    await Promise.all([
    getLatestCommunityPostsByBoard(supabase, "question", 20),
    getLatestCommunityPostsByBoard(supabase, "tip", DAILY_TIP_POOL_SIZE),
    getLatestBadge(supabase),
    getLobbyActivityStats(supabase),
    getContinueStage(supabase),
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
          <ContinueCardContent
            href={continueStage.href}
            progressPercent={continueStage.progressPercent}
            stageNumber={continueStage.stageNumber}
            stageTitle={continueStage.stageTitle}
            totalProgressText={continueStage.totalProgressText}
          />
        </Card>
        <Card
          id="streak-card"
          title="연속 학습"
          className={`${styles.span2} ${styles.backgroundPrimaryPale} ${styles.desktopOnly}`}
        >
          <StreakCardContent
            currentStreakDays={activityStats.currentStreakDays}
            lastStudiedOn={activityStats.lastStudiedOn}
          />
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
          title="최근 획득 배지"
          className={`${styles.span2} ${styles.backgroundPrimaryPale} ${styles.desktopOnly}`}
        >
          <RecentBadgeContent badge={latestBadge} />
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

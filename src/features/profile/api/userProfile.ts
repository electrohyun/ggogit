import type { SupabaseClient } from "@supabase/supabase-js";
import type { UserProfile } from "@/entities/profile";
import { normalizeAvatarUrl } from "@/features/auth/model/currentUser";

const formatJoinedAt = (dateValue: string) => {
  const date = new Date(dateValue);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}년 ${month}월 ${day}일`;
};

interface MiniQuizAttemptStatsRow {
  correct_count: number;
  wrong_count: number;
}

const getGuestUserProfile = (guestName?: string): UserProfile => ({
  name: guestName ?? "Guest",
  bio: "",
  avatarUrl: null,
  joinedAt: "-",
  quizStats: {
    solvedCount: 0,
    correctCount: 0,
    wrongCount: 0,
  },
  activityStats: {
    currentStreakDays: 0,
    bestStreakDays: 0,
    currentBeans: 0,
    totalBeans: 0,
  },
});

export const getUserProfile = async (
  supabase: SupabaseClient,
  userId?: string,
  guestName?: string,
): Promise<UserProfile> => {
  const {
    data: { user },
  } = userId
    ? { data: { user: null } }
    : await supabase.auth.getUser();
  const targetUserId = userId ?? user?.id;

  if (!targetUserId) {
    return getGuestUserProfile(guestName);
  }

  const profileQuery = supabase
    .from("profiles")
    .select("name,bio,avatar_url,created_at");
  const activityStatsQuery = supabase
    .from("user_activity_stats")
    .select("current_streak_days,best_streak_days");
  const walletQuery = supabase
    .from("user_wallets")
    .select("current_beans,total_earned_beans");
  const miniQuizAttemptsQuery = supabase
    .from("mini_quiz_stage_attempts")
    .select("correct_count,wrong_count")
    .in("status", ["completed", "failed"]);

  profileQuery.eq("id", targetUserId);
  activityStatsQuery.eq("user_id", targetUserId);
  walletQuery.eq("user_id", targetUserId);
  miniQuizAttemptsQuery.eq("user_id", targetUserId);

  const [
    { data: profile },
    { data: activityStats },
    { data: wallet },
    { data: miniQuizAttempts },
  ] = await Promise.all([
    profileQuery.maybeSingle(),
    activityStatsQuery.maybeSingle(),
    walletQuery.maybeSingle(),
    miniQuizAttemptsQuery,
  ]);
  const quizStats = ((miniQuizAttempts ?? []) as MiniQuizAttemptStatsRow[])
    .reduce(
      (stats, attempt) => ({
        solvedCount:
          stats.solvedCount + attempt.correct_count + attempt.wrong_count,
        correctCount: stats.correctCount + attempt.correct_count,
        wrongCount: stats.wrongCount + attempt.wrong_count,
      }),
      {
        solvedCount: 0,
        correctCount: 0,
        wrongCount: 0,
      },
    );

  return {
    name: profile?.name ?? "Guest",
    bio: profile?.bio ?? "",
    avatarUrl: normalizeAvatarUrl(profile?.avatar_url),
    joinedAt: profile?.created_at ? formatJoinedAt(profile.created_at) : "-",
    quizStats,
    activityStats: {
      currentStreakDays: activityStats?.current_streak_days ?? 0,
      bestStreakDays: activityStats?.best_streak_days ?? 0,
      currentBeans: wallet?.current_beans ?? 0,
      totalBeans: wallet?.total_earned_beans ?? 0,
    },
  };
};

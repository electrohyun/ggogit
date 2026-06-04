import type { SupabaseClient } from "@supabase/supabase-js";
import type { UserProfile } from "@/entities/profile";

const formatJoinedAt = (dateValue: string) => {
  const date = new Date(dateValue);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}년 ${month}월 ${day}일`;
};

export const getUserProfile = async (
  supabase: SupabaseClient,
): Promise<UserProfile> => {
  const [{ data: profile }, { data: activityStats }, { data: wallet }] =
    await Promise.all([
      supabase
        .from("profiles")
        .select("name,bio,avatar_url,created_at")
        .maybeSingle(),
      supabase
        .from("user_activity_stats")
        .select("current_streak_days,best_streak_days")
        .maybeSingle(),
      supabase
        .from("user_wallets")
        .select("current_beans,total_earned_beans")
        .maybeSingle(),
    ]);

  return {
    name: profile?.name ?? "Guest",
    bio: profile?.bio ?? "",
    avatarUrl: profile?.avatar_url ?? null,
    joinedAt: profile?.created_at ? formatJoinedAt(profile.created_at) : "-",
    quizStats: {
      solvedCount: 0,
      correctCount: 0,
      wrongCount: 0,
    },
    activityStats: {
      currentStreakDays: activityStats?.current_streak_days ?? 0,
      bestStreakDays: activityStats?.best_streak_days ?? 0,
      currentBeans: wallet?.current_beans ?? 0,
      totalBeans: wallet?.total_earned_beans ?? 0,
    },
  };
};

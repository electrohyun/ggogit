import type { JwtPayload, SupabaseClient } from "@supabase/supabase-js";
import { GUEST_CURRENT_USER, type CurrentUser } from "@/entities/user";
import { getCurrentUserAvatarUrl, getCurrentUserName } from "../model/currentUser";

interface GetCurrentUserParams {
  claims: JwtPayload | null;
  guestName?: string;
  isGuest: boolean;
  supabase: SupabaseClient;
}

export const getCurrentUser = async ({
  claims,
  guestName,
  isGuest,
  supabase,
}: GetCurrentUserParams): Promise<CurrentUser> => {
  if (!claims) {
    return {
      ...GUEST_CURRENT_USER,
      isGuest,
      name: guestName ?? GUEST_CURRENT_USER.name,
    };
  }

  const userId = claims.sub;
  const [
    { data: profile, error: profileError },
    { data: activityStats, error: activityStatsError },
    { data: wallet, error: walletError },
  ] = await Promise.all([
    supabase
      .from("profiles")
      .select("name,bio,avatar_url")
      .eq("id", userId)
      .maybeSingle(),
    supabase
      .from("user_activity_stats")
      .select("current_streak_days")
      .eq("user_id", userId)
      .maybeSingle(),
    supabase
      .from("user_wallets")
      .select("current_beans")
      .eq("user_id", userId)
      .maybeSingle(),
  ]);

  if (profileError) {
    console.error("현재 사용자 프로필을 불러오지 못했습니다.", profileError);
  }

  if (activityStatsError) {
    console.error(
      "현재 사용자 활동 정보를 불러오지 못했습니다.",
      activityStatsError,
    );
  }

  if (walletError) {
    console.error("현재 사용자 콩 정보를 불러오지 못했습니다.", walletError);
  }

  return {
    isGuest: false,
    name: profile?.name ?? getCurrentUserName(claims),
    bio: profile?.bio ?? "",
    avatarUrl: profile?.avatar_url ?? getCurrentUserAvatarUrl(claims),
    currentStreakDays: activityStats?.current_streak_days ?? 0,
    currentBeans: wallet?.current_beans ?? 0,
  };
};

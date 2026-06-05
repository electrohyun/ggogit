"use server";

import { revalidatePath } from "next/cache";

import { createClient } from "@/shared/lib/supabase/server";

interface ClaimDailyQuestRewardRow {
  already_claimed: boolean;
  bean_transaction_id: string | null;
  claimed_at: string;
  quest_key: string;
  reward_amount: number;
}

export interface ClaimDailyQuestRewardsState {
  earnedBeans: number;
  message: string | null;
  success: boolean;
}

export const claimDailyQuestRewards = async () => {
  const supabase = await createClient();
  const { data, error } = await supabase.rpc("claim_user_daily_quest_rewards");

  if (error) {
    return {
      claimedRewards: [],
      earnedBeans: 0,
      error: error.message,
      success: false,
    };
  }

  revalidatePath("/lobby");
  const claimedRewards = (data ?? []) as ClaimDailyQuestRewardRow[];
  const earnedBeans = claimedRewards.reduce(
    (sum, reward) =>
      reward.already_claimed ? sum : sum + Number(reward.reward_amount),
    0,
  );

  return {
    claimedRewards,
    earnedBeans,
    error: null,
    success: true,
  };
};

export const claimDailyQuestRewardsAction = async (
  _previousState: ClaimDailyQuestRewardsState,
  _formData: FormData,
): Promise<ClaimDailyQuestRewardsState> => {
  const result = await claimDailyQuestRewards();

  if (!result.success) {
    return {
      earnedBeans: 0,
      message: result.error,
      success: false,
    };
  }

  return {
    earnedBeans: result.earnedBeans,
    message: result.earnedBeans > 0 ? null : "새로 받을 수 있는 보상이 없어요.",
    success: true,
  };
};

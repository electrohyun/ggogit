export type DailyQuestStatus = "inProgress" | "completed" | "claimed";
export type DailyQuestKey = "login" | "community_post" | "daily_challenge";

export interface DailyQuest {
  id: DailyQuestKey;
  title: string;
  currentProgress: number;
  targetProgress: number;
  reward: number;
  status: DailyQuestStatus;
}

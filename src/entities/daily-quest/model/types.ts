export type DailyQuestStatus = "inProgress" | "completed" | "claimed";

export interface DailyQuest {
  id: string;
  title: string;
  currentProgress: number;
  targetProgress: number;
  reward: number;
  status: DailyQuestStatus;
}

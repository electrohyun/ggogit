export type StageStatus = "completed" | "available" | "locked";

export interface MiniQuizStage {
  id: string;
  title: string;
  command: string;
  description: string;
  status: StageStatus;
  starCount: 0 | 1 | 2 | 3;
}

export interface MiniQuizChapter {
  id: string;
  title: string;
  description: string;
  commands: string[];
  badgeName: string;
  isBadgeUnlocked?: boolean;
  stages: MiniQuizStage[];
}

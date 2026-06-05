export type StageStatus = "completed" | "available" | "locked";

export interface MiniQuizStage {
  id: string;
  stageNumber: number;
  title: string;
  command: string;
  description: string;
  unlockStageNumber?: number | null;
  status: StageStatus;
  starCount: 0 | 1 | 2 | 3;
}

export interface MiniQuizChapter {
  id: string;
  title: string;
  description: string;
  commands: string[];
  badgeName: string;
  isBadgeClaimed?: boolean;
  canClaimBadge?: boolean;
  isBadgeUnlocked?: boolean;
  stages: MiniQuizStage[];
}

import type { MiniQuizChapter } from "@/entities/mini-quiz";

export interface MiniQuizChapterRow {
  id: string;
  display_order: number;
  title: string;
  description: string;
  commands: string[];
  badge_name: string;
}

export interface MiniQuizStageRow {
  chapter_id: string;
  stage_number: number;
  slug: string;
  display_order: number;
  title: string;
  command: string;
  description: string;
  unlock_stage_number: number | null;
}

export interface UserStageProgressRow {
  chapter_id: string;
  stage_number: number;
  best_star_count: number;
  first_cleared_at: string | null;
}

export interface UserChapterBadgeRow {
  chapter_id: string;
}

export interface UserActivityStatsRow {
  current_streak_days: number;
}

export interface MiniQuizStudySummary {
  clearedStageCount: number;
  currentStreakDays: number;
  totalStageCount: number;
  totalStarCount: number;
}

export interface MiniQuizStudyData {
  chapters: MiniQuizChapter[];
  summary: MiniQuizStudySummary;
}

import {
  MINI_QUIZ_CHAPTERS,
  type MiniQuizStage,
  type StageStatus,
} from "@/entities/mini-quiz";
import type {
  MiniQuizChapterRow,
  MiniQuizStageRow,
  MiniQuizStudyData,
  UserActivityStatsRow,
  UserChapterBadgeRow,
  UserStageProgressRow,
} from "./types";

const BADGE_REQUIRED_STAR_COUNT = 3;

const getStageKey = (chapterId: string, stageNumber: number) => {
  return `${chapterId}:${stageNumber}`;
};

interface MapMiniQuizStudyDataParams {
  activityStats: UserActivityStatsRow | null;
  badgeRows: UserChapterBadgeRow[];
  chapters: MiniQuizChapterRow[];
  progressRows: UserStageProgressRow[];
  stages: MiniQuizStageRow[];
  userId?: string;
}

const getStageStatus = (
  stage: MiniQuizStageRow,
  progressByStageKey: Map<string, UserStageProgressRow>,
): StageStatus => {
  const progress = progressByStageKey.get(
    getStageKey(stage.chapter_id, stage.stage_number),
  );

  if (progress?.first_cleared_at) {
    return "completed";
  }

  // 선행 스테이지가 없는 첫 스테이지는 바로 도전할 수 있다.
  if (!stage.unlock_stage_number) {
    return "available";
  }

  // 선행 스테이지가 클리어된 경우에만 도전할 수 있다.
  return progressByStageKey.get(
    getStageKey(stage.chapter_id, stage.unlock_stage_number),
  )?.first_cleared_at
    ? "available"
    : "locked";
};

export const preventEmptyStudyData = (): MiniQuizStudyData => {
  const totalStageCount = MINI_QUIZ_CHAPTERS.reduce(
    (total, chapter) => total + chapter.stages.length,
    0,
  );
  const totalStarCount = MINI_QUIZ_CHAPTERS.reduce(
    (total, chapter) =>
      total +
      chapter.stages.reduce(
        (chapterTotal, stage) => chapterTotal + stage.starCount,
        0,
      ),
    0,
  );
  const clearedStageCount = MINI_QUIZ_CHAPTERS.reduce(
    (total, chapter) =>
      total +
      chapter.stages.filter((stage) => stage.status === "completed").length,
    0,
  );

  return {
    chapters: [...MINI_QUIZ_CHAPTERS],
    summary: {
      clearedStageCount,
      currentStreakDays: 0,
      totalStageCount,
      totalStarCount,
    },
  };
};

export const mapMiniQuizStudyData = ({
  activityStats,
  badgeRows,
  chapters,
  progressRows,
  stages,
  userId,
}: MapMiniQuizStudyDataParams): MiniQuizStudyData => {
  const progressByStageKey = new Map(
    progressRows.map((progress) => [
      getStageKey(progress.chapter_id, progress.stage_number),
      progress,
    ]),
  );
  const claimedChapterIds = new Set(
    badgeRows.map((badge) => badge.chapter_id),
  );
  const stagesByChapterId = new Map<string, MiniQuizStageRow[]>();

  for (const stage of stages) {
    const chapterStages = stagesByChapterId.get(stage.chapter_id) ?? [];
    chapterStages.push(stage);
    stagesByChapterId.set(stage.chapter_id, chapterStages);
  }

  const mappedChapters = chapters.map((chapter) => {
    const chapterStages = stagesByChapterId.get(chapter.id) ?? [];
    const mappedStages = chapterStages.map((stage): MiniQuizStage => {
      const progress = progressByStageKey.get(
        getStageKey(stage.chapter_id, stage.stage_number),
      );

      return {
        id: String(stage.stage_number),
        stageNumber: stage.stage_number,
        title: stage.title,
        command: stage.command,
        description: stage.description,
        unlockStageNumber: stage.unlock_stage_number,
        status: getStageStatus(stage, progressByStageKey),
        starCount: (progress?.best_star_count ??
          0) as MiniQuizStage["starCount"],
      };
    });
    const isBadgeClaimed = claimedChapterIds.has(chapter.id);
    const canClaimBadge =
      userId !== undefined &&
      mappedStages.length > 0 &&
      mappedStages.every(
        (stage) => stage.starCount >= BADGE_REQUIRED_STAR_COUNT,
      ) &&
      !isBadgeClaimed;

    return {
      id: chapter.id,
      title: chapter.title,
      description: chapter.description,
      commands: chapter.commands,
      badgeName: chapter.badge_name,
      isBadgeClaimed,
      canClaimBadge,
      isBadgeUnlocked: canClaimBadge || isBadgeClaimed,
      stages: mappedStages,
    };
  });

  const allStages = mappedChapters.flatMap((chapter) => chapter.stages);

  return {
    chapters: mappedChapters,
    summary: {
      clearedStageCount: allStages.filter(
        (stage) => stage.status === "completed",
      ).length,
      currentStreakDays: activityStats?.current_streak_days ?? 0,
      totalStageCount: allStages.length,
      totalStarCount: allStages.reduce(
        (total, stage) => total + stage.starCount,
        0,
      ),
    },
  };
};

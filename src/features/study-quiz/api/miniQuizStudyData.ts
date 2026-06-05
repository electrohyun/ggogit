import type { SupabaseClient } from "@supabase/supabase-js";

import {
  mapMiniQuizStudyData,
  preventEmptyStudyData,
} from "../model/studyQuizDataMapper";
import type {
  MiniQuizChapterRow,
  MiniQuizStageRow,
  MiniQuizStudyData,
  UserActivityStatsRow,
  UserChapterBadgeRow,
  UserStageProgressRow,
} from "../model/types";

export const getMiniQuizStudyData = async (
  supabase: SupabaseClient,
): Promise<MiniQuizStudyData> => {
  const [
    { data: chapters, error: chaptersError },
    { data: stages, error: stagesError },
    {
      data: { user },
    },
  ] = await Promise.all([
    supabase
      .from("mini_quiz_chapters")
      .select("id,display_order,title,description,commands,badge_name")
      .order("display_order", { ascending: true }),
    supabase
      .from("mini_quiz_stages")
      .select(
        "chapter_id,stage_number,slug,display_order,title,command,description,unlock_stage_number",
      )
      .order("display_order", { ascending: true }),
    supabase.auth.getUser(),
  ]);

  if (chaptersError || stagesError || !chapters || !stages) {
    console.error("미니 퀴즈 학습 데이터를 불러오지 못했습니다.", {
      chaptersError,
      stagesError,
    });

    return preventEmptyStudyData();
  }

  const userId = user?.id;
  const [
    { data: progressRows, error: progressError },
    { data: badgeRows, error: badgeError },
    { data: activityStats, error: activityStatsError },
  ] = userId
    ? await Promise.all([
        supabase
          .from("user_stage_progress")
          .select("chapter_id,stage_number,best_star_count,first_cleared_at")
          .eq("user_id", userId),
        supabase
          .from("user_chapter_badges")
          .select("chapter_id")
          .eq("user_id", userId),
        supabase
          .from("user_activity_stats")
          .select("current_streak_days")
          .eq("user_id", userId)
          .maybeSingle(),
      ])
    : [
        { data: [], error: null },
        { data: [], error: null },
        { data: null, error: null },
      ];

  if (progressError) {
    console.error("미니 퀴즈 진행도를 불러오지 못했습니다.", progressError);
  }

  if (badgeError) {
    console.error("미니 퀴즈 배지 정보를 불러오지 못했습니다.", badgeError);
  }

  if (activityStatsError) {
    console.error(
      "미니 퀴즈 활동 정보를 불러오지 못했습니다.",
      activityStatsError,
    );
  }

  return mapMiniQuizStudyData({
    activityStats: activityStats as UserActivityStatsRow | null,
    badgeRows: (badgeRows ?? []) as UserChapterBadgeRow[],
    chapters: chapters as MiniQuizChapterRow[],
    progressRows: (progressRows ?? []) as UserStageProgressRow[],
    stages: stages as MiniQuizStageRow[],
    userId,
  });
};

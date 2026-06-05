"use server";

import { revalidatePath } from "next/cache";

import { createClient } from "@/shared/lib/supabase/server";

interface ClaimMiniQuizChapterBadgeRow {
  claimed_at: string;
  earned_beans: number;
}

export const claimMiniQuizChapterBadge = async (chapterId: string) => {
  const supabase = await createClient();
  const { data, error } = await supabase
    .rpc("claim_mini_quiz_chapter_badge", {
      p_chapter_id: chapterId,
    })
    .single();

  if (error) {
    return {
      earnedBeans: 0,
      error: error.message,
      success: false,
    };
  }

  revalidatePath("/study");
  const result = data as ClaimMiniQuizChapterBadgeRow | null;

  return {
    earnedBeans: Number(result?.earned_beans ?? 0),
    error: null,
    success: true,
  };
};

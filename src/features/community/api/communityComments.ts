import type { SupabaseClient } from "@supabase/supabase-js";

import {
  toCommunityComment,
  type CommunityComment,
  type CommunityCommentRow,
} from "@/entities/community";

const COMMUNITY_COMMENT_SELECT =
  "id,post_id,content,author_id,author_name,author_role,like_count,is_deleted,created_at,updated_at";

export const getCommunityCommentsByPostId = async (
  supabase: SupabaseClient,
  postId: number,
): Promise<CommunityComment[]> => {
  const { data, error } = await supabase
    .from("community_comments")
    .select(COMMUNITY_COMMENT_SELECT)
    .eq("post_id", postId)
    .eq("is_deleted", false)
    .order("created_at", { ascending: true });

  if (error) {
    console.error("커뮤니티 댓글을 조회하지 못했습니다.", error);
    return [];
  }

  return (data as CommunityCommentRow[]).map(toCommunityComment);
};

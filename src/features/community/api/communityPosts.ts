import type { SupabaseClient } from "@supabase/supabase-js";

import {
  toCommunityPost,
  type CommunityPost,
  type CommunityPostRow,
} from "@/entities/community";

export const COMMUNITY_POST_SELECT =
  "id,board_post_number,board,title,content_blocks,author_id,author_name,author_role,tags,view_count,like_count,comment_count,is_pinned,is_published,created_at,updated_at,profiles!community_posts_author_profile_fkey(avatar_url)";

export const getCommunityPostsByBoard = async (
  supabase: SupabaseClient,
  board: CommunityPost["board"],
): Promise<CommunityPost[]> => {
  const { data, error } = await supabase
    .from("community_posts")
    .select(COMMUNITY_POST_SELECT)
    .eq("board", board)
    .eq("is_published", true)
    .order("is_pinned", { ascending: false })
    .order("created_at", { ascending: false });

  if (error) {
    console.error("커뮤니티 게시글을 조회하지 못했습니다.", error);
    return [];
  }

  return (data as CommunityPostRow[]).map(toCommunityPost);
};

export const getLatestCommunityPostsByBoard = async (
  supabase: SupabaseClient,
  board: CommunityPost["board"],
  limit: number,
): Promise<CommunityPost[]> => {
  const { data, error } = await supabase
    .from("community_posts")
    .select(COMMUNITY_POST_SELECT)
    .eq("board", board)
    .eq("is_published", true)
    .order("created_at", { ascending: false })
    .limit(limit);

  if (error) {
    console.error("커뮤니티 최신 게시글을 조회하지 못했습니다.", error);
    return [];
  }

  return (data as CommunityPostRow[]).map(toCommunityPost);
};

export const getCommunityPostById = async (
  supabase: SupabaseClient,
  board: CommunityPost["board"],
  id: string,
): Promise<CommunityPost | null> => {
  const postId = Number(id);

  if (!Number.isInteger(postId)) {
    return null;
  }

  const { data, error } = await supabase
    .from("community_posts")
    .select(COMMUNITY_POST_SELECT)
    .eq("board", board)
    .eq("is_published", true)
    .eq("id", postId)
    .maybeSingle();

  if (error) {
    console.error("커뮤니티 게시글 상세를 조회하지 못했습니다.", error);
    return null;
  }

  if (!data) {
    return null;
  }

  return toCommunityPost(data as CommunityPostRow);
};

import type { SupabaseClient } from "@supabase/supabase-js";

import {
  toCommunityPost,
  type CommunityPost,
  type CommunityPostRow,
} from "@/entities/community";

const COMMUNITY_POST_SELECT =
  "id,board,title,content_blocks,author_id,author_name,author_role,tags,view_count,like_count,comment_count,is_pinned,is_published,created_at,updated_at";

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
  const { data, error } = await supabase
    .from("community_posts")
    .select(COMMUNITY_POST_SELECT)
    .eq("board", board)
    .eq("is_published", true)
    .eq("id", Number(id))
    .maybeSingle();

  if (error) {
    console.error("커뮤니티 게시글 상세를 조회하지 못했습니다.", error);
    return null;
  }

  return data ? toCommunityPost(data as CommunityPostRow) : null;
};

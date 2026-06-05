"use server";

import { revalidatePath } from "next/cache";

import type { ActionResult } from "@/shared";
import { createClient } from "@/shared/lib/supabase/server";

interface LikeCommunityPostInput {
  postId: number;
  guestSessionId: string;
}

interface CommunityPostCountData {
  likeCount: number;
  didLike: boolean;
}

interface ViewCommunityPostInput {
  postId: number;
  guestSessionId: string;
}

interface ViewCommunityPostData {
  viewCount: number;
  didView: boolean;
}

interface LikeCommunityPostRpcRow {
  like_count: number;
  did_like: boolean;
}

interface ViewCommunityPostRpcRow {
  view_count: number;
  did_view: boolean;
}

const getFirstRpcRow = <TRow>(data: TRow[] | TRow | null) =>
  Array.isArray(data) ? data[0] : data;

export const likeCommunityPost = async ({
  postId,
  guestSessionId,
}: LikeCommunityPostInput): Promise<ActionResult<CommunityPostCountData>> => {
  const supabase = await createClient();
  const { data, error } = await supabase.rpc("like_community_post_once", {
    target_post_id: postId,
    guest_session_id: guestSessionId,
  });

  if (error) {
    console.error("커뮤니티 게시글 따봉을 등록하지 못했습니다.", error);

    return {
      ok: false,
      message: "따봉을 등록하지 못했습니다.",
    };
  }

  const likeResult = getFirstRpcRow(data as LikeCommunityPostRpcRow[] | null);

  revalidatePath(`/community/questions/${postId}`);

  return {
    ok: true,
    data: {
      likeCount: Number(likeResult?.like_count ?? 0),
      didLike: Boolean(likeResult?.did_like),
    },
  };
};

export const viewCommunityPost = async ({
  postId,
  guestSessionId,
}: ViewCommunityPostInput): Promise<ActionResult<ViewCommunityPostData>> => {
  const supabase = await createClient();
  const { data, error } = await supabase.rpc("view_community_post_once", {
    target_post_id: postId,
    guest_session_id: guestSessionId,
  });

  if (error) {
    console.error("커뮤니티 게시글 조회수를 등록하지 못했습니다.", error);

    return {
      ok: false,
      message: "조회수를 등록하지 못했습니다.",
    };
  }

  const viewResult = getFirstRpcRow(data as ViewCommunityPostRpcRow[] | null);

  return {
    ok: true,
    data: {
      viewCount: Number(viewResult?.view_count ?? 0),
      didView: Boolean(viewResult?.did_view),
    },
  };
};

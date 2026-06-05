"use server";

import { revalidatePath } from "next/cache";

import {
  toCommunityComment,
  type CommunityComment,
  type CommunityCommentInsertRow,
} from "@/entities/community";
import type { ActionResult } from "@/shared";
import { createClient } from "@/shared/lib/supabase/server";
import { COMMUNITY_COMMENT_SELECT } from "./communityComments";
import { getCommunityPostAuthor } from "./communityPostAuthor";

interface CreateCommunityCommentInput {
  postId: number;
  content: string;
  guestSessionId: string;
  guestName: string;
}

export const createCommunityComment = async ({
  postId,
  content,
  guestSessionId,
  guestName,
}: CreateCommunityCommentInput): Promise<ActionResult<CommunityComment>> => {
  const newContent = content.trim();

  if (!newContent) {
    return {
      ok: false,
      message: "답변 내용을 입력해주세요.",
    };
  }

  const supabase = await createClient();
  const { author, authorAvatarUrl } = await getCommunityPostAuthor(supabase, {
    guestSessionId,
    guestName,
  });

  if (
    author.author_role === "guest" &&
    (!author.guest_session_id || !author.author_name)
  ) {
    return {
      ok: false,
      message: "게스트 정보를 확인하지 못했습니다. 새로고침 후 다시 시도해주세요.",
    };
  }

  const insertRow: CommunityCommentInsertRow = {
    post_id: postId,
    content: newContent,
    author_id: author.author_id,
    guest_session_id: author.guest_session_id,
    author_name: author.author_name,
    author_role: author.author_role,
  };

  const { data, error } = await supabase
    .from("community_comments")
    .insert(insertRow)
    .select(COMMUNITY_COMMENT_SELECT)
    .single();

  if (error) {
    console.error("커뮤니티 댓글을 등록하지 못했습니다.", error);

    return {
      ok: false,
      message: "답변을 등록하지 못했습니다.",
    };
  }

  revalidatePath(`/community/questions/${postId}`);

  return {
    ok: true,
    data: {
      ...toCommunityComment(data),
      authorAvatarUrl,
    },
  };
};

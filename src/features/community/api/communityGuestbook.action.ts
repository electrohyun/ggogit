"use server";

import { revalidatePath } from "next/cache";

import {
  createCommunityParagraphBlocks,
  toCommunityPost,
  type CommunityPost,
  type CommunityPostInsertRow,
} from "@/entities/community";
import type { ActionResult } from "@/shared";
import { createClient } from "@/shared/lib/supabase/server";
import { getCommunityPostAuthor } from "./communityPostAuthor";
import { COMMUNITY_POST_SELECT } from "./communityPosts";

interface CreateGuestbookPostInput {
  content: string;
  guestSessionId: string;
  guestName: string;
}

export const createGuestbookPost = async ({
  content,
  guestSessionId,
  guestName,
}: CreateGuestbookPostInput): Promise<ActionResult<CommunityPost>> => {
  const newContent = content.trim();

  if (!newContent) {
    return {
      ok: false,
      message: "방명록 내용을 입력해주세요.",
    };
  }

  const supabase = await createClient();
  const { author, authorAvatarUrl } = await getCommunityPostAuthor(supabase, {
    guestSessionId,
    guestName,
  });

  if (author.author_role === "guest" && (!author.guest_session_id || !author.author_name)) {
    return {
      ok: false,
      message: "게스트 정보를 확인하지 못했습니다. 새로고침 후 다시 시도해주세요.",
    };
  }

  const insertRow: CommunityPostInsertRow = {
    board: "guestbook",
    title: null,
    content_blocks: createCommunityParagraphBlocks(newContent),
    ...author,
  };

  const { data, error } = await supabase
    .from("community_posts")
    .insert(insertRow)
    .select(COMMUNITY_POST_SELECT)
    .single();

  if (error) {
    console.error("방명록을 등록하지 못했습니다.", error);

    return {
      ok: false,
      message: "방명록을 등록하지 못했습니다.",
    };
  }

  revalidatePath("/community");

  return {
    ok: true,
    data: {
      ...toCommunityPost(data),
      authorAvatarUrl,
    },
  };
};

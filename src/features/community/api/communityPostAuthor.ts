import type { SupabaseClient } from "@supabase/supabase-js";

import type { CommunityPost, CommunityPostInsertRow } from "@/entities/community";
import {
  getUserMetadataName,
  normalizeAvatarUrl,
} from "@/features/auth/model/currentUser";

interface CommunityGuestAuthorInput {
  guestSessionId: string;
  guestName: string;
}

interface CommunityPostAuthorResult {
  author: Pick<
    CommunityPostInsertRow,
    "author_id" | "guest_session_id" | "author_name" | "author_role"
  >;
  authorAvatarUrl?: CommunityPost["authorAvatarUrl"];
}

export const getCommunityPostAuthor = async (
  supabase: SupabaseClient,
  { guestSessionId, guestName }: CommunityGuestAuthorInput,
): Promise<CommunityPostAuthorResult> => {
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError) {
    console.error("커뮤니티 작성자 정보를 확인하지 못했습니다.", userError);
  }

  if (!user) {
    return {
      author: {
        author_id: null,
        guest_session_id: guestSessionId.trim(),
        author_name: guestName.trim(),
        author_role: "guest",
      },
    };
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("name,avatar_url")
    .eq("id", user.id)
    .maybeSingle();

  return {
    author: {
      author_id: user.id,
      guest_session_id: null,
      author_name:
        profile?.name ??
        getUserMetadataName(user.user_metadata) ??
        user.email ??
        "User",
      author_role: "user",
    },
    authorAvatarUrl: normalizeAvatarUrl(profile?.avatar_url) ?? undefined,
  };
};

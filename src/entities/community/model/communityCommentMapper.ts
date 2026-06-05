import type { CommunityComment, CommunityCommentRow } from "@/entities/community";
import { normalizeAvatarUrl } from "@/features/auth/model/currentUser";
import { formatDateWithDots } from "@/shared/lib/date";

const getCommunityCommentAuthorAvatarUrl = (row: CommunityCommentRow) => {
  const profile = Array.isArray(row.profiles) ? row.profiles[0] : row.profiles;

  return normalizeAvatarUrl(profile?.avatar_url) ?? undefined;
};

export const toCommunityComment = (
  row: CommunityCommentRow,
): CommunityComment => ({
  id: row.id,
  postId: row.post_id,
  content: row.content,
  authorId: row.author_id ?? undefined,
  authorName: row.author_name,
  authorAvatarUrl: getCommunityCommentAuthorAvatarUrl(row),
  authorRole: row.author_role,
  likeCount: row.like_count,
  isDeleted: row.is_deleted,
  createdAt: formatDateWithDots(row.created_at),
  createdAtDateTime: row.created_at,
  updatedAt: row.updated_at,
});

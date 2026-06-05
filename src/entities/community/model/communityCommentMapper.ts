import type { CommunityComment, CommunityCommentRow } from "@/entities/community";
import { formatDateWithDots } from "@/shared/lib/date";

export const toCommunityComment = (
  row: CommunityCommentRow,
): CommunityComment => ({
  id: row.id,
  postId: row.post_id,
  content: row.content,
  authorId: row.author_id ?? undefined,
  authorName: row.author_name,
  authorRole: row.author_role,
  likeCount: row.like_count,
  isDeleted: row.is_deleted,
  createdAt: formatDateWithDots(row.created_at),
  createdAtDateTime: row.created_at,
  updatedAt: row.updated_at,
});

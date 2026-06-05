import type { StaticImageData } from "next/image";

import { notice } from "@/assets/community";
import type {
  CommunityContentBlock,
  CommunityContentBlockRow,
  CommunityPost,
  CommunityPostRow,
} from "@/entities/community";
import { formatDateWithDots } from "@/shared/lib/date";

// DB에는 정적 이미지 import를 저장할 수 없어 src 문자열을 앱 에셋으로 바꿉니다.
// 차후 백오피스 기능에 활용
const COMMUNITY_IMAGE_ASSETS: Record<string, StaticImageData> = {
  "notice.webp": notice,
};

const toCommunityContentBlock = (
  block: CommunityContentBlockRow,
): CommunityContentBlock | null => {
  if (block.kind === "image" && block.src) {
    const image = COMMUNITY_IMAGE_ASSETS[block.src];

    if (!image) {
      return null;
    }

    return {
      kind: "image",
      image,
      alt: block.alt ?? "",
    };
  }

  if (block.kind === "paragraph" && block.text) {
    return {
      kind: "paragraph",
      text: block.text,
    };
  }

  return null;
};

const getCommunityPostAuthorAvatarUrl = (row: CommunityPostRow) => {
  const profile = Array.isArray(row.profiles) ? row.profiles[0] : row.profiles;

  return profile?.avatar_url ?? undefined;
};

export const toCommunityPost = (row: CommunityPostRow): CommunityPost => ({
  id: row.id,
  boardPostNumber: row.board_post_number ?? row.id,
  board: row.board,
  title: row.title ?? undefined,
  content: row.content_blocks
    .map(toCommunityContentBlock)
    .filter((block): block is CommunityContentBlock => block !== null),
  authorId: row.author_id ?? undefined,
  authorName: row.author_name,
  authorAvatarUrl: getCommunityPostAuthorAvatarUrl(row),
  authorRole: row.author_role,
  tags: row.tags,
  viewCount: row.view_count,
  likeCount: row.like_count,
  commentCount: row.comment_count,
  isPinned: row.is_pinned,
  isPublished: row.is_published,
  createdAt: formatDateWithDots(row.created_at),
  createdAtDateTime: row.created_at,
  updatedAt: row.updated_at,
});

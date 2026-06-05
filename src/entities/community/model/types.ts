import type { StaticImageData } from "next/image";

export interface CommunityContentBlock {
  kind: "image" | "paragraph";
  text?: string;
  image?: StaticImageData;
  alt?: string;
}

export interface CommunityPost {
  id: number;
  boardPostNumber: number;
  board: "notice" | "tip" | "guestbook" | "question";
  title?: string;
  content: CommunityContentBlock[];
  authorId?: string;
  authorName: string;
  authorAvatarUrl?: string;
  authorRole: "admin" | "user" | "guest";
  tags?: string[];
  viewCount: number;
  likeCount: number;
  commentCount: number;
  isPinned: boolean;
  isPublished: boolean;
  createdAt: string;
  createdAtDateTime: string;
  updatedAt?: string;
}

export interface CommunityComment {
  id: number;
  postId: number;
  content: string;
  authorId?: string;
  authorName: string;
  authorAvatarUrl?: string;
  authorRole: "admin" | "user" | "guest";
  likeCount: number;
  isDeleted: boolean;
  createdAt: string;
  createdAtDateTime: string;
  updatedAt?: string;
}

export interface CommunityContentBlockRow {
  kind?: string;
  text?: string;
  src?: string;
  alt?: string;
}

export interface CommunityPostRow {
  id: number;
  board_post_number: number | null;
  board: CommunityPost["board"];
  title: string | null;
  content_blocks: CommunityContentBlockRow[];
  author_id: string | null;
  author_name: string;
  author_role: CommunityPost["authorRole"];
  tags: string[];
  view_count: number;
  like_count: number;
  comment_count: number;
  is_pinned: boolean;
  is_published: boolean;
  created_at: string;
  updated_at: string;
  profiles?:
    | {
        avatar_url: string | null;
      }
    | Array<{
        avatar_url: string | null;
      }>
    | null;
}

export interface CommunityPostInsertRow {
  board: CommunityPost["board"];
  title: string | null;
  content_blocks: Array<{
    kind: "paragraph";
    text: string;
  }>;
  author_id: string | null;
  guest_session_id: string | null;
  author_name: string;
  author_role: CommunityPost["authorRole"];
}

export interface CommunityCommentRow {
  id: number;
  post_id: number;
  content: string;
  author_id: string | null;
  author_name: string;
  author_role: CommunityComment["authorRole"];
  like_count: number;
  is_deleted: boolean;
  created_at: string;
  updated_at: string;
  profiles?:
    | {
        avatar_url: string | null;
      }
    | Array<{
        avatar_url: string | null;
      }>
    | null;
}

export interface CommunityCommentInsertRow {
  post_id: number;
  content: string;
  author_id: string | null;
  guest_session_id: string | null;
  author_name: string;
  author_role: CommunityComment["authorRole"];
}

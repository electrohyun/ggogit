import Link from "next/link";
import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  Search,
} from "lucide-react";

import {
  getCommunityFirstParagraph,
  type CommunityPost,
} from "@/entities/community";
import { getCommunityPostsByBoard } from "@/features/community/api/communityPosts";
import { createClient } from "@/shared/lib/supabase/server";
import {
  formatCommunityPostListDate,
  isCommunityPostCreatedToday,
} from "../model/postListDate";
import styles from "./CommunityNoticesPage.module.css";

const POSTS_PER_PAGE = 10;

interface NoticesPageProps {
  searchParams?: Promise<{
    q?: string;
  }>;
}

const matchesNoticeSearch = (post: CommunityPost, query: string) =>
  [
    post.title,
    post.authorName,
    getCommunityFirstParagraph(post),
  ].some((value) => value?.toLowerCase().includes(query));

export default async function NoticesPage({ searchParams }: NoticesPageProps) {
  const rawQuery = (await searchParams)?.q ?? "";
  const query = rawQuery.trim().toLowerCase();
  const supabase = await createClient();
  const noticePosts = await getCommunityPostsByBoard(supabase, "notice");
  const filteredPosts = query
    ? noticePosts.filter((post) => matchesNoticeSearch(post, query))
    : noticePosts;
  const visiblePosts = filteredPosts.slice(0, POSTS_PER_PAGE);
  const totalPages = Math.ceil(filteredPosts.length / POSTS_PER_PAGE);

  return (
    <div className={styles.container}>
      <div className={styles.titleRow}>
        <h1>공지사항</h1>
        <form action="/community/notices" className={styles.searchForm}>
          <input
            name="q"
            type="search"
            placeholder="검색어를 입력해보세요"
            className={styles.searchInput}
            defaultValue={rawQuery}
          />
          <button
            type="submit"
            className={styles.searchButton}
            aria-label="검색"
          >
            <Search size={18} aria-hidden="true" />
          </button>
        </form>
      </div>
      <div className={styles.boardList} aria-label="공지사항 목록">
        <div className={styles.boardHeader} aria-hidden="true">
          <span>번호</span>
          <span>제목</span>
          <span>작성일</span>
          <span>조회</span>
        </div>
        {visiblePosts.map((post) => {
          const isNewPost = isCommunityPostCreatedToday(post.createdAtDateTime);
          const createdAtLabel = formatCommunityPostListDate(
            post.createdAtDateTime,
          );

          return (
            <Link
              key={post.id}
              href={`/community/notices/${post.id}`}
              className={styles.boardRow}
            >
              <span className={styles.postId}>{post.boardPostNumber}</span>
              <h2 className={styles.postTitle}>
                {post.title}
                {isNewPost && <span className={styles.newBadge}>NEW</span>}
              </h2>
              <time
                className={styles.createdAt}
                dateTime={post.createdAtDateTime}
              >
                {createdAtLabel}
              </time>
              <span className={styles.views}>{post.viewCount}</span>
              <p className={styles.mobileMeta}>
                #{post.boardPostNumber} · {createdAtLabel} · 조회{" "}
                {post.viewCount}
                {isNewPost && <span className={styles.newBadge}>NEW</span>}
              </p>
            </Link>
          );
        })}
      </div>
      <nav className={styles.pagination} aria-label="공지사항 페이지">
        <button
          type="button"
          className={styles.pageIconButton}
          aria-label="첫 페이지"
        >
          <ChevronsLeft size={18} aria-hidden="true" />
        </button>
        <button
          type="button"
          className={styles.pageIconButton}
          aria-label="이전 페이지"
        >
          <ChevronLeft size={18} aria-hidden="true" />
        </button>
        {Array.from({ length: totalPages }, (_, index) => (
          <button
            key={index + 1}
            type="button"
            className={index === 0 ? styles.activePageButton : styles.pageButton}
          >
            {index + 1}
          </button>
        ))}
        <button
          type="button"
          className={styles.pageIconButton}
          aria-label="다음 페이지"
        >
          <ChevronRight size={18} aria-hidden="true" />
        </button>
        <button
          type="button"
          className={styles.pageIconButton}
          aria-label="마지막 페이지"
        >
          <ChevronsRight size={18} aria-hidden="true" />
        </button>
      </nav>
    </div>
  );
}

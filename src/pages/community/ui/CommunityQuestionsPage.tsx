import Link from "next/link";
import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  Search,
} from "lucide-react";

import { getCommunityPostsByBoard } from "@/features/community/api/communityPosts";
import { createClient } from "@/shared/lib/supabase/server";
import styles from "./CommunityQuestionsPage.module.css";

const POSTS_PER_PAGE = 10;

export default async function QuestionsPage() {
  const supabase = await createClient();
  const questionPosts = await getCommunityPostsByBoard(supabase, "question");
  const visiblePosts = questionPosts.slice(0, POSTS_PER_PAGE);
  const totalPages = Math.ceil(questionPosts.length / POSTS_PER_PAGE);

  return (
    <div className={styles.container}>
      <div className={styles.titleRow}>
        <h1>질문과 대답</h1>
        <div className={styles.actions}>
          <form className={styles.searchForm}>
            <input
              type="search"
              placeholder="검색어를 입력해보세요"
              className={styles.searchInput}
            />
            <button
              type="submit"
              className={styles.searchButton}
              aria-label="검색"
            >
              <Search size={18} aria-hidden="true" />
            </button>
          </form>
          <Link href="/community/questions/new" className={styles.writeButton}>
            질문하기
          </Link>
        </div>
      </div>
      <div className={styles.boardList} aria-label="질문과 대답 게시글 목록">
        <div className={styles.boardHeader} aria-hidden="true">
          <span>글번호</span>
          <span>제목</span>
          <span>작성자</span>
          <span>작성일</span>
          <span>따봉</span>
          <span>조회</span>
        </div>
        {visiblePosts.map((post) => (
          <Link
            key={post.id}
            href={`/community/questions/${post.id}`}
            className={styles.boardRow}
          >
            <span className={styles.postId}>{post.id}</span>
            <h2 className={styles.postTitle}>
              {post.title}
              {post.commentCount > 0 && (
                <span className={styles.commentCount}>
                  ({post.commentCount})
                </span>
              )}
            </h2>
            <span className={styles.author}>{post.authorName}</span>
            <time
              className={styles.createdAt}
              dateTime={post.createdAtDateTime}
            >
              {post.createdAt}
            </time>
            <span className={styles.likes}>{post.likeCount}</span>
            <span className={styles.views}>{post.viewCount}</span>
            <p className={styles.mobileMeta}>
              #{post.id} · {post.authorName} · {post.createdAt} · 따봉{" "}
              {post.likeCount} · 조회 {post.viewCount}
            </p>
          </Link>
        ))}
      </div>
      <nav className={styles.pagination} aria-label="질문과 대답 페이지">
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

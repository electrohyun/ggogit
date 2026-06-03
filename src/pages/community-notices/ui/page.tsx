import Link from "next/link";
import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  Search,
} from "lucide-react";

import styles from "./page.module.css";

const POSTS_PER_PAGE = 10;

const noticePosts = [
  {
    id: 1,
    title: "꼬깃 커뮤니티 오픈 준비 안내",
    createdAt: "2026.06.01",
    views: 128,
  },
  {
    id: 2,
    title: "v0.5 미니 퀴즈 MVP 업데이트 예정 안내",
    createdAt: "2026.05.28",
    views: 96,
  },
  {
    id: 3,
    title: "게스트 이용 중 기록 저장 범위 안내",
    createdAt: "2026.05.24",
    views: 74,
  },
  {
    id: 4,
    title: "질문과 대답 게시판 이용 가이드",
    createdAt: "2026.05.20",
    views: 63,
  },
  {
    id: 5,
    title: "초기 테스트 기간 중 변경될 수 있는 기능 안내",
    createdAt: "2026.05.16",
    views: 58,
  },
];

export default function NoticesPage() {
  const totalPages = Math.ceil(noticePosts.length / POSTS_PER_PAGE);

  return (
    <div className={styles.container}>
      <div className={styles.titleRow}>
        <h1>공지사항</h1>
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
      </div>
      <div className={styles.boardList} aria-label="공지사항 목록">
        <div className={styles.boardHeader} aria-hidden="true">
          <span>번호</span>
          <span>제목</span>
          <span>작성일</span>
          <span>조회</span>
        </div>
        {noticePosts.map((post) => (
          <Link
            key={post.id}
            href={`/community/notices/${post.id}`}
            className={styles.boardRow}
          >
            <span className={styles.postId}>{post.id}</span>
            <h2 className={styles.postTitle}>{post.title}</h2>
            <time className={styles.createdAt}>{post.createdAt}</time>
            <span className={styles.views}>{post.views}</span>
            <p className={styles.mobileMeta}>
              #{post.id} · {post.createdAt} · 조회 {post.views}
            </p>
          </Link>
        ))}
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

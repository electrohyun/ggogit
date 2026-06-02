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

const questionPosts = [
  {
    id: 1,
    title: "첫 질문입니다...",
    author: "꼬꼬",
    createdAt: "2026.06.01",
    likes: 7,
    views: 42,
    comments: 3,
  },
  {
    id: 2,
    title: "merge와 rebase의 차이가 헷갈려요",
    author: "깃린이",
    createdAt: "2026.06.01",
    likes: 5,
    views: 38,
    comments: 6,
  },
  {
    id: 3,
    title: "충돌이 생기면 어디부터 봐야 하나요?",
    author: "브랜치장인",
    createdAt: "14:20",
    likes: 3,
    views: 24,
    comments: 2,
  },
  {
    id: 4,
    title: ".gitignore 파일은 언제 만들어요?",
    author: "나는짱",
    createdAt: "13:05",
    likes: 2,
    views: 19,
    comments: 0,
  },
  {
    id: 5,
    title: "커밋 메시지는 얼마나 자세히 쓰면 좋나요?",
    author: "케인",
    createdAt: "12:40",
    likes: 4,
    views: 31,
    comments: 1,
  },
  {
    id: 6,
    title: "브랜치를 나눠야 하는 기준이 궁금해요",
    author: "나는짱",
    createdAt: "11:15",
    likes: 6,
    views: 45,
    comments: 5,
  },
  {
    id: 7,
    title: "pull과 fetch는 뭐가 다른가요?",
    author: "깃초보",
    createdAt: "10:42",
    likes: 5,
    views: 36,
    comments: 4,
  },
  {
    id: 8,
    title: "실수로 커밋한 파일을 빼고 싶어요",
    author: "리셋무서워",
    createdAt: "09:58",
    likes: 8,
    views: 52,
    comments: 7,
  },
  {
    id: 9,
    title: "작업 중인 변경사항을 잠깐 보관할 수 있나요?",
    author: "스태시요정",
    createdAt: "2026.05.31",
    likes: 3,
    views: 27,
    comments: 0,
  },
  {
    id: 10,
    title: "원격 저장소 이름은 꼭 origin이어야 하나요?",
    author: "푸시왕",
    createdAt: "2026.05.31",
    likes: 2,
    views: 18,
    comments: 2,
  },
  {
    id: 11,
    title: "main이랑 develop 브랜치는 어떻게 나눠요?",
    author: "깃린이",
    createdAt: "2026.05.30",
    likes: 7,
    views: 49,
    comments: 3,
  },
];

export default function QuestionsPage() {
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
              {post.comments > 0 && (
                <span className={styles.commentCount}>({post.comments})</span>
              )}
            </h2>
            <span className={styles.author}>{post.author}</span>
            <time className={styles.createdAt}>{post.createdAt}</time>
            <span className={styles.likes}>{post.likes}</span>
            <span className={styles.views}>{post.views}</span>
            <p className={styles.mobileMeta}>
              #{post.id} · {post.author} · {post.createdAt} · 따봉 {post.likes} ·
              조회 {post.views}
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

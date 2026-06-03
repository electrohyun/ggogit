import { ChevronDown } from "lucide-react";

import styles from "./CommunityTipsPage.module.css";

const TIP_TAGS = ["전체", "commit", "branch", "merge", "reset", "remote"];

const TIP_CARDS = [
  {
    id: 1,
    title: "작은 커밋, 자주 커밋!",
    description:
      "변경 단위를 작게 나누어 커밋하면 기록을 읽기 쉽고 문제를 찾기도 쉬워요.",
    tags: ["commit", "message"],
    createdAt: "2026.06.01",
    views: 42,
  },
  {
    id: 2,
    title: "브랜치 이름은 목적이 보이게",
    description:
      "feature/login-ui처럼 작업 목적이 드러나게 작성하면 협업 흐름이 더 또렷해져요.",
    tags: ["branch"],
    createdAt: "2026.05.28",
    views: 31,
  },
  {
    id: 3,
    title: "merge 전에는 상태를 먼저 확인하기",
    description:
      "합치기 전에 git status로 작업 중인 변경사항이 남아있는지 확인해보세요.",
    tags: ["merge", "status"],
    createdAt: "2026.05.24",
    views: 28,
  },
  {
    id: 4,
    title: "reset은 되돌릴 범위를 알고 쓰기",
    description:
      "reset은 커밋과 작업 내용을 함께 움직일 수 있어서 옵션 차이를 확인하고 쓰는 게 좋아요.",
    tags: ["reset"],
    createdAt: "2026.05.20",
    views: 25,
  },
  {
    id: 5,
    title: "remote는 연결된 저장소 별명",
    description:
      "origin은 원격 저장소의 기본 별명일 뿐, 필요하면 다른 이름으로도 추가할 수 있어요.",
    tags: ["remote"],
    createdAt: "2026.05.16",
    views: 19,
  },
];

export default function TipsPage() {
  const visibleTips = TIP_CARDS.slice(0, 4);

  return (
    <div className={styles.container}>
      <div className={styles.titleRow}>
        <h1>팁 모음</h1>
        <div className={styles.tagFilter} aria-label="팁 태그 필터">
          {TIP_TAGS.map((tag, index) => (
            <button
              key={tag}
              type="button"
              className={index === 0 ? styles.activeTagButton : styles.tagButton}
            >
              #{tag}
            </button>
          ))}
        </div>
      </div>
      <hr className={styles.divider} />
      <div className={styles.tipGrid}>
        {visibleTips.map((tip) => (
          <article key={tip.id} className={styles.tipCard}>
            <div className={styles.tipContent}>
              <h2>{tip.title}</h2>
              <p>{tip.description}</p>
            </div>
            <div className={styles.tipTags}>
              {tip.tags.map((tag) => (
                <span key={tag}>#{tag}</span>
              ))}
            </div>
            <p className={styles.tipMeta}>
              {tip.createdAt} · 조회 {tip.views}
            </p>
          </article>
        ))}
      </div>
      <button type="button" className={styles.loadMoreButton}>
        더보기
        <ChevronDown size={18} aria-hidden="true" />
      </button>
    </div>
  );
}

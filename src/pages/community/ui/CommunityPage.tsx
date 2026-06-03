import Image from "next/image";
import { ChevronDown } from "lucide-react";

import { ggoggoSmile } from "@/assets/mascot";
import styles from "./CommunityPage.module.css";

// TODO: Supabase 연동 시 created_at 기준 최신순으로 조회합니다.
const GUESTBOOK_ENTRIES = [
  {
    id: 1,
    nickname: "나는짱",
    createdAt: "2026-06-01 00:00:00",
    content: "1등",
    avatar: ggoggoSmile,
  },
  {
    id: 2,
    nickname: "철학자",
    createdAt: "2026-06-01 00:00:01",
    content: "프로필 사진이 다 똑같아",
    avatar: ggoggoSmile,
  },
  {
    id: 3,
    nickname: "꼬꼬",
    createdAt: "2026-06-01 00:00:02",
    content: "친구들 안녕!",
    avatar: ggoggoSmile,
  },
  {
    id: 4,
    nickname: "깃린이",
    createdAt: "2026-06-01 00:00:03",
    content: "오늘도 커밋 하나 쌓고 갑니당당당",
    avatar: ggoggoSmile,
  },
  {
    id: 5,
    nickname: "브랜치장인",
    createdAt: "2026-06-01 00:00:04",
    content: "충돌 없이 평화로운 하루 되세요",
    avatar: ggoggoSmile,
  },
  {
    id: 6,
    nickname: "브랜치깎는노인",
    createdAt: "2026-06-01 00:00:05",
    content: "이 브랜치가 아니야!!",
    avatar: ggoggoSmile,
  },
];

export default function CommunityPage() {
  return (
    <div className={styles.container}>
      <div className={styles.titleRow}>
        <h1>방명록</h1>
        <p>({GUESTBOOK_ENTRIES.length})</p>
      </div>
      <form className={styles.form}>
        <textarea
          rows={4}
          placeholder="착한말 고운말!"
          className={styles.textarea}
        />
        <button type="submit" className={styles.button}>
          등록
        </button>
      </form>
      <hr className={styles.divider} />
      <div className={styles.commentList}>
        {GUESTBOOK_ENTRIES.map((entry) => (
          <div key={entry.id} className={styles.commentBox}>
            <Image
              src={entry.avatar}
              alt={`${entry.nickname} 프로필`}
              width={44}
              height={44}
              className={styles.avatar}
            />
            <div className={styles.commentBubble}>
              <p className={styles.nickname}>{entry.nickname}</p>
              <p className={styles.commentContent}>{entry.content}</p>
              <time className={styles.createdAt}>{entry.createdAt}</time>
            </div>
          </div>
        ))}
      </div>
      <button type="button" className={styles.loadMoreButton}>
        더보기
        <ChevronDown size={18} aria-hidden="true" />
      </button>
    </div>
  );
}

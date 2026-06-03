import Image from "next/image";
import Link from "next/link";
import { MessageCircle, ThumbsUp } from "lucide-react";

import ggoggoCoding from "@/assets/ggoggo_coding.webp";
import styles from "./CommunityPreviewPanel.module.css";

const dailyTip = {
  title: "작은 커밋, 자주 커밋!",
  description:
    "변경 단위를 작게 나누어 커밋하면, 기록을 읽기 쉽고 문제를 찾기도 쉬워요.",
};

const notices = [
  { id: 1, title: "스테이지 2-5 업데이트 안내", date: "05.27" },
  { id: 2, title: "5월 학습 챌린지 결과 발표", date: "05.24" },
  { id: 3, title: "신규 배지 3종 추가 안내", date: "05.20" },
  { id: 4, title: "Git 명령어 퀴즈 이벤트", date: "05.16" },
];

const recentQuestions = [
  {
    id: 1,
    title: "merge와 rebase의 차이가 헷갈려요",
    likes: 8,
    comments: 5,
  },
  {
    id: 2,
    title: "충돌이 생기면 어디부터 봐야 하나요?",
    likes: 6,
    comments: 3,
  },
  {
    id: 3,
    title: ".gitignore 파일은 언제 만들어요?",
    likes: 4,
    comments: 2,
  },
  {
    id: 4,
    title: "브랜치 전략은 어떻게 정하면 좋나요?",
    likes: 7,
    comments: 6,
  },
  {
    id: 5,
    title: "worktree는 언제 사용하면 좋을까요?",
    likes: 5,
    comments: 4,
  },
];

export default function CommunityPreviewPanel() {
  return (
    <>
      <section className={styles.previewCard} aria-labelledby="daily-tip-title">
        <div className={styles.cardHeader}>
          <h2 id="daily-tip-title">오늘의 팁</h2>
          <Link href="/community/tips">더보기 &gt;</Link>
        </div>
        <div className={styles.tipContent}>
          <div className={styles.tipText}>
            <h3>{dailyTip.title}</h3>
            <p>{dailyTip.description}</p>
          </div>
          <Image
            src={ggoggoCoding}
            alt="코딩하는 꼬꼬"
            width={120}
            className={styles.tipImage}
          />
        </div>
      </section>

      <section className={styles.previewCard} aria-labelledby="notices-title">
        <div className={styles.cardHeader}>
          <h2 id="notices-title">공지사항</h2>
          <Link href="/community/notices">더보기 &gt;</Link>
        </div>
        <ul className={styles.noticeList}>
          {notices.map((notice) => (
            <li key={notice.id} className={styles.noticeItem}>
              <span className={styles.noticeTitle}>{notice.title}</span>
              <span className={styles.noticeDate}>{notice.date}</span>
            </li>
          ))}
        </ul>
      </section>

      <section
        className={styles.previewCard}
        aria-labelledby="recent-questions-title"
      >
        <div className={styles.cardHeader}>
          <h2 id="recent-questions-title">인기 질문</h2>
          <Link href="/community/questions">더보기 &gt;</Link>
        </div>
        <ul className={styles.questionList}>
          {recentQuestions.map((question) => (
            <li key={question.id} className={styles.questionItem}>
              <span className={styles.questionBadge} aria-hidden="true">
                Q
              </span>
              <p className={styles.questionTitle}>{question.title}</p>
              <div className={styles.questionMeta}>
                <span aria-label={`추천 ${question.likes}개`}>
                  <ThumbsUp size={14} />
                  {question.likes}
                </span>
                <span aria-label={`댓글 ${question.comments}개`}>
                  <MessageCircle size={14} />
                  {question.comments}
                </span>
              </div>
            </li>
          ))}
        </ul>
      </section>
    </>
  );
}

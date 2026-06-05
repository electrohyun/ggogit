import Image from "next/image";
import Link from "next/link";
import { MessageCircle, ThumbsUp } from "lucide-react";

import { ggoggoCoding } from "@/assets/mascot";
import { getLatestCommunityPostsByBoard } from "@/features/community/api/communityPosts";
import { createClient } from "@/shared/lib/supabase/server";
import styles from "./CommunityPreviewPanel.module.css";

const DAILY_TIP = {
  title: "작은 커밋, 자주 커밋!",
  description:
    "변경 단위를 작게 나누어 커밋하면, 기록을 읽기 쉽고 문제를 찾기도 쉬워요.",
};

const PREVIEW_POST_LIMIT = 5;
const DAILY_TIP_LIMIT = 7;

const getDailyTipIndex = (tipCount: number) => {
  const dayOfWeek = new Date().getDay();

  return tipCount > 0 ? dayOfWeek % tipCount : 0;
};

export default async function CommunityPreviewPanel() {
  const supabase = await createClient();
  const [tips, notices, questions] = await Promise.all([
    getLatestCommunityPostsByBoard(supabase, "tip", DAILY_TIP_LIMIT),
    getLatestCommunityPostsByBoard(supabase, "notice", PREVIEW_POST_LIMIT),
    getLatestCommunityPostsByBoard(supabase, "question", PREVIEW_POST_LIMIT),
  ]);
  const dailyTip = tips[getDailyTipIndex(tips.length)];
  const dailyTipTitle = dailyTip?.title ?? DAILY_TIP.title;
  const dailyTipDescription =
    dailyTip?.content.find((block) => block.kind === "paragraph")?.text ??
    DAILY_TIP.description;

  return (
    <>
      <section className={styles.previewCard} aria-labelledby="daily-tip-title">
        <div className={styles.cardHeader}>
          <h2 id="daily-tip-title">오늘의 팁</h2>
          <Link href="/community/tips">더보기 &gt;</Link>
        </div>
        <div className={styles.tipContent}>
          <div className={styles.tipText}>
            <h3>{dailyTipTitle}</h3>
            <p>{dailyTipDescription}</p>
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
              <Link
                href={`/community/notices/${notice.id}`}
                className={styles.noticeTitle}
              >
                {notice.title}
              </Link>
              <span className={styles.noticeDate}>
                {notice.createdAt.slice(5)}
              </span>
            </li>
          ))}
        </ul>
      </section>

      <section
        className={styles.previewCard}
        aria-labelledby="recent-questions-title"
      >
        <div className={styles.cardHeader}>
          <h2 id="recent-questions-title">최근 질문</h2>
          <Link href="/community/questions">더보기 &gt;</Link>
        </div>
        <ul className={styles.questionList}>
          {questions.map((question) => (
            <li key={question.id} className={styles.questionItem}>
              <span className={styles.questionBadge} aria-hidden="true">
                Q
              </span>
              <p className={styles.questionTitle}>{question.title}</p>
              <div className={styles.questionMeta}>
                <span aria-label={`추천 ${question.likeCount}개`}>
                  <ThumbsUp size={14} />
                  {question.likeCount}
                </span>
                <span aria-label={`댓글 ${question.commentCount}개`}>
                  <MessageCircle size={14} />
                  {question.commentCount}
                </span>
              </div>
            </li>
          ))}
        </ul>
      </section>
    </>
  );
}

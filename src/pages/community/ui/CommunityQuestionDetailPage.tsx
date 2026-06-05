import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ChevronLeft } from "lucide-react";

import { ggoggoSmile } from "@/assets/mascot";
import { getCommunityFirstParagraph } from "@/entities/community";
import { getCommunityCommentsByPostId } from "@/features/community/api/communityComments";
import { getCommunityPostById } from "@/features/community/api/communityPosts";
import { createClient } from "@/shared/lib/supabase/server";
import styles from "./CommunityQuestionDetailPage.module.css";

interface QuestionDetailPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function QuestionDetailPage({
  params,
}: QuestionDetailPageProps) {
  const { id } = await params;
  const supabase = await createClient();
  const question = await getCommunityPostById(supabase, "question", id);

  if (!question) {
    notFound();
  }

  const comments = await getCommunityCommentsByPostId(supabase, question.id);

  return (
    <div className={styles.container}>
      <article className={styles.questionCard}>
        <div className={styles.questionHeader}>
          <div>
            <h1>{question.title}</h1>
            <div className={styles.questionMeta}>
              <Image
                src={ggoggoSmile}
                alt={`${question.authorName} 프로필`}
                width={44}
                height={44}
                className={styles.avatar}
              />
              <p>
                #{question.id} · {question.authorName} ·{" "}
                <time dateTime={question.createdAtDateTime}>
                  {question.createdAt}
                </time>{" "}
                · 조회 {question.viewCount}
              </p>
            </div>
          </div>
        </div>
        <p className={styles.questionContent}>
          {getCommunityFirstParagraph(question)}
        </p>
        <div className={styles.questionActions}>
          <Link href="/community/questions" className={styles.backLink}>
            <ChevronLeft size={18} aria-hidden="true" />
            목록으로
          </Link>
          <button type="button" className={styles.likeButton}>
            따봉 {question.likeCount}
          </button>
        </div>
      </article>

      <section className={styles.answerSection} aria-labelledby="answers-title">
        <h2 id="answers-title">답변 {comments.length}</h2>
        <div className={styles.answerList}>
          {comments.map((comment) => (
            <article key={comment.id} className={styles.answerItem}>
              <Image
                src={ggoggoSmile}
                alt={`${comment.authorName} 프로필`}
                width={44}
                height={44}
                className={styles.avatar}
              />
              <div className={styles.answerBubble}>
                <div className={styles.answerMeta}>
                  <strong>{comment.authorName}</strong>
                  <time dateTime={comment.createdAtDateTime}>
                    {comment.createdAt}
                  </time>
                </div>
                <p>{comment.content}</p>
              </div>
            </article>
          ))}
        </div>
      </section>

      <form className={styles.answerForm}>
        <textarea
          rows={4}
          placeholder="답변을 남겨주세요!"
          className={styles.textarea}
        />
        <button type="submit" className={styles.submitButton}>
          등록
        </button>
      </form>
    </div>
  );
}

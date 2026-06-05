import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

import { ggoggoSmile } from "@/assets/mascot";
import { getCommunityFirstParagraph } from "@/entities/community";
import { getCommunityCommentsByPostId } from "@/features/community/api/communityComments";
import { getCommunityPostById } from "@/features/community/api/communityPosts";
import { createClient } from "@/shared/lib/supabase/server";
import CommunityPostViewCounter from "./CommunityPostViewCounter";
import CommunityQuestionActions from "./CommunityQuestionActions";
import CommunityQuestionComments from "./CommunityQuestionComments";
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
              {question.authorId ? (
                <Link
                  href={`/profile/${question.authorId}`}
                  className={styles.avatarLink}
                  aria-label={`${question.authorName} 프로필 보기`}
                >
                  <Image
                    src={question.authorAvatarUrl ?? ggoggoSmile}
                    alt=""
                    width={44}
                    height={44}
                    className={styles.avatar}
                  />
                </Link>
              ) : (
                <Image
                  src={question.authorAvatarUrl ?? ggoggoSmile}
                  alt={`${question.authorName} 프로필`}
                  width={44}
                  height={44}
                  className={styles.avatar}
                />
              )}
              <p>
                #{question.boardPostNumber} · {question.authorName} ·{" "}
                <time dateTime={question.createdAtDateTime}>
                  {question.createdAt}
                </time>{" "}
                ·{" "}
                <CommunityPostViewCounter
                  postId={question.id}
                  initialViewCount={question.viewCount}
                />
              </p>
            </div>
          </div>
        </div>
        <p className={styles.questionContent}>
          {getCommunityFirstParagraph(question)}
        </p>
        <CommunityQuestionActions
          postId={question.id}
          initialLikeCount={question.likeCount}
        />
      </article>

      <CommunityQuestionComments postId={question.id} comments={comments} />
    </div>
  );
}

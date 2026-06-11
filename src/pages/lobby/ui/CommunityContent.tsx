import { MessageCircle, ThumbsUp } from "lucide-react";

import type { CommunityPost } from "@/entities/community";
import { SoundLink } from "@/shared/ui/sound-link";

import styles from "./CommunityContent.module.css";

interface CommunityContentProps {
  questions: CommunityPost[];
}

export default function CommunityContent({ questions }: CommunityContentProps) {
  if (questions.length === 0) {
    return <p className={styles.emptyText}>아직 인기 질문이 없어요.</p>;
  }

  return (
    <ul className={styles.questionList}>
      {questions.map((question) => (
        <li key={question.id} className={styles.questionItem}>
          <span className={styles.questionBadge} aria-hidden="true">
            Q
          </span>

          <SoundLink
            href={`/community/questions/${question.id}`}
            className={styles.questionTitle}
          >
            {question.title}
          </SoundLink>

          <div className={styles.meta}>
            <span aria-label={`추천 ${question.likeCount}개`}>
              <ThumbsUp size={18} />
              {question.likeCount}
            </span>
            <span aria-label={`댓글 ${question.commentCount}개`}>
              <MessageCircle size={18} />
              {question.commentCount}
            </span>
          </div>
        </li>
      ))}
    </ul>
  );
}

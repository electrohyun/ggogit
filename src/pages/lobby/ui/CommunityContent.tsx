import { MessageCircle, ThumbsUp } from "lucide-react";
import styles from "./CommunityContent.module.css";

const questions = [
  {
    id: 1,
    title: "rebase와 merge의 차이는 무엇인가요?",
    likes: 22,
    comments: 10,
  },
  {
    id: 2,
    title: "Cherry-pick은 언제 사용하나요?",
    likes: 22,
    comments: 10,
  },
  {
    id: 3,
    title: ".gitignore에 .gitignore를 넣으면 어떻게 되나요?",
    likes: 22,
    comments: 10,
  },
];

export default function CommunityContent() {
  return (
    <ul className={styles.questionList}>
      {questions.map((question) => (
        <li key={question.id} className={styles.questionItem}>
          <span className={styles.questionBadge} aria-hidden="true">
            Q
          </span>

          <p className={styles.questionTitle}>{question.title}</p>

          <div className={styles.meta}>
            <span aria-label={`추천 ${question.likes}개`}>
              <ThumbsUp size={18} />
              {question.likes}
            </span>
            <span aria-label={`댓글 ${question.comments}개`}>
              <MessageCircle size={18} />
              {question.comments}
            </span>
          </div>
        </li>
      ))}
    </ul>
  );
}

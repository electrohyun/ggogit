import Image from "next/image";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";

import ggoggoSmile from "@/assets/ggoggo_smile.webp";
import styles from "./page.module.css";

interface QuestionDetailPageProps {
  params: Promise<{
    id: string;
  }>;
}

const questionDetail = {
  title: "첫 질문입니다...",
  author: "꼬꼬",
  createdAt: "2026.06.01 14:20",
  likes: 7,
  views: 42,
  avatar: ggoggoSmile,
  content:
    "Git 공부를 막 시작했는데 merge랑 rebase는 언제 쓰면 좋은지 아직 헷갈려요. 둘 다 브랜치를 합치는 느낌인데, 실제 협업에서는 어떤 기준으로 고르면 좋을까요?",
};

const answers = [
  {
    id: 1,
    author: "꼬꼬선생",
    createdAt: "14:32",
    content:
      "merge는 기록을 남기면서 합치고, rebase는 커밋 흐름을 깔끔하게 정리할 때 좋아요. 협업 중인 공유 브랜치에서는 rebase를 조심해서 쓰는 편이 안전합니다.",
  },
  {
    id: 2,
    author: "브랜치장인",
    createdAt: "14:45",
    content:
      "처음에는 merge부터 익히는 걸 추천해요. 기록이 그대로 보여서 나중에 어떤 흐름으로 작업했는지 따라가기 쉽습니다.",
  },
  {
    id: 3,
    author: "깃린이",
    createdAt: "15:02",
    content: "오 저도 이거 궁금했는데 답변 보고 이해됐어요!",
  },
];

export default async function QuestionDetailPage({
  params,
}: QuestionDetailPageProps) {
  const { id } = await params;

  return (
    <div className={styles.container}>
      <article className={styles.questionCard}>
        <div className={styles.questionHeader}>
          <div>
            <h1>{questionDetail.title}</h1>
            <div className={styles.questionMeta}>
              <Image
                src={questionDetail.avatar}
                alt={`${questionDetail.author} 프로필`}
                width={44}
                height={44}
                className={styles.avatar}
              />
              <p>
                #{id} · {questionDetail.author} · {questionDetail.createdAt} ·
                조회 {questionDetail.views}
              </p>
            </div>
          </div>
        </div>
        <p className={styles.questionContent}>{questionDetail.content}</p>
        <div className={styles.questionActions}>
          <Link href="/community/questions" className={styles.backLink}>
            <ChevronLeft size={18} aria-hidden="true" />
            목록으로
          </Link>
          <button type="button" className={styles.likeButton}>
            따봉 {questionDetail.likes}
          </button>
        </div>
      </article>

      <section className={styles.answerSection} aria-labelledby="answers-title">
        <h2 id="answers-title">답변 {answers.length}</h2>
        <div className={styles.answerList}>
          {answers.map((answer) => (
            <article key={answer.id} className={styles.answerItem}>
              <Image
                src={ggoggoSmile}
                alt={`${answer.author} 프로필`}
                width={44}
                height={44}
                className={styles.avatar}
              />
              <div className={styles.answerBubble}>
                <div className={styles.answerMeta}>
                  <strong>{answer.author}</strong>
                  <time>{answer.createdAt}</time>
                </div>
                <p>{answer.content}</p>
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

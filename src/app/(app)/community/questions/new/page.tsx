import Link from "next/link";
import { ChevronLeft } from "lucide-react";

import styles from "./page.module.css";

export default function NewQuestionPage() {
  return (
    <div className={styles.container}>
      <div className={styles.titleRow}>
        <h1>질문하기</h1>
      </div>

      <form className={styles.formCard}>
        <label className={styles.field}>
          <span>제목</span>
          <input
            type="text"
            placeholder="질문 제목을 입력해주세요"
            className={styles.input}
          />
        </label>

        <label className={styles.field}>
          <span>내용</span>
          <textarea
            rows={8}
            placeholder="궁금한 내용을 자세히 적어주세요"
            className={styles.textarea}
          />
        </label>

        <div className={styles.actions}>
          <Link href="/community/questions" className={styles.cancelButton}>
            <ChevronLeft size={18} aria-hidden="true" />
            목록으로
          </Link>
          <button type="submit" className={styles.submitButton}>
            등록
          </button>
        </div>
      </form>
    </div>
  );
}

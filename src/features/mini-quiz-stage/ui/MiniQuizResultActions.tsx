import Link from "next/link";
import { RotateCcw } from "lucide-react";

import { useMiniQuizStageContext } from "./MiniQuizStageProvider";
import styles from "./MiniQuizResultActions.module.css";

export default function MiniQuizResultActions() {
  const { retry } = useMiniQuizStageContext();

  return (
    <div className={styles.resultActions}>
      <button
        type="button"
        className={styles.secondaryButton}
        onClick={retry}
      >
        <RotateCcw size={18} aria-hidden="true" />
        다시 풀기
      </button>
      <Link href="/study" className={styles.primaryLink}>
        스테이지 선택으로
      </Link>
    </div>
  );
}

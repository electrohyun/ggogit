import Image from "next/image";
import Link from "next/link";
import { ggoggoWalk } from "@/assets/mascot";
import styles from "./ContinueCardContent.module.css";

const currentStage = {
  number: "3-4",
  title: "git commit -m 이해하기",
  progress: 20,
};

interface ContinueCardContentProps {
  href?: string;
}

export default function ContinueCardContent({
  href = "/study",
}: ContinueCardContentProps) {
  return (
    <div className={styles.continueCard}>
      <Link
        href={href}
        className={styles.mobileCardLink}
        aria-label={`${currentStage.number} ${currentStage.title} 이어하기`}
      />
      <div className={styles.continueInfo}>
        <div className={styles.stageInfo}>
          <p className={styles.stageNumber}>{currentStage.number}</p>
          <h3 className={styles.stageTitle}>{currentStage.title}</h3>
        </div>
        <div className={styles.progressActions}>
          <div className={styles.progressRow}>
            <div
              className={styles.progressTrack}
              role="progressbar"
              aria-label="스테이지 진행률"
              aria-valuemin={0}
              aria-valuemax={100}
              aria-valuenow={currentStage.progress}
            >
              <div
                className={styles.progressFill}
                style={{ width: `${currentStage.progress}%` }}
              />
            </div>
            <span className={styles.progressText}>
              {currentStage.progress}% 완료
            </span>
          </div>
          <Link className={styles.continueButton} href={href}>
            이어하기
          </Link>
        </div>
      </div>
      <Image
        src={ggoggoWalk}
        alt="ggoggo walking"
        width={230}
        className={styles.continueImage}
      />
    </div>
  );
}

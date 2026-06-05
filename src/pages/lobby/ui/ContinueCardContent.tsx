import Image from "next/image";
import Link from "next/link";
import { ggoggoWalk } from "@/assets/mascot";
import styles from "./ContinueCardContent.module.css";

interface ContinueCardContentProps {
  href: string;
  progressPercent: number;
  stageNumber: string;
  stageTitle: string;
  totalProgressText: string;
}

export default function ContinueCardContent({
  href,
  progressPercent,
  stageNumber,
  stageTitle,
  totalProgressText,
}: ContinueCardContentProps) {
  return (
    <div className={styles.continueCard}>
      <Link
        href={href}
        className={styles.mobileCardLink}
        aria-label={`${stageNumber} ${stageTitle} 이어하기`}
      />
      <div className={styles.continueInfo}>
        <div className={styles.stageInfo}>
          <p className={styles.stageNumber}>{stageNumber}</p>
          <h3 className={styles.stageTitle}>{stageTitle}</h3>
        </div>
        <div className={styles.progressActions}>
          <div className={styles.progressRow}>
            <div
              className={styles.progressTrack}
              role="progressbar"
              aria-label="스테이지 진행률"
              aria-valuemin={0}
              aria-valuemax={100}
              aria-valuenow={progressPercent}
            >
              <div
                className={styles.progressFill}
                style={{ width: `${progressPercent}%` }}
              />
            </div>
            <span className={styles.progressText}>
              {totalProgressText}
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

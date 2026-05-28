import Image from "next/image";
import ggoggoWalk from "@/assets/ggoggo_walk.webp";
import styles from "./ContinueCardContent.module.css";

export default function ContinueCardContent() {
  return (
    <>
      <div className={styles.progressContent}>
        <div>
          <h1>3-4</h1>
          <h2>git commit -m 이해하기</h2>
        </div>
        <div className={styles.progressActions}>
          <div className={styles.progressRow}>
            <div
              className={styles.progressTrack}
              role="progressbar"
              aria-label="스테이지 진행률"
              aria-valuemin={0}
              aria-valuemax={100}
              aria-valuenow={20}
            >
              <div className={styles.progressFill} />
            </div>
            <span className={styles.progressText}>20% 완료</span>
          </div>
          <button className={styles.button}>이어하기</button>
        </div>
      </div>
      <Image
        src={ggoggoWalk}
        alt="ggoggo walking"
        width={230}
        className={styles.cardImage}
      />
    </>
  );
}

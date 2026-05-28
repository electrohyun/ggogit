import Image from "next/image";
import styles from "./page.module.css";
import ggoggoWalk from "@/assets/ggoggo_walk.webp";
import { ChevronRight } from "lucide-react";

export default function LobbyPage() {
  return (
    <>
      <div className={styles.lobbyGrid}>
        <section
          className={`${styles.card} ${styles.span4}`}
          aria-labelledby="continue-title"
        >
          <div className={styles.cardHeader}>
            <h2 id="continue-title">이어하기</h2>
            <a href="/study">
              더 보기
              <ChevronRight size={16} />
            </a>
          </div>
          {/* 테두리 */}
          <div className={styles.cardContent}>
            {/* children 부분, 컴포넌트마다 각자 구성 */}
            <div className={styles.progressContent}>
              <div>
                <h1>3-4</h1>
                <h2>git commit -m 이해하기</h2>
              </div>
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
            </div>
            <Image
              src={ggoggoWalk}
              alt="ggoggo walking"
              width={230}
              className={styles.cardImage}
            />
          </div>
          {/* 버튼 or a태그, 행동이나 링크 내려받음 */}
          <div className={styles.cardFooter}>
            <button className={styles.button}>이어하기</button>
          </div>
        </section>
        <section className={`${styles.card} ${styles.span2}`}>로비2</section>
        <section className={`${styles.card} ${styles.span2}`}>로비3</section>
      </div>
    </>
  );
}

import Image from "next/image";

import { ggoggoCheck } from "@/assets/mascot";

import { useMiniQuizStageContext } from "./MiniQuizStageProvider";
import styles from "./MiniQuizResultHero.module.css";

export default function MiniQuizResultHero() {
  const { chapterNumber, isCleared, stageNumber, stageTitle } =
    useMiniQuizStageContext();

  return (
    <div className={styles.resultHero}>
      <div className={styles.resultText}>
        <p className={styles.eyebrow}>
          Chapter {chapterNumber} · Stage {stageNumber}
        </p>
        <h1 id="result-title">
          {isCleared ? "스테이지를 클리어했어요!" : "다시 도전해봐요"}
        </h1>
        <p>{stageTitle}</p>
      </div>
      <Image
        src={ggoggoCheck}
        alt=""
        width={180}
        height={160}
        className={styles.resultMascot}
        priority
      />
    </div>
  );
}

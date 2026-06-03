import Image from "next/image";
import { Sparkles } from "lucide-react";

import { ggoggoWalk } from "@/assets/mascot";
import { stage1, stage2, stage3, stage4, stage5 } from "@/assets/chapters";
import { stageCheck, stageStar, stageStreak } from "@/assets/stats";
import { MINI_QUIZ_CHAPTERS } from "@/entities/mini-quiz";
import {
  BadgeClaimControl,
  StageStartControl,
} from "@/features/study-quiz";
import styles from "./StudyPage.module.css";

const summaryItems = [
  {
    id: "stars",
    label: "획득한 별",
    mobileLabel: "별",
    value: "7",
    total: "15",
    unit: null,
    image: stageStar,
  },
  {
    id: "cleared",
    label: "클리어한 스테이지",
    mobileLabel: "클리어",
    value: "2",
    total: "15",
    unit: null,
    image: stageCheck,
  },
  {
    id: "streak",
    label: "연속 학습 기록",
    mobileLabel: "연속 기록",
    value: "5",
    total: null,
    unit: "일째",
    image: stageStreak,
  },
] as const;

const chapterImages = [stage1, stage2, stage3, stage4, stage5] as const;

export default function StudyPage() {
  return (
    <div className={styles.studyPage}>
      <section className={styles.hero} aria-labelledby="study-title">
        <div className={styles.heroText}>
          <p className={styles.eyebrow}>학습하기</p>
          <h1 id="study-title">미니 퀴즈</h1>
          <p className={styles.heroDescription}>
            Git 명령어 길을 따라 한 단계씩 익혀요.
          </p>
        </div>
        <Image
          src={ggoggoWalk}
          alt="스테이지 길을 걷는 꼬꼬"
          width={280}
          className={styles.heroImage}
          priority
        />
      </section>

      <section className={styles.summaryGrid} aria-label="미니 퀴즈 진행 요약">
        {summaryItems.map((item) => (
          <div key={item.id} className={styles.summaryCard}>
            <Image
              src={item.image}
              alt=""
              width={62}
              height={62}
              className={styles.summaryIcon}
            />
            <div className={styles.summaryText}>
              <p data-mobile-label={item.mobileLabel}>{item.label}</p>
              <strong>
                {item.value}
                {item.total && <span> / {item.total}</span>}
                {item.unit && <span>{item.unit}</span>}
              </strong>
            </div>
          </div>
        ))}
      </section>

      <section className={styles.chapterList} aria-label="미니 퀴즈 챕터">
        {MINI_QUIZ_CHAPTERS.map((chapter, chapterIndex) => {
          return (
            <article key={chapter.id} className={styles.chapterRow}>
              <div className={styles.chapterInfo}>
                <div className={styles.chapterTitleRow}>
                  <Image
                    src={chapterImages[chapterIndex]}
                    alt=""
                    width={78}
                    height={78}
                    className={styles.chapterImage}
                  />
                  <div>
                    <h2>
                      <span>{chapterIndex + 1}.</span>
                      {chapter.title}
                    </h2>
                    <p className={styles.chapterDescription}>
                      {chapter.description}
                    </p>
                    <div
                      className={styles.commandList}
                      aria-label={`${chapter.title} 관련 명령어`}
                    >
                      {chapter.commands.map((command) => (
                        <code key={command}>{command}</code>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              <ol className={styles.stagePath}>
                {chapter.stages.map((stage, stageIndex) => {
                  return (
                    <li key={stage.id} className={styles.stageItem}>
                      <StageStartControl
                        chapterId={chapter.id}
                        chapterTitle={chapter.title}
                        chapterNumber={chapterIndex + 1}
                        stage={stage}
                        stageNumber={stageIndex + 1}
                        styles={styles}
                      />
                    </li>
                  );
                })}
              </ol>

              <BadgeClaimControl
                chapterId={chapter.id}
                chapterIndex={chapterIndex}
                chapterTitle={chapter.title}
                badgeName={chapter.badgeName}
                isBadgeUnlocked={chapter.isBadgeUnlocked}
                styles={styles}
              />
            </article>
          );
        })}
      </section>

      <aside className={styles.tipBox} aria-label="미니 퀴즈 안내">
        <Sparkles size={22} aria-hidden="true" />
        <p>각 스테이지는 5문제로 구성되어 있어요.</p>
      </aside>
    </div>
  );
}

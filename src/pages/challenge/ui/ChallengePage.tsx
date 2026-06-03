import Image from "next/image";
import Link from "next/link";
import { Clock3, Flame, Info, Medal, TimerOff, Trophy } from "lucide-react";

import { ggoggoPodium } from "@/assets/mascot";
import styles from "./ChallengePage.module.css";

const rules = [
  {
    id: "questions",
    icon: Trophy,
    label: "문제 수",
    value: "5문제",
  },
  {
    id: "limit",
    icon: TimerOff,
    label: "제한 시간",
    value: "없어요",
  },
  {
    id: "time",
    icon: Clock3,
    label: "랭킹 기준",
    value: "정답 수 + 시간",
  },
] as const;

const rankings = [
  {
    rank: 1,
    name: "꼬닥이",
    correct: 5,
    time: "42초",
    score: 980,
  },
  {
    rank: 2,
    name: "머지마스터",
    correct: 5,
    time: "49초",
    score: 940,
  },
  {
    rank: 3,
    name: "브랜치장인",
    correct: 4,
    time: "38초",
    score: 760,
  },
  {
    rank: 4,
    name: null,
    correct: null,
    time: null,
    score: null,
  },
  {
    rank: 5,
    name: null,
    correct: null,
    time: null,
    score: null,
  },
] as const;

export default function ChallengePage() {
  return (
    <div className={styles.challengePage}>
      <section className={styles.challengeIntro} aria-labelledby="challenge-title">
        <div className={styles.introText}>
          <p className={styles.eyebrow}>Challenge</p>
          <h1 id="challenge-title">오늘의 미니 퀴즈</h1>
          <p>
            매일 바뀌는 5문제로 Git 감각을 짧게 점검해요. 정확하게 풀고
            빠르게 마치면 랭킹에 올라갈 수 있어요.
          </p>
        </div>

        <div className={styles.todayTopic}>
          <span>오늘의 도전 세트</span>
          <strong>학습 문제 중 5개</strong>
          <p>모든 사용자가 같은 문제를 풀고 랭킹을 겨뤄요.</p>
        </div>

        <div className={styles.ruleGrid} aria-label="오늘의 도전 규칙">
          {rules.map((rule) => {
            const RuleIcon = rule.icon;

            return (
              <div key={rule.id} className={styles.ruleCard}>
                <RuleIcon size={22} aria-hidden="true" />
                <span>{rule.label}</span>
                <strong>{rule.value}</strong>
              </div>
            );
          })}
        </div>

        <div className={styles.recordNotice}>
          <Info size={20} aria-hidden="true" />
          <p>
            랭킹에는 오늘 처음 완료한 기록만 반영돼요. 이후 도전은 결과만
            확인할 수 있어요.
          </p>
        </div>

        <Link href="/challenge/play" className={styles.startButton}>
          도전 시작하기
        </Link>
      </section>

      <section
        id="ranking"
        className={styles.rankingPanel}
        aria-labelledby="ranking-title"
      >
        <div className={styles.rankingHeader}>
          <div>
            <p className={styles.eyebrow}>Daily Ranking</p>
            <h2 id="ranking-title">오늘의 랭킹</h2>
          </div>
          <Medal size={30} aria-hidden="true" />
        </div>

        <Image
          src={ggoggoPodium}
          alt="1등, 2등, 3등 포디움에 올라간 꼬꼬들"
          width={360}
          className={styles.podiumImage}
          priority
        />

        <ol className={styles.rankingList}>
          {rankings.map((item) => (
            <li
              key={item.rank}
              className={styles.rankingItem}
              data-empty={item.name ? "false" : "true"}
            >
              <span className={styles.rankNumber}>{item.rank}</span>
              <strong>{item.name ?? "-"}</strong>
              <span>{item.correct ? `${item.correct}문제` : "-"}</span>
              <span>{item.time ?? "-"}</span>
              <em>{item.score ? `${item.score}점` : "-"}</em>
            </li>
          ))}
        </ol>

        <div className={styles.myRecord}>
          <Flame size={22} aria-hidden="true" />
          <div>
            <span>내 기록</span>
            <strong>아직 오늘의 기록이 없어요.</strong>
          </div>
        </div>
      </section>
    </div>
  );
}

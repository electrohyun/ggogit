"use client";

import { ArrowLeft } from "lucide-react";

import { SoundLink } from "@/shared/ui/sound-link";

import MiniQuizActions from "./MiniQuizActions";
import MiniQuizAnswerForm from "./MiniQuizAnswerForm";
import MiniQuizFailModal from "./MiniQuizFailModal";
import MiniQuizFeedback from "./MiniQuizFeedback";
import MiniQuizHud from "./MiniQuizHud";
import MiniQuizQuestionBody from "./MiniQuizQuestionBody";
import MiniQuizQuestionHeader from "./MiniQuizQuestionHeader";
import MiniQuizRewardModal from "./MiniQuizRewardModal";
import MiniQuizResultActions from "./MiniQuizResultActions";
import MiniQuizResultHero from "./MiniQuizResultHero";
import MiniQuizResultScore from "./MiniQuizResultScore";
import { useMiniQuizStageContext } from "./MiniQuizStageProvider";
import styles from "./MiniQuizStageView.module.css";

export default function MiniQuizStageView() {
  const { isResult } = useMiniQuizStageContext();

  if (isResult) {
    return (
      <div className={styles.quizPage}>
        <MiniQuizRewardModal />
        <section className={styles.resultPanel} aria-labelledby="result-title">
          <MiniQuizResultHero />
          <MiniQuizResultScore />
          <MiniQuizResultActions />
        </section>
      </div>
    );
  }

  return (
    <>
      <MiniQuizFailModal />
      <div className={styles.quizPage}>
        <SoundLink href="/study" className={styles.backLink}>
          <ArrowLeft size={18} aria-hidden="true" />
          스테이지 선택으로
        </SoundLink>

        <section className={styles.questionPanel} aria-labelledby="question-title">
          <MiniQuizHud />
          <MiniQuizQuestionHeader />
          <MiniQuizQuestionBody />
          <MiniQuizAnswerForm />
          <MiniQuizFeedback />
          <MiniQuizActions />
        </section>
      </div>
    </>
  );
}

import Image from "next/image";
import { Sparkles } from "lucide-react";

import { ggoggoThumbsUp } from "@/assets/mascot";
import { useMiniQuizStageContext } from "./MiniQuizStageProvider";
import styles from "./MiniQuizQuestionBody.module.css";

export default function MiniQuizQuestionBody() {
  const { currentQuestion } = useMiniQuizStageContext();

  return (
    <div className={styles.questionBody}>
      <div className={styles.questionDescription}>
        <Sparkles size={22} aria-hidden="true" />
        <p>{currentQuestion.description}</p>
      </div>
      <Image
        src={ggoggoThumbsUp}
        alt="응원하는 꼬꼬"
        width={150}
        className={styles.quizMascot}
        priority
      />
    </div>
  );
}

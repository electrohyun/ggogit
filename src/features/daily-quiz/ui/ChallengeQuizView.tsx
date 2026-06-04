"use client";

import ChallengeQuizQuestionPanel from "./ChallengeQuizQuestionPanel";
import ChallengeQuizResult from "./ChallengeQuizResult";
import { useChallengeQuizContext } from "./ChallengeQuizProvider";

export default function ChallengeQuizView() {
  const { isResult } = useChallengeQuizContext();

  if (isResult) {
    return <ChallengeQuizResult />;
  }

  return <ChallengeQuizQuestionPanel />;
}

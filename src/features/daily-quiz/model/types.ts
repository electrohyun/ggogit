export interface ChallengeOption {
  id: string;
  text: string;
}

export interface ChallengeQuestion {
  id: string;
  type: "mcq" | "command";
  question: string;
  description: string;
  options?: readonly ChallengeOption[];
  placeholder?: string;
  explanation: string;
}

export interface DailyQuizAnswer {
  questionId: string;
  submittedAnswer: string;
}

export interface DailyQuizResult {
  alreadyCompleted: boolean;
  correctCount: number;
  earnedBeans: number;
  rankingEligible: boolean;
  score: number;
  streakIncremented: boolean;
}

export interface Profile {
  name: string;
  bio: string;
  joinedAt: string;
  quizStats: {
    solvedCount: number;
    correctCount: number;
    wrongCount: number;
  };
  activityStats: {
    currentStreakDays: number;
    bestStreakDays: number;
    currentBeans: number;
    totalBeans: number;
  };
}

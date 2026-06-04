export interface UserProfile {
  name: string;
  bio: string;
  avatarUrl: string | null;
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

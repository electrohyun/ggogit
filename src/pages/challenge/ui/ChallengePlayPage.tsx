import {
  ChallengeQuizProvider,
  ChallengeQuizView,
} from "@/features/daily-quiz";

export default function ChallengePlayPage() {
  return (
    <ChallengeQuizProvider>
      <ChallengeQuizView />
    </ChallengeQuizProvider>
  );
}

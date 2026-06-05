import {
  ChallengeQuizProvider,
  ChallengeQuizView,
  getDailyQuizPlayData,
} from "@/features/daily-quiz";
import { createClient } from "@/shared/lib/supabase/server";

export default async function ChallengePlayPage() {
  const supabase = await createClient();
  const playData = await getDailyQuizPlayData(supabase);

  if (!playData) {
    return <p>오늘의 퀴즈를 불러오지 못했어요.</p>;
  }

  return (
    <ChallengeQuizProvider
      questions={playData.questions}
      quizDate={playData.quizDate}
    >
      <ChallengeQuizView />
    </ChallengeQuizProvider>
  );
}

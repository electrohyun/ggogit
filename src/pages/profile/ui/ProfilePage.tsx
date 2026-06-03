import ProfileEditableFields from "./ProfileEditableFields";
import styles from "./ProfilePage.module.css";

// TODO: Supabase 연동 시 사용자 프로필과 학습 통계를 조회합니다.
const USER_PROFILE = {
  name: "꼬꼬",
  bio: "안녕하세요! Git을 배우고 있는 꼬꼬입니다.",
  joinedAt: "2026년 06월 02일",
  quizStats: {
    solvedCount: 42,
    correctCount: 34,
    wrongCount: 8,
  },
  activityStats: {
    currentStreakDays: 7,
    bestStreakDays: 12,
    currentBeans: 619,
    totalBeans: 1280,
  },
};

export default function ProfilePage() {
  return (
    <div className={styles.container}>
      <ProfileEditableFields profile={USER_PROFILE} />
    </div>
  );
}

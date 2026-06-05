import { RotateCcw } from "lucide-react";
import { useState } from "react";

import { useCurrentUserStore } from "@/entities/user";
import { AuthRequiredModal } from "@/features/auth";
import { trackEvent } from "@/shared/lib/analytics";
import { SoundLink } from "@/shared/ui/sound-link";
import { useMiniQuizStageContext } from "./MiniQuizStageProvider";
import styles from "./MiniQuizResultActions.module.css";

export default function MiniQuizResultActions() {
  const { isCleared, retry } = useMiniQuizStageContext();
  const authRole = useCurrentUserStore((state) => state.currentUser.authRole);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const canPromptSave = authRole === "anonymous" && isCleared;

  const handleSavePrompt = () => {
    trackEvent("anonymous_save_attempt", {
      source: "study_stage",
    });
    setIsAuthModalOpen(true);
  };

  return (
    <>
      <div className={styles.resultActions}>
        <button
          type="button"
          className={styles.secondaryButton}
          onClick={retry}
        >
          <RotateCcw size={18} aria-hidden="true" />
          다시 풀기
        </button>
        {canPromptSave && (
          <button
            type="button"
            className={styles.primaryButton}
            onClick={handleSavePrompt}
          >
            기록 저장하기
          </button>
        )}
        <SoundLink href="/study" className={styles.primaryLink}>
          스테이지 선택으로
        </SoundLink>
      </div>
      {isAuthModalOpen && (
        <AuthRequiredModal
          title="로그인해야 기록을 저장할 수 있어요"
          description="게스트로 시작하거나 로그인하면 클리어 기록, 별, 콩 보상을 저장할 수 있어요."
          reason="save_progress"
          source="study"
          onClose={() => setIsAuthModalOpen(false)}
        />
      )}
    </>
  );
}

"use client";

import { useState, useTransition } from "react";
import { ChevronLeft } from "lucide-react";

import { getOrCreateGuestIdentity, useCurrentUserStore } from "@/entities/user";
import { AuthRequiredModal } from "@/features/auth";
import { likeCommunityPost } from "@/features/community/api/communityReactions.action";
import { trackEvent } from "@/shared/lib/analytics";
import { SoundLink } from "@/shared/ui/sound-link";
import styles from "./CommunityQuestionDetailPage.module.css";

interface CommunityQuestionActionsProps {
  postId: number;
  initialLikeCount: number;
}

export default function CommunityQuestionActions({
  postId,
  initialLikeCount,
}: CommunityQuestionActionsProps) {
  const [likeCount, setLikeCount] = useState(initialLikeCount);
  const [errorMessage, setErrorMessage] = useState("");
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isPending, startTransition] = useTransition();
  const authRole = useCurrentUserStore((state) => state.currentUser.authRole);

  const handleLike = () => {
    if (authRole === "anonymous") {
      trackEvent("anonymous_community_react_attempt", {
        source: "question_like",
      });
      setIsAuthModalOpen(true);
      return;
    }

    const identity = getOrCreateGuestIdentity();

    setErrorMessage("");

    startTransition(async () => {
      const result = await likeCommunityPost({
        postId,
        guestSessionId: identity.guestSessionId,
      });

      if (!result.ok) {
        setErrorMessage(result.message);
        return;
      }

      setLikeCount(result.data.likeCount);

      if (!result.data.didLike) {
        alert("따봉은 한 게시글에 한 번만 누를 수 있어요.");
      }
    });
  };

  return (
    <>
      <div className={styles.questionActions}>
        <SoundLink href="/community/questions" className={styles.backLink}>
          <ChevronLeft size={18} aria-hidden="true" />
          목록으로
        </SoundLink>
        <button
          type="button"
          className={styles.likeButton}
          disabled={isPending}
          onClick={handleLike}
        >
          따봉 {likeCount}
        </button>
      </div>
      {errorMessage && <p className={styles.errorMessage}>{errorMessage}</p>}
      {isAuthModalOpen && (
        <AuthRequiredModal
          title="로그인해야 따봉할 수 있어요"
          description="게스트로 시작하거나 로그인하면 좋은 질문에 따봉을 남길 수 있어요."
          reason="react_community"
          source="community"
          onClose={() => setIsAuthModalOpen(false)}
        />
      )}
    </>
  );
}

"use client";

import { useState, useTransition } from "react";
import { ChevronLeft } from "lucide-react";

import { getOrCreateGuestIdentity } from "@/entities/user";
import { likeCommunityPost } from "@/features/community/api/communityReactions.action";
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
  const [isPending, startTransition] = useTransition();

  const handleLike = () => {
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
    </>
  );
}

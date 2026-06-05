"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition, type FormEvent } from "react";
import { ChevronLeft } from "lucide-react";

import { getOrCreateGuestIdentity, useCurrentUserStore } from "@/entities/user";
import { AuthRequiredModal } from "@/features/auth";
import { createQuestionPost } from "@/features/community/api/communityQuestions.action";
import { trackEvent } from "@/shared/lib/analytics";
import { SoundLink } from "@/shared/ui/sound-link";
import styles from "./CommunityQuestionNewPage.module.css";

export default function NewQuestionPage() {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isPending, startTransition] = useTransition();
  const authRole = useCurrentUserStore((state) => state.currentUser.authRole);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (authRole === "anonymous") {
      trackEvent("anonymous_community_write_attempt", {
        source: "question",
      });
      setIsAuthModalOpen(true);
      return;
    }

    const identity = getOrCreateGuestIdentity();

    setErrorMessage("");

    startTransition(async () => {
      const result = await createQuestionPost({
        title,
        content,
        guestSessionId: identity.guestSessionId,
        guestName: identity.guestName,
      });

      if (!result.ok) {
        setErrorMessage(result.message);
        return;
      }

      router.push(`/community/questions/${result.data.id}`);
      router.refresh();
    });
  };

  return (
    <div className={styles.container}>
      <div className={styles.titleRow}>
        <h1>질문하기</h1>
      </div>

      <form className={styles.formCard} onSubmit={handleSubmit}>
        <label className={styles.field}>
          <span>제목</span>
          <input
            type="text"
            placeholder="질문 제목을 입력해주세요"
            className={styles.input}
            value={title}
            disabled={isPending}
            onChange={(event) => setTitle(event.target.value)}
          />
        </label>

        <label className={styles.field}>
          <span>내용</span>
          <textarea
            rows={8}
            placeholder="궁금한 내용을 자세히 적어주세요"
            className={styles.textarea}
            value={content}
            disabled={isPending}
            onChange={(event) => setContent(event.target.value)}
          />
        </label>

        {errorMessage && <p className={styles.errorMessage}>{errorMessage}</p>}

        <div className={styles.actions}>
          <SoundLink
            href="/community/questions"
            className={styles.cancelButton}
          >
            <ChevronLeft size={18} aria-hidden="true" />
            목록으로
          </SoundLink>
          <button
            type="submit"
            className={styles.submitButton}
            disabled={isPending}
          >
            {isPending ? "등록 중..." : "등록"}
          </button>
        </div>
      </form>
      {isAuthModalOpen && (
        <AuthRequiredModal
          title="로그인해야 질문할 수 있어요"
          description="게스트로 시작하거나 로그인하면 질문을 남기고 답변을 받을 수 있어요."
          reason="write_community"
          source="community"
          onClose={() => setIsAuthModalOpen(false)}
        />
      )}
    </div>
  );
}

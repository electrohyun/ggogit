"use client";

import { useState } from "react";
import Image from "next/image";

import Modal from "@/app/_components/Modal";
import stage1Badge from "@/assets/stage1_badge.webp";
import stage2Badge from "@/assets/stage2_badge.webp";
import stage3Badge from "@/assets/stage3_badge.webp";
import stage4Badge from "@/assets/stage4_badge.webp";
import stage5Badge from "@/assets/stage5_badge.webp";
import styles from "./page.module.css";

interface BadgeClaimControlProps {
  chapterId: string;
  chapterIndex: number;
  chapterTitle: string;
  badgeName: string;
  isBadgeUnlocked: boolean;
}

const chapterBadges = [
  stage1Badge,
  stage2Badge,
  stage3Badge,
  stage4Badge,
  stage5Badge,
] as const;

export default function BadgeClaimControl({
  chapterId,
  chapterIndex,
  chapterTitle,
  badgeName,
  isBadgeUnlocked,
}: BadgeClaimControlProps) {
  const [isBadgeOpen, setIsBadgeOpen] = useState(false);
  const [claimedChapterIds, setClaimedChapterIds] = useState<string[]>([]);
  const isBadgeClaimed = claimedChapterIds.includes(chapterId);
  const canClaimBadge = isBadgeUnlocked && !isBadgeClaimed;
  const badgeImage = chapterBadges[chapterIndex];

  function handleClaimBadge() {
    setClaimedChapterIds((ids) =>
      ids.includes(chapterId) ? ids : [...ids, chapterId]
    );
    setIsBadgeOpen(true);
  }

  return (
    <>
      <aside
        className={styles.rewardPreview}
        data-unlocked={isBadgeUnlocked ? "true" : "false"}
        data-claimed={isBadgeClaimed ? "true" : "false"}
        data-claimable={canClaimBadge ? "true" : "false"}
        aria-label={`${chapterTitle} 클리어 보상`}
      >
        <div className={styles.rewardSlot}>
          <Image
            src={badgeImage}
            alt=""
            width={72}
            height={72}
            className={styles.rewardBadge}
          />
        </div>
        <div>
          <p>클리어 보상</p>
          <strong>{badgeName}</strong>
        </div>
        {canClaimBadge && (
          <button
            type="button"
            className={styles.claimButton}
            onClick={handleClaimBadge}
          >
            수령하기
          </button>
        )}
      </aside>

      {isBadgeOpen && (
        <Modal title="뱃지를 획득했어요!" onClose={() => setIsBadgeOpen(false)}>
          <div className={styles.badgeModalContent}>
            <Image
              src={badgeImage}
              alt=""
              width={120}
              height={120}
              className={styles.modalBadge}
            />
            <p>{badgeName} 배지를 로비에서 확인할 수 있어요.</p>
          </div>
        </Modal>
      )}
    </>
  );
}

"use client";

import Image from "next/image";
import { useState } from "react";
import { ChevronDown } from "lucide-react";

import { ggoggoSmile } from "@/assets/mascot";
import {
  getCommunityFirstParagraph,
  type CommunityPost,
} from "@/entities/community";
import styles from "./CommunityPage.module.css";

interface CommunityGuestbookListProps {
  entries: CommunityPost[];
}

const INITIAL_GUESTBOOK_COUNT = 4;

export default function CommunityGuestbookList({
  entries,
}: CommunityGuestbookListProps) {
  const [visibleCount, setVisibleCount] = useState(INITIAL_GUESTBOOK_COUNT);
  const visibleEntries = entries.slice(0, visibleCount);
  const hasMoreEntries = visibleCount < entries.length;

  const handleLoadMore = () => {
    setVisibleCount(entries.length);
  };

  return (
    <>
      <div className={styles.commentList}>
        {visibleEntries.map((entry) => (
          <div key={entry.id} className={styles.commentBox}>
            <Image
              src={ggoggoSmile}
              alt={`${entry.authorName} 프로필`}
              width={44}
              height={44}
              className={styles.avatar}
            />
            <div className={styles.commentBubble}>
              <p className={styles.nickname}>{entry.authorName}</p>
              <p className={styles.commentContent}>
                {getCommunityFirstParagraph(entry)}
              </p>
              <time
                className={styles.createdAt}
                dateTime={entry.createdAtDateTime}
              >
                {entry.createdAt}
              </time>
            </div>
          </div>
        ))}
      </div>
      {hasMoreEntries && (
        <button
          type="button"
          className={styles.loadMoreButton}
          onClick={handleLoadMore}
        >
          더보기
          <ChevronDown size={18} aria-hidden="true" />
        </button>
      )}
    </>
  );
}

import Image from "next/image";
import { notFound } from "next/navigation";
import { ChevronLeft } from "lucide-react";

import { type CommunityContentBlock } from "@/entities/community";
import { getCommunityPostById } from "@/features/community/api/communityPosts";
import { createClient } from "@/shared/lib/supabase/server";
import { SoundLink } from "@/shared/ui/sound-link";
import CommunityPostViewCounter from "./CommunityPostViewCounter";
import styles from "./CommunityNoticeDetailPage.module.css";

interface NoticeDetailPageProps {
  params: Promise<{
    id: string;
  }>;
}

const renderNoticeContentBlock = (
  block: CommunityContentBlock,
  index: number,
) => {
  if (block.kind === "image" && block.image) {
    return (
      <Image
        key={`image-${index}`}
        src={block.image}
        alt={block.alt ?? ""}
        className={styles.contentImage}
        priority={index === 0}
      />
    );
  }

  if (block.kind === "paragraph" && block.text) {
    return <p key={`paragraph-${index}`}>{block.text}</p>;
  }

  return null;
};

export default async function NoticeDetailPage({
  params,
}: NoticeDetailPageProps) {
  const { id } = await params;
  const supabase = await createClient();
  const notice = await getCommunityPostById(supabase, "notice", id);

  if (!notice) {
    notFound();
  }

  return (
    <div className={styles.container}>
      <article className={styles.noticeCard}>
        <div className={styles.noticeHeader}>
          <p className={styles.noticeLabel}>공지사항</p>
          <h1>{notice.title}</h1>
          <p className={styles.noticeMeta}>
            #{notice.boardPostNumber} ·{" "}
            {notice.authorName} ·{" "}
            <time dateTime={notice.createdAtDateTime}>{notice.createdAt}</time> ·
            {" "}
            <CommunityPostViewCounter
              postId={notice.id}
              initialViewCount={notice.viewCount}
            />
          </p>
        </div>
        <div className={styles.noticeContent}>
          {notice.content.map(renderNoticeContentBlock)}
        </div>
      </article>
      <SoundLink href="/community/notices" className={styles.backLink}>
        <ChevronLeft size={18} aria-hidden="true" />
        목록으로
      </SoundLink>
    </div>
  );
}

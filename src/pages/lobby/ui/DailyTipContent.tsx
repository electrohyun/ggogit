import Image from "next/image";

import {
  getCommunityFirstParagraph,
  type CommunityPost,
} from "@/entities/community";
import { SoundLink } from "@/shared/ui/sound-link";
import { ggoggoCoding } from "@/assets/mascot";

import styles from "./DailyTipContent.module.css";

interface DailyTipContentProps {
  tip: CommunityPost | null;
}

export default function DailyTipContent({ tip }: DailyTipContentProps) {
  return (
    <div className={styles.dailyTipContentCard}>
      <div className={styles.dailyTipContent}>
        <h3>{tip?.title ?? "오늘의 팁을 준비 중이에요"}</h3>
        <p>
          {tip
            ? getCommunityFirstParagraph(tip)
            : "커뮤니티 팁 모음에서 Git 학습 힌트를 곧 만나볼 수 있어요."}
        </p>
        <SoundLink href="/community/tips">더 많은 팁 보기 &gt;</SoundLink>
      </div>
      <Image
        src={ggoggoCoding}
        alt="ggoggo coding"
        width={190}
        className={styles.dailyTipImage}
      />
    </div>
  );
}

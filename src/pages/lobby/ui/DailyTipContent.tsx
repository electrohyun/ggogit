import Image from "next/image";
import { ggoggoCoding } from "@/assets/mascot";
import styles from "./DailyTipContent.module.css";

const dailyTip = {
  title: "작은 커밋, 자주 커밋!",
  description:
    "변경 단위를 작게 나누어 커밋하면, 기록을 읽기 쉽고 문제를 찾기도 쉬워요.",
};

export default function DailyTipContent() {
  return (
    <div className={styles.dailyTipContentCard}>
      <div className={styles.dailyTipContent}>
        <h3>{dailyTip.title}</h3>
        <p>{dailyTip.description}</p>
        <button type="button">더 많은 팁 보기 &gt;</button>
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

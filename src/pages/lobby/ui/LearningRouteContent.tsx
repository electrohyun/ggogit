import Image from "next/image";
import { ggoggoWorking } from "@/assets/mascot";
import styles from "./LearningRouteContent.module.css";

const learningRouteNotice = "곧 공개됩니다. ^^";

export default function LearningRouteContent() {
  return (
    <div className={styles.learningRouteCard}>
      <Image src={ggoggoWorking} alt="ggoggo working" width={120} />
      <p>{learningRouteNotice}</p>
    </div>
  );
}

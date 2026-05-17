import Image from "next/image";
import icon from "@/assets/icon.png";
import styles from "./page.module.css";

export default function Home() {
  return (
    <div className={styles.page}>
      <main className={styles.main}>
        <Image
          className={styles.character}
          src={icon}
          alt="꼬깃 캐릭터"
          priority
        />
        <h1>꼬깃!</h1>
      </main>
    </div>
  );
}

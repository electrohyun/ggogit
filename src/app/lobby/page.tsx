import styles from "./page.module.css";
import logoEng from "@/assets/logo_eng.webp";
import logoKor from "@/assets/logo_kor.webp";
import ggoggoSmile from "@/assets/ggoggo_smile.webp";
import Image from "next/image";
import { Bean, Flame, UserIcon } from "lucide-react";

export default function LobbyPage() {
  return (
    <>
      <header className={styles.header}>
        <div className={styles.logoContainer}>
          <Image
            src={logoEng}
            alt="꼬깃 영어 로고"
            width={100}
            className={styles.logoEng}
          />
          <Image
            src={logoKor}
            alt="꼬깃 한국어 로고"
            width={60}
            className={styles.logoKor}
          />
        </div>
        <div className={styles.nonLogoContainer}>
          <div className={styles.greetingContainer}>
            <p className={styles.location}>홈</p>
            <div className={styles.ggoggo}>
              <Image src={ggoggoSmile} alt="꼬꼬 웃는 얼굴" width={50} />
              <p className={styles.ggoggoGreeting}>
                Guest님! 오늘은 어떤 여정이 펼쳐질까요?
              </p>
            </div>
          </div>
          <div className={styles.statusContainer}>
            <div className={styles.status}>
              <div className={styles.streakStatus}>
                <Flame size={24} fill="lightcoral" />
                <span className={styles.streakText}>7</span>
              </div>
              <div className={styles.beanStatus}>
                <Bean size={24} fill="lightgreen" />
                <span className={styles.beanText}>619</span>
              </div>
            </div>
            <div className={styles.profileContainer}>
              <p className={styles.profileText}>어서와요, Guest님!</p>
              <UserIcon className={styles.profileIcon} size={50} />
            </div>
          </div>
        </div>
      </header>
      <main></main>
      <footer></footer>
    </>
  );
}

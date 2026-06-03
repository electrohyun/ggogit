import Image from "next/image";
import logoEng from "@/assets/logo_eng.webp";
import ggoggoThumbsUp from "@/assets/ggoggo_thumbs_up.webp";
import logoKor from "@/assets/logo_kor.webp";
import StartButton from "@/shared/ui/start-button/StartButton";
import styles from "./page.module.css";

export const dynamic = "force-static";

export default function Home() {
  return (
    <>
      <header className={styles.header}>
        <a href="#">
          <Image src={logoEng} alt="꼬깃 로고" width={100} />
        </a>
        <div className={styles.navContainer}>
          <nav className={styles.nav}>
            <a href="#about">소개</a>
            <a href="#learning">학습 방식</a>
            <a href="#play-mode">플레이 모드</a>
          </nav>
          <StartButton variant="header">시작하기</StartButton>
        </div>
      </header>
      <main className={styles.main}>
        <section className={styles.heroSection}>
          <Image
            className={styles.mascot}
            src={ggoggoThumbsUp}
            alt="꼬꼬가 엄지척하는 모습"
            width={300}
            priority
          />
          <div className={styles.hero}>
            <Image
              className={styles.heroLogo}
              src={logoKor}
              alt="꼬깃 로고"
              width={200}
            />

            <p className={styles.heroLogoText}>
              <span className={styles.heroLogoAccent}>GGo</span>
              <span>Git</span>
            </p>

            <p className={styles.heroHeadline}>가장 친절한 Git 여행</p>

            <p className={styles.heroDescription}>
              직접 명령어를 입력하고, 브랜치를 이어 보세요!
            </p>

            <StartButton variant="hero">시작하기!</StartButton>
          </div>
        </section>
      </main>
      {/* <footer className={styles.footer}>
        <p>© 2026 GGoGit</p>
        <p>Git을 게임처럼 익히는 가장 친절한 여행</p>
      </footer> */}
    </>
  );
}

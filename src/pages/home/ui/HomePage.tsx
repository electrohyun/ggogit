import Image from "next/image";
import { logoEng, logoKor } from "@/assets/brand";
import { ggoggoThumbsUp } from "@/assets/mascot";
import { StartButton } from "@/features/auth";
import styles from "./HomePage.module.css";

export const dynamic = "force-static";

export default function Home() {
  return (
    <>
      <header className={styles.header}>
        <a href="#">
          <Image
            src={logoEng}
            alt="꼬깃 로고"
            width={100}
            priority
            sizes="100px"
          />
        </a>
        <div className={styles.navContainer}>
          {/* <nav className={styles.nav}>
            <a href="#about">소개</a>
          </nav> */}
          <StartButton allowGuestEntry variant="header">
            시작하기
          </StartButton>
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
              priority
              sizes="(min-width: 768px) 25vw, 200px"
            />

            <p className={styles.heroLogoText}>
              <span className={styles.heroLogoAccent}>GGo</span>
              <span>Git</span>
            </p>

            <p className={styles.heroHeadline}>가장 친절한 Git 여행</p>

            <p className={styles.heroDescription}>
              퀴즈를 해결하며, Git 학습을 시작해 보세요!
            </p>

            <StartButton allowGuestEntry variant="hero">
              시작하기!
            </StartButton>
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

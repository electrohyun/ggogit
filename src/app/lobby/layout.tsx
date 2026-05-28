import styles from "./layout.module.css";
import logoEng from "@/assets/logo_eng.webp";
import logoKor from "@/assets/logo_kor.webp";
import ggoggoSmile from "@/assets/ggoggo_smile.webp";
import ggoggoAsk from "@/assets/ggoggo_ask.webp";
import Image from "next/image";
import {
  Bean,
  BookIcon,
  ChevronRight,
  Flame,
  HomeIcon,
  MessageCircleHeartIcon,
  TrophyIcon,
  UserIcon,
} from "lucide-react";
import { ReactNode } from "react";

export default function LobbyLayout({ children }: { children: ReactNode }) {
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
      <div className={styles.body}>
        <aside className={styles.aside}>
          <nav aria-label="주요 메뉴">
            <ul className={styles.navList}>
              <li>
                <a href="/lobby" className={styles.navItem} aria-current="page">
                  <HomeIcon size={28} />
                  <span className={styles.navText}>홈</span>
                </a>
              </li>

              <li>
                <a href="/study" className={styles.navItem}>
                  <BookIcon size={28} />
                  <span className={styles.navText}>학습하기</span>
                </a>
              </li>

              <li>
                <a href="/challenge" className={styles.navItem}>
                  <TrophyIcon size={28} />
                  <span className={styles.navText}>도전하기</span>
                </a>
              </li>

              <li>
                <a href="/community" className={styles.navItem}>
                  <MessageCircleHeartIcon size={28} />
                  <span className={styles.navText}>커뮤니티</span>
                </a>
              </li>

              <li>
                <a href="/profile" className={styles.navItem}>
                  <UserIcon size={28} />
                  <span className={styles.navText}>내 정보</span>
                </a>
              </li>
            </ul>
          </nav>
          <hr className={styles.divider} />
          <section
            className={styles.noticeSection}
            aria-labelledby="notice-title"
          >
            <div className={styles.noticeHeader}>
              <span id="notice-title" className={styles.sectionTitle}>
                공지사항
              </span>
              <a href="/notice" className={styles.noticeMore}>
                더보기
                <ChevronRight size={16} />
              </a>
            </div>
            <ul className={styles.noticeList}>
              <li className={styles.noticeContent}>
                <a href="/notice/1" className={styles.noticeLink}>
                  <span className={styles.noticeText}>
                    스테이지 2-5 다크모드 지원
                  </span>
                  <time className={styles.noticeDate} dateTime="2026-05-27">
                    05.27
                  </time>
                </a>
              </li>
              <li className={styles.noticeContent}>
                <a href="/notice/2" className={styles.noticeLink}>
                  <span className={styles.noticeText}>
                    5월 학습 챌린지 오픈
                  </span>
                  <time className={styles.noticeDate} dateTime="2026-05-24">
                    05.24
                  </time>
                </a>
              </li>
              <li className={styles.noticeContent}>
                <a href="/notice/3" className={styles.noticeLink}>
                  <span className={styles.noticeText}>신규 배지 3종 추가</span>
                  <time className={styles.noticeDate} dateTime="2026-05-20">
                    05.20
                  </time>
                </a>
              </li>
              <li className={styles.noticeContent}>
                <a href="/notice/3" className={styles.noticeLink}>
                  <span className={styles.noticeText}>
                    Git 명령어 힌트 업데이트
                  </span>
                  <time className={styles.noticeDate} dateTime="2026-05-16">
                    05.16
                  </time>
                </a>
              </li>
              <li className={styles.noticeContent}>
                <a href="/notice/3" className={styles.noticeLink}>
                  <span className={styles.noticeText}>
                    일일 도전 기록 오류 수정
                  </span>
                  <time className={styles.noticeDate} dateTime="2026-05-12">
                    05.12
                  </time>
                </a>
              </li>
            </ul>
          </section>

          <section className={styles.askSection} aria-labelledby="ask-title">
            <span id="ask-title" className={styles.sectionTitle}>
              문의하기
            </span>
            <div className={styles.askContent}>
              <Image src={ggoggoAsk} alt="꼬꼬 문의하는 얼굴" width={150} />
              <p className={styles.askText}>궁금한 것이 있나요?</p>
              <p className={styles.askText}>언제든 문의해주세요!</p>
              <a
                href="mailto:dev.electrohyun@gmail.com"
                className={styles.askButton}
              >
                문의하기
              </a>
            </div>
          </section>
        </aside>
        <main className={styles.main}>{children}</main>
      </div>
      <nav className={styles.mobileNav} aria-label="모바일 주요 메뉴">
        <a href="/lobby" className={styles.mobileNavItem} aria-current="page">
          <HomeIcon size={28} />
          <span className={styles.mobileNavText}>홈</span>
        </a>
        <a href="/study" className={styles.mobileNavItem}>
          <BookIcon size={28} />
          <span className={styles.mobileNavText}>학습</span>
        </a>
        <a href="/challenge" className={styles.mobileNavItem}>
          <TrophyIcon size={28} />
          <span className={styles.mobileNavText}>도전</span>
        </a>
        <a href="/community" className={styles.mobileNavItem}>
          <MessageCircleHeartIcon size={28} />
          <span className={styles.mobileNavText}>커뮤니티</span>
        </a>
        <a href="/profile" className={styles.mobileNavItem}>
          <UserIcon size={28} />
          <span className={styles.mobileNavText}>내 정보</span>
        </a>
      </nav>
    </>
  );
}

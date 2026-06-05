"use client";

import { logoEng, logoKor } from "@/assets/brand";
import { ggoggoAsk, ggoggoSmile } from "@/assets/mascot";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Bean,
  BookIcon,
  ChevronRight,
  Flame,
  HomeIcon,
  MessageCircleHeartIcon,
  TrophyIcon,
  UserIcon,
  Volume2Icon,
  VolumeXIcon,
} from "lucide-react";
import { useEffect, type ReactNode } from "react";
import AppLocation from "./AppLocation";
import AppNavLink from "./AppNavLink";
import AppShellProfileMenu from "./AppShellProfileMenu";
import styles from "./AppShell.module.css";
import {
  GUEST_CURRENT_USER,
  getOrCreateGuestIdentity,
  type CurrentUser,
  useCurrentUserStore,
} from "@/entities/user";
import type { CommunityPost } from "@/entities/community";
import { playClickSound } from "@/shared/lib/sound/soundPlayer";
import { useSoundStore } from "@/shared/model/sound/soundStore";
import { getAppShellGreeting } from "../model/greeting";

interface AppShellProps {
  children: ReactNode;
  initialGuestSessionId?: string;
  initialCurrentUser: CurrentUser;
  notices: CommunityPost[];
}

export default function AppShell({
  initialCurrentUser,
  initialGuestSessionId,
  notices,
  children,
}: AppShellProps) {
  const pathname = usePathname();
  const currentUser = useCurrentUserStore((state) => state.currentUser);
  const setCurrentUser = useCurrentUserStore((state) => state.setCurrentUser);
  const loadSoundSettings = useSoundStore((state) => state.loadSoundSettings);
  const soundSettings = useSoundStore((state) => state.soundSettings);
  const updateSoundSettings = useSoundStore(
    (state) => state.updateSoundSettings,
  );
  const displayCurrentUser =
    currentUser.isGuest && !initialCurrentUser.isGuest
      ? initialCurrentUser
      : currentUser;
  const greeting = getAppShellGreeting({
    pathname: pathname ?? "",
    name: displayCurrentUser.name,
  });

  useEffect(() => {
    loadSoundSettings();
  }, [loadSoundSettings]);

  useEffect(() => {
    if (!initialCurrentUser.isGuest) {
      setCurrentUser(initialCurrentUser);
      return;
    }

    const initialGuestName =
      initialCurrentUser.name === GUEST_CURRENT_USER.name
        ? undefined
        : initialCurrentUser.name;
    const { guestName } = getOrCreateGuestIdentity({
      guestName: initialGuestName,
      guestSessionId: initialGuestSessionId,
    });

    setCurrentUser({
      ...initialCurrentUser,
      name: guestName,
    });
  }, [initialCurrentUser, initialGuestSessionId, setCurrentUser]);

  const isSoundMuted =
    !soundSettings.isBgmEnabled && !soundSettings.isSfxEnabled;

  const handleSoundToggle = () => {
    const isCurrentlyMuted =
      !soundSettings.isBgmEnabled && !soundSettings.isSfxEnabled;
    const nextSettings = updateSoundSettings({
      isBgmEnabled: isCurrentlyMuted,
      isSfxEnabled: isCurrentlyMuted,
    });

    playClickSound(nextSettings);
  };

  return (
    <>
      <header className={styles.header}>
        <div className={styles.logoContainer}>
          <Link href="/lobby" className={styles.logoLink}>
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
          </Link>
        </div>
        <div className={styles.nonLogoContainer}>
          <div className={styles.greetingContainer}>
            <AppLocation className={styles.location} />
            <div className={styles.ggoggo}>
              <Image src={ggoggoSmile} alt="꼬꼬 웃는 얼굴" width={50} />
              <p className={styles.ggoggoGreeting}>{greeting}</p>
            </div>
          </div>
          <div className={styles.statusContainer}>
            <div className={styles.status}>
              <div className={styles.streakStatus}>
                <Flame size={24} fill="lightcoral" />
                <span className={styles.streakText}>
                  {displayCurrentUser.currentStreakDays}
                </span>
              </div>
              <div className={styles.beanStatus}>
                <Bean size={24} fill="lightgreen" />
                <span className={styles.beanText}>
                  {displayCurrentUser.currentBeans}
                </span>
              </div>
              <button
                type="button"
                className={styles.soundButton}
                aria-label={isSoundMuted ? "소리 켜기" : "소리 끄기"}
                aria-pressed={!isSoundMuted}
                title={isSoundMuted ? "소리 켜기" : "소리 끄기"}
                onClick={handleSoundToggle}
              >
                {isSoundMuted ? (
                  <VolumeXIcon size={22} aria-hidden="true" />
                ) : (
                  <Volume2Icon size={22} aria-hidden="true" />
                )}
              </button>
            </div>
            <div className={styles.profileContainer}>
              <p className={styles.profileText}>
                어서와요, {displayCurrentUser.name}님!
              </p>
              <AppShellProfileMenu currentUser={displayCurrentUser} />
            </div>
          </div>
        </div>
      </header>
      <div className={styles.body}>
        <aside className={styles.aside}>
          <nav aria-label="주요 메뉴">
            <ul className={styles.navList}>
              <li>
                <AppNavLink href="/lobby" className={styles.navItem}>
                  <HomeIcon size={28} />
                  <span className={styles.navText}>홈</span>
                </AppNavLink>
              </li>

              <li>
                <AppNavLink href="/study" className={styles.navItem}>
                  <BookIcon size={28} />
                  <span className={styles.navText}>학습하기</span>
                </AppNavLink>
              </li>

              <li>
                <AppNavLink href="/challenge" className={styles.navItem}>
                  <TrophyIcon size={28} />
                  <span className={styles.navText}>도전하기</span>
                </AppNavLink>
              </li>

              <li>
                <AppNavLink href="/community" className={styles.navItem}>
                  <MessageCircleHeartIcon size={28} />
                  <span className={styles.navText}>커뮤니티</span>
                </AppNavLink>
              </li>

              <li>
                <AppNavLink href="/profile" className={styles.navItem}>
                  <UserIcon size={28} />
                  <span className={styles.navText}>내 정보</span>
                </AppNavLink>
              </li>
            </ul>
          </nav>
          <section
            className={styles.noticeSection}
            aria-labelledby="notice-title"
          >
            <div className={styles.noticeHeader}>
              <span id="notice-title" className={styles.sectionTitle}>
                공지사항
              </span>
              <Link href="/community/notices" className={styles.noticeMore}>
                더보기
                <ChevronRight size={16} />
              </Link>
            </div>
            <ul className={styles.noticeList}>
              {notices.length > 0 ? (
                notices.map((notice) => (
                  <li key={notice.id} className={styles.noticeContent}>
                    <Link
                      href={`/community/notices/${notice.id}`}
                      className={styles.noticeLink}
                    >
                      <span className={styles.noticeText}>{notice.title}</span>
                      <time
                        className={styles.noticeDate}
                        dateTime={notice.createdAtDateTime}
                      >
                        {notice.createdAt.slice(5)}
                      </time>
                    </Link>
                  </li>
                ))
              ) : (
                <li className={styles.noticeContent}>
                  <span className={styles.noticeText}>공지사항이 없어요.</span>
                </li>
              )}
            </ul>
          </section>

          <section className={styles.askSection} aria-labelledby="ask-title">
            <span id="ask-title" className={styles.sectionTitle}>
              문의하기
            </span>
            <div className={styles.askContent}>
              <Image src={ggoggoAsk} alt="꼬꼬 문의하는 얼굴" width={140} />
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
        <AppNavLink href="/lobby" className={styles.mobileNavItem}>
          <HomeIcon size={28} />
          <span className={styles.mobileNavText}>홈</span>
        </AppNavLink>
        <AppNavLink href="/study" className={styles.mobileNavItem}>
          <BookIcon size={28} />
          <span className={styles.mobileNavText}>학습</span>
        </AppNavLink>
        <AppNavLink href="/challenge" className={styles.mobileNavItem}>
          <TrophyIcon size={28} />
          <span className={styles.mobileNavText}>도전</span>
        </AppNavLink>
        <AppNavLink href="/community" className={styles.mobileNavItem}>
          <MessageCircleHeartIcon size={28} />
          <span className={styles.mobileNavText}>커뮤니티</span>
        </AppNavLink>
        <AppNavLink href="/profile" className={styles.mobileNavItem}>
          <UserIcon size={28} />
          <span className={styles.mobileNavText}>내 정보</span>
        </AppNavLink>
      </nav>
    </>
  );
}

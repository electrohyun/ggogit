"use client";

import Image from "next/image";
import { playClickSound } from "@/shared/lib/sound/soundPlayer";
import { trackEvent } from "@/shared/lib/analytics";
import { createClient } from "@/shared/lib/supabase/client";
import { useSoundStore } from "@/shared/model/sound/soundStore";
import styles from "./LoginModalContent.module.css";

interface LoginModalContentProps {
  allowGuestEntry?: boolean;
  source?:
    | "challenge"
    | "community"
    | "daily_quest"
    | "header"
    | "profile"
    | "study";
}

export default function LoginModalContent({
  allowGuestEntry = false,
  source = "header",
}: LoginModalContentProps) {
  const soundSettings = useSoundStore((state) => state.soundSettings);

  const handleOAuthLogin = async (provider: "github" | "kakao") => {
    playClickSound(soundSettings);
    trackEvent("login_clicked", { provider, source });

    const supabase = createClient();
    const scopes = provider === "github" ? "read:user user:email" : undefined;

    await supabase.auth.signInWithOAuth({
      provider,
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
        scopes,
      },
    });
  };

  const handleGuestEntry = () => {
    playClickSound(soundSettings);
    trackEvent("guest_start_clicked", { source });
    window.location.href = "/auth/guest";
  };

  return (
    <div className={styles.container}>
      <button
        className={styles.kakao}
        type="button"
        onClick={() => handleOAuthLogin("kakao")}
      >
        <Image
          className={styles.icon}
          src="/icons/kakao.svg"
          alt=""
          width={16}
          height={16}
        />
        카카오 로그인
      </button>
      <button
        className={styles.github}
        type="button"
        onClick={() => handleOAuthLogin("github")}
      >
        <Image
          className={styles.icon}
          src="/icons/github.svg"
          alt=""
          width={16}
          height={16}
        />
        GitHub 로그인
      </button>
      {allowGuestEntry && (
        <>
          <div className={styles.divider}>
            <hr />
            <span>또는</span>
            <hr />
          </div>
          <button type="button" className={styles.guest} onClick={handleGuestEntry}>
            게스트로 둘러보기
          </button>
        </>
      )}
    </div>
  );
}

"use client";

import Image from "next/image";
import { playClickSound } from "@/shared/lib/sound/soundPlayer";
import { trackEvent } from "@/shared/lib/analytics";
import { createClient } from "@/shared/lib/supabase/client";
import { useSoundStore } from "@/shared/model/sound/soundStore";
import { SoundLink } from "@/shared/ui/sound-link";
import styles from "./LoginModalContent.module.css";

interface LoginModalContentProps {
  source?: "challenge" | "community" | "daily_quest" | "header" | "study";
}

export default function LoginModalContent({
  source = "header",
}: LoginModalContentProps) {
  const soundSettings = useSoundStore((state) => state.soundSettings);

  const handleOAuthLogin = async (provider: "github" | "kakao") => {
    playClickSound(soundSettings);
    trackEvent("login_clicked", { provider, source });

    const supabase = createClient();
    const scopes = provider === "github" ? "read:user user:email" : undefined;
    const {
      data: { session },
    } = await supabase.auth.getSession();
    const authOptions = {
      redirectTo: `${window.location.origin}/auth/callback`,
      scopes,
    };

    if (session?.user.is_anonymous) {
      await supabase.auth.linkIdentity({
        provider,
        options: authOptions,
      });

      return;
    }

    await supabase.auth.signInWithOAuth({
      provider,
      options: authOptions,
    });
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
      <div className={styles.divider}>
        <hr />
        <span>또는</span>
        <hr />
      </div>
      <SoundLink
        className={styles.guest}
        href="/auth/guest"
        onClick={() => trackEvent("guest_start_clicked", { source })}
      >
        게스트 로그인
      </SoundLink>
    </div>
  );
}

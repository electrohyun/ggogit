"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { createGuestName } from "@/entities/user";
import { playClickSound } from "@/shared/lib/sound/soundPlayer";
import { trackEvent } from "@/shared/lib/analytics";
import { createClient } from "@/shared/lib/supabase/client";
import { useSoundStore } from "@/shared/model/sound/soundStore";
import styles from "./LoginModalContent.module.css";

interface LoginModalContentProps {
  source?: "challenge" | "community" | "daily_quest" | "header" | "study";
}

export default function LoginModalContent({
  source = "header",
}: LoginModalContentProps) {
  const router = useRouter();
  const [errorMessage, setErrorMessage] = useState("");
  const [isGuestPending, setIsGuestPending] = useState(false);
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

  const handleGuestLogin = async () => {
    playClickSound(soundSettings);
    trackEvent("guest_start_clicked", { source });
    setErrorMessage("");
    setIsGuestPending(true);

    const supabase = createClient();
    const guestName = createGuestName();
    const { error } = await supabase.auth.signInAnonymously({
      options: {
        data: {
          name: guestName,
        },
      },
    });

    if (error) {
      setErrorMessage(
        "게스트 로그인을 시작하지 못했어요. Supabase Anonymous Sign-Ins 설정을 확인해주세요.",
      );
      setIsGuestPending(false);
      return;
    }

    const { error: initializationError } = await supabase.rpc(
      "ensure_user_app_data",
    );

    if (initializationError) {
      setErrorMessage("게스트 데이터를 준비하지 못했어요. 잠시 후 다시 시도해주세요.");
      setIsGuestPending(false);
      return;
    }

    router.push("/lobby");
    router.refresh();
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
      {errorMessage && <p className={styles.errorMessage}>{errorMessage}</p>}
      <button
        type="button"
        className={styles.guest}
        disabled={isGuestPending}
        onClick={handleGuestLogin}
      >
        {isGuestPending ? "게스트 시작 중..." : "게스트 로그인"}
      </button>
    </div>
  );
}

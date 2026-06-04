"use client";

import Image from "next/image";
import Link from "next/link";
import { createClient } from "@/shared/lib/supabase/client";
import styles from "./LoginModalContent.module.css";

export default function LoginModalContent() {
  const handleOAuthLogin = async (provider: "github" | "kakao") => {
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
      <Link className={styles.guest} href="/auth/guest">
        게스트 로그인
      </Link>
    </div>
  );
}

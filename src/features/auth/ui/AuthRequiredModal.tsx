"use client";

import Image, { type StaticImageData } from "next/image";
import { useEffect } from "react";

import { ggoggoAsk } from "@/assets/mascot";
import { trackEvent } from "@/shared/lib/analytics";
import { Modal } from "@/shared/ui/modal";
import LoginModalContent from "./LoginModalContent";
import styles from "./AuthRequiredModal.module.css";

type AuthPromptReason =
  | "claim_reward"
  | "react_community"
  | "save_progress"
  | "write_community";

type AuthPromptSource = "challenge" | "community" | "daily_quest" | "study";

interface AuthRequiredModalProps {
  description: string;
  image?: StaticImageData;
  onClose: () => void;
  reason: AuthPromptReason;
  source: AuthPromptSource;
  title: string;
}

export default function AuthRequiredModal({
  description,
  image = ggoggoAsk,
  onClose,
  reason,
  source,
  title,
}: AuthRequiredModalProps) {
  useEffect(() => {
    trackEvent("auth_prompt_shown", {
      reason,
      source,
    });
  }, [reason, source]);

  return (
    <Modal title={title} onClose={onClose}>
      <div className={styles.content}>
        <Image
          src={image}
          alt=""
          width={120}
          height={120}
          className={styles.image}
        />
        <p>{description}</p>
        <LoginModalContent source={source} />
      </div>
    </Modal>
  );
}

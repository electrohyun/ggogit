"use client";

import Image from "next/image";
import { useState, type ReactNode } from "react";
import { ggoggoGreet } from "@/assets/mascot";
import styles from "./StartButton.module.css";
import LoginModalContent from "./LoginModalContent";
import { Modal } from "@/shared/ui/modal";

interface StartButtonProps {
  allowGuestEntry?: boolean;
  children: ReactNode;
  variant?: "header" | "hero";
}

export default function StartButton({
  allowGuestEntry = false,
  children,
  variant = "header",
}: StartButtonProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const modalTitle = allowGuestEntry ? "꼬깃 시작하기" : "로그인";
  const description =
    "로그인하면 기록, 별, 콩 보상을 차곡차곡 저장할 수 있어요.";

  return (
    <>
      <button
        type="button"
        className={`${styles.startButton} ${styles[variant]}`}
        onClick={() => setIsModalOpen(!isModalOpen)}
      >
        {children}
      </button>

      {isModalOpen && (
        <Modal title={modalTitle} onClose={() => setIsModalOpen(false)}>
          <div className={styles.modalContent}>
            <Image
              src={ggoggoGreet}
              alt=""
              width={128}
              className={styles.modalMascot}
              sizes="128px"
            />
            <p className={styles.modalDescription}>{description}</p>
            <LoginModalContent allowGuestEntry={allowGuestEntry} />
          </div>
        </Modal>
      )}
    </>
  );
}

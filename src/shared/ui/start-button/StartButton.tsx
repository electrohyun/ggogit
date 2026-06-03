"use client";

import { useState, type ReactNode } from "react";
import styles from "./StartButton.module.css";
import LoginModalContent from "@/features/auth/ui/LoginModalContent";
import Modal from "@/shared/ui/modal/Modal";

interface StartButtonProps {
  children: ReactNode;
  variant?: "header" | "hero";
}

export default function StartButton({
  children,
  variant = "header",
}: StartButtonProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);

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
        <Modal title="로그인" onClose={() => setIsModalOpen(false)}>
          <LoginModalContent />
        </Modal>
      )}
    </>
  );
}

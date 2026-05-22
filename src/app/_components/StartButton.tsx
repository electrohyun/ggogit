"use client";

import { useState, type ReactNode } from "react";
import styles from "./StartButton.module.css";
import Modal from "@/app/_components/Modal";
import LoginModalContent from "@/app/_components/LoginModalContent";

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

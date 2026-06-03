import Image from "next/image";
import Link from "next/link";

import { ggoggoHuk } from "@/assets/mascot";
import { Modal } from "@/shared/ui/modal";
import styles from "./MiniQuizStageClient.module.css";

interface MiniQuizFailModalProps {
  onClose: () => void;
}

export default function MiniQuizFailModal({ onClose }: MiniQuizFailModalProps) {
  return (
    <Modal title="에너지가 방전됐어요" onClose={onClose}>
      <div className={styles.failModalContent}>
        <Image
          src={ggoggoHuk}
          alt=""
          width={180}
          height={150}
          className={styles.failModalImage}
        />
        <p>스테이지 선택 화면에서 다시 도전해요.</p>
        <Link href="/study" className={styles.primaryLink}>
          스테이지 선택으로
        </Link>
      </div>
    </Modal>
  );
}

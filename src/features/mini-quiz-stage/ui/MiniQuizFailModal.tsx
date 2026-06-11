import Image from "next/image";

import { Modal } from "@/shared/ui/modal";
import { SoundLink } from "@/shared/ui/sound-link";
import { ggoggoHuk } from "@/assets/mascot";

import { useMiniQuizStageContext } from "./MiniQuizStageProvider";
import styles from "./MiniQuizFailModal.module.css";

export default function MiniQuizFailModal() {
  const { closeFailModal, isFailed } = useMiniQuizStageContext();

  if (!isFailed) {
    return null;
  }

  return (
    <Modal title="에너지가 방전됐어요" onClose={closeFailModal}>
      <div className={styles.failModalContent}>
        <Image
          src={ggoggoHuk}
          alt=""
          width={180}
          height={150}
          className={styles.failModalImage}
        />
        <p>스테이지 선택 화면에서 다시 도전해요.</p>
        <SoundLink href="/study" className={styles.primaryLink}>
          스테이지 선택으로
        </SoundLink>
      </div>
    </Modal>
  );
}

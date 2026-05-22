import Image from "next/image";
import styles from "./LoginModalContent.module.css";

export default function LoginModalContent() {
  return (
    <div className={styles.container}>
      <button className={styles.kakao} type="button">
        <Image
          className={styles.icon}
          src="/icons/kakao.svg"
          alt=""
          width={16}
          height={16}
        />
        카카오 로그인
      </button>
      <button className={styles.github} type="button">
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
      <button className={styles.guest} type="button">
        게스트 로그인
      </button>
    </div>
  );
}

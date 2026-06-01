import Image from "next/image";
import Link from "next/link";
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
      <Link className={styles.guest} href="/lobby">
        게스트 로그인
      </Link>
    </div>
  );
}

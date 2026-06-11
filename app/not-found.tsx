import Image from "next/image";
import Link from "next/link";

import { ggoggoHuk } from "@/assets/mascot";

import styles from "./not-found.module.css";

export default function NotFound() {
  return (
    <main className={styles.page}>
      <section className={styles.content} aria-labelledby="not-found-title">
        <Image
          src={ggoggoHuk}
          alt="놀란 꼬꼬"
          width={220}
          priority
          className={styles.image}
        />
        <p className={styles.eyebrow}>404</p>
        <h1 id="not-found-title" className={styles.title}>
          헉!!! 길을 잃었어요
        </h1>
        <p className={styles.description}>
          찾는 페이지가 없거나, 주소가 꼬깃꼬깃 접혀버렸어요.
        </p>
        <div className={styles.actions}>
          <Link href="/lobby" className={styles.primaryAction}>
            로비로 가기
          </Link>
          <Link href="/" className={styles.secondaryAction}>
            처음으로
          </Link>
        </div>
      </section>
    </main>
  );
}

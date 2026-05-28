import type { ReactNode } from "react";
import styles from "./Card.module.css";

interface CardProps {
  id: string;
  title: string;
  headerAction?: ReactNode;
  children: ReactNode;
  footer?: ReactNode;
  className?: string;
}

export default function Card({
  id,
  title,
  headerAction,
  children,
  footer,
  className,
}: CardProps) {
  const titleId = `${id}-title`;

  return (
    <section
      id={id}
      className={`${styles.card} ${className ?? ""}`}
      aria-labelledby={titleId}
    >
      <div className={styles.cardHeader}>
        <h2 id={titleId}>{title}</h2>
        {headerAction}
      </div>
      <div className={styles.cardContent}>{children}</div>
      {footer && <div className={styles.cardFooter}>{footer}</div>}
    </section>
  );
}

import { Calendar, History, Trophy } from "lucide-react";
import Link from "next/link";
import styles from "./QuickActions.module.css";

interface QuickActionsProps {
  className?: string;
}

const QUICK_ACTIONS = [
  {
    id: "review",
    label: "1분 복습",
    href: "/study",
    icon: History,
    className: styles.reviewButton,
    completed: true,
  },
  {
    id: "daily-quiz",
    label: "오늘의 퀴즈",
    href: "/study",
    icon: Calendar,
    className: styles.quizButton,
    completed: false,
  },
  {
    id: "random-quiz",
    label: "랜덤 문제",
    href: "/challenge",
    icon: Trophy,
    className: styles.challengeButton,
    completed: false,
  },
];

export default function QuickActions({ className }: QuickActionsProps) {
  return (
    <div className={`${styles.quickActions} ${className ?? ""}`}>
      {QUICK_ACTIONS.map((action) => {
        const Icon = action.icon;

        return (
          <Link
            href={action.href}
            key={action.id}
            className={`${styles.quickActionButton} ${action.className}`}
          >
            <Icon size={36} className={styles.quickActionIcon} />
            <p>{action.label}</p>
            {action.completed && (
              <span className={styles.completedOverlay}>완료!</span>
            )}
          </Link>
        );
      })}
    </div>
  );
}

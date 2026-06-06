import { CalendarCheck, Map, MessageCircleQuestionMark } from "lucide-react";
import { SoundLink } from "@/shared/ui/sound-link";
import styles from "./QuickActions.module.css";

interface QuickActionsProps {
  className?: string;
}

const QUICK_ACTIONS = [
  {
    id: "stage-select",
    label: "스테이지 선택",
    href: "/study",
    icon: Map,
    className: styles.stageButton,
  },
  {
    id: "daily-quiz",
    label: "오늘의 퀴즈",
    href: "/challenge",
    icon: CalendarCheck,
    className: styles.quizButton,
  },
  {
    id: "questions",
    label: "질문과 대답",
    href: "/community/questions",
    icon: MessageCircleQuestionMark,
    className: styles.challengeButton,
  },
];

export default function QuickActions({ className }: QuickActionsProps) {
  return (
    <div className={`${styles.quickActions} ${className ?? ""}`}>
      {QUICK_ACTIONS.map((action) => {
        const Icon = action.icon;

        return (
          <SoundLink
            href={action.href}
            key={action.id}
            className={`${styles.quickActionButton} ${action.className}`}
          >
            <Icon size={36} className={styles.quickActionIcon} />
            <p>{action.label}</p>
          </SoundLink>
        );
      })}
    </div>
  );
}

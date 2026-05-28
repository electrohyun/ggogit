"use client";

import { usePathname } from "next/navigation";

const locationLabels: Record<string, string> = {
  "/lobby": "홈",
  "/study": "학습하기",
  "/challenge": "도전하기",
  "/community": "커뮤니티",
  "/profile": "내 정보",
};

interface AppLocationProps {
  className?: string;
}

export default function AppLocation({ className }: AppLocationProps) {
  const pathname = usePathname();
  const locationLabel = locationLabels[pathname] ?? "홈";

  return <p className={className}>{locationLabel}</p>;
}

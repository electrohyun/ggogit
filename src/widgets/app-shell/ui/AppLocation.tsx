"use client";

import { usePathname } from "next/navigation";

const LOCATION_ITEMS = [
  { href: "/lobby", label: "홈" },
  { href: "/study", label: "학습하기" },
  { href: "/challenge", label: "도전하기" },
  { href: "/community", label: "커뮤니티" },
  { href: "/profile", label: "내 정보" },
];

interface AppLocationProps {
  className?: string;
}

export default function AppLocation({ className }: AppLocationProps) {
  const pathname = usePathname() ?? "";
  const locationLabel =
    LOCATION_ITEMS.find(
      ({ href }) => pathname === href || pathname.startsWith(`${href}/`),
    )?.label ?? "홈";

  return <p className={className}>{locationLabel}</p>;
}

"use client";

import { usePathname } from "next/navigation";
import { ReactNode } from "react";

import { SoundLink } from "@/shared/ui/sound-link";

interface AppNavLinkProps {
  href: string;
  className?: string;
  children: ReactNode;
}

export default function AppNavLink({
  href,
  className,
  children,
}: AppNavLinkProps) {
  const pathname = usePathname() ?? "";
  const isActive = pathname === href || pathname.startsWith(`${href}/`);

  return (
    <SoundLink
      href={href}
      className={className}
      aria-current={isActive ? "page" : undefined}
    >
      {children}
    </SoundLink>
  );
}

"use client";

import { usePathname } from "next/navigation";
import { ReactNode } from "react";

import { SoundLink } from "@/shared/ui/sound-link";

interface AppNavLinkProps {
  href: string;
  ariaLabel?: string;
  className?: string;
  children: ReactNode;
}

export default function AppNavLink({
  href,
  ariaLabel,
  className,
  children,
}: AppNavLinkProps) {
  const pathname = usePathname() ?? "";
  const isActive = pathname === href || pathname.startsWith(`${href}/`);

  return (
    <SoundLink
      href={href}
      className={className}
      aria-label={ariaLabel}
      aria-current={isActive ? "page" : undefined}
    >
      {children}
    </SoundLink>
  );
}

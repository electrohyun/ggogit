"use client";

import { usePathname } from "next/navigation";
import { ReactNode } from "react";

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
  const pathname = usePathname();
  const isActive = pathname === href || pathname.startsWith(`${href}/`);

  return (
    <a
      href={href}
      className={className}
      aria-current={isActive ? "page" : undefined}
    >
      {children}
    </a>
  );
}

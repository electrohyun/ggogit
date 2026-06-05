"use client";

import Link, { type LinkProps } from "next/link";
import type { AnchorHTMLAttributes, ReactNode } from "react";

import { playClickSound } from "@/shared/lib/sound/soundPlayer";
import { useSoundStore } from "@/shared/model/sound/soundStore";

type SoundLinkProps = LinkProps &
  Omit<AnchorHTMLAttributes<HTMLAnchorElement>, keyof LinkProps> & {
    children: ReactNode;
  };

export default function SoundLink({
  children,
  onClick,
  ...props
}: SoundLinkProps) {
  const soundSettings = useSoundStore((state) => state.soundSettings);

  return (
    <Link
      {...props}
      onClick={(event) => {
        playClickSound(soundSettings);
        onClick?.(event);
      }}
    >
      {children}
    </Link>
  );
}

"use client";

import { useState } from "react";

import { ggoggoGreet } from "@/assets/mascot";
import { AuthRequiredModal } from "@/features/auth";

export default function ProfileLoginPrompt() {
  const [isDismissed, setIsDismissed] = useState(false);

  if (isDismissed) {
    return null;
  }

  return (
    <AuthRequiredModal
      title="내 정보는 로그인 후 이용할 수 있어요"
      description="지금은 기본 프로필만 보여요. 로그인하면 프로필, 콩, 스트릭, 클리어 기록을 저장할 수 있어요."
      image={ggoggoGreet}
      reason="save_progress"
      source="profile"
      onClose={() => setIsDismissed(true)}
    />
  );
}

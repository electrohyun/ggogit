import type { JwtPayload } from "@supabase/supabase-js";

export const getUserMetadataName = (
  metadata: Record<string, unknown> | null | undefined,
) => {
  if (!metadata) {
    return null;
  }

  const nameCandidates = [
    metadata.name,
    metadata.full_name,
    metadata.user_name,
    metadata.preferred_username,
  ];

  return (
    nameCandidates.find(
      (value): value is string => typeof value === "string" && value.length > 0,
    ) ?? null
  );
};

export const getCurrentUserName = (claims: JwtPayload | null) => {
  if (!claims) {
    return "Guest"; // 이미 layout에서 검증 통과함
  }

  const metadata = claims.user_metadata;

  const nameCandidates = [
    // 안전하게 확인하면서 여러 후보를 순서대로 시도
    getUserMetadataName(metadata),
    claims.email,
  ];

  const currentUserName = nameCandidates.find(
    (value): value is string => typeof value === "string" && value.length > 0,
  );

  return currentUserName ?? "Guest";
};

export const normalizeAvatarUrl = (avatarUrl: string | null | undefined) => {
  return avatarUrl?.replace(/^http:\/\//, "https://") ?? null;
};

export const getCurrentUserAvatarUrl = (claims: JwtPayload | null) => {
  if (!claims) {
    return null;
  }

  const metadata = claims.user_metadata;

  const avatarCandidates = [
    metadata?.avatar_url,
    metadata?.picture,
    metadata?.profile_image_url,
  ];

  const avatarUrl =
    avatarCandidates.find(
      (value): value is string => typeof value === "string" && value.length > 0,
    ) ?? null;

  return normalizeAvatarUrl(avatarUrl);
};

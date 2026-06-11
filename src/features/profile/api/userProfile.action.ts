"use server";

import { revalidatePath } from "next/cache";

import type { ActionResult } from "@/shared";
import { createClient } from "@/shared/lib/supabase/server";

interface UpdateUserProfileInput {
  name: string;
  bio: string;
}

interface UpdateUserProfileAvatarData {
  avatarUrl: string;
}

export const updateUserProfile = async ({
  name,
  bio,
}: UpdateUserProfileInput): Promise<ActionResult<UpdateUserProfileInput>> => {
  const newName = name.trim();
  const newBio = bio.trim();

  if (!newName) {
    return {
      ok: false,
      message: "이름을 입력해주세요.",
    };
  }

  const supabase = await createClient();
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    return {
      ok: false,
      message: "로그인 정보를 확인하지 못했습니다.",
    };
  }

  const { data, error } = await supabase
    .from("profiles")
    .update({
      name: newName,
      bio: newBio,
    })
    .eq("id", user.id)
    .select("name,bio")
    .single();

  if (error) {
    console.error("프로필을 수정하지 못했습니다.", error);

    return {
      ok: false,
      message: "프로필을 저장하지 못했습니다.",
    };
  }

  revalidatePath("/profile");

  return {
    ok: true,
    data: {
      name: data.name,
      bio: data.bio ?? "",
    },
  };
};

export const updateUserProfileAvatar = async (
  formData: FormData,
): Promise<ActionResult<UpdateUserProfileAvatarData>> => {
  const avatar = formData.get("avatar");

  if (!(avatar instanceof File)) {
    return {
      ok: false,
      message: "사진을 선택해주세요.",
    };
  }

  const allowedTypes = ["image/png", "image/jpeg", "image/webp"];

  if (!allowedTypes.includes(avatar.type)) {
    return {
      ok: false,
      message: "PNG, JPG, WEBP 이미지만 업로드할 수 있습니다.",
    };
  }

  // 2MB 제한
  const maxFileSize = 2 * 1024 * 1024;

  if (avatar.size > maxFileSize) {
    return {
      ok: false,
      message: "프로필 이미지는 2MB 이하만 업로드할 수 있습니다.",
    };
  }

  // 현재 유저 확인
  const supabase = await createClient();

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    return {
      ok: false,
      message: "로그인 정보를 확인하지 못했습니다.",
    };
  }

  const fileExtension = avatar.type.split("/")[1];
  const filePath = `${user.id}/avatar-${Date.now()}.${fileExtension}`;

  const { error: uploadError } = await supabase.storage
    .from("profile-avatars")
    .upload(filePath, avatar, {
      contentType: avatar.type,
    });

  if (uploadError) {
    console.error("프로필 이미지를 업로드하지 못했습니다.", uploadError);

    return {
      ok: false,
      message: "프로필 이미지를 업로드하지 못했습니다.",
    };
  }

  const { data: publicUrlData } = supabase.storage
    .from("profile-avatars")
    .getPublicUrl(filePath);

  const avatarUrl = publicUrlData.publicUrl;

  const { error: profileError } = await supabase
    .from("profiles")
    .update({ avatar_url: avatarUrl })
    .eq("id", user.id);

  if (profileError) {
    console.error("프로필 이미지 주소를 저장하지 못했습니다.", profileError);

    return {
      ok: false,
      message: "프로필 이미지 주소를 저장하지 못했습니다.",
    };
  }

  revalidatePath("/profile");

  return {
    ok: true,
    data: {
      avatarUrl,
    },
  };
};

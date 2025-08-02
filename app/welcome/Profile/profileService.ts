// src/features/profile/services/profileService.ts
import { supabase } from "../../supabase";

export type ProfileData = {
  id: string;
  user_name: string;
  email: string;
  avatar_url?: string;
};

export const getCurrentUser = async () => {
  const { data: { user }, error } = await supabase.auth.getUser();
  if (error || !user) throw new Error("Không thể lấy thông tin người dùng");
  return user;
};

export const getProfile = async (): Promise<ProfileData> => {
  const user = await getCurrentUser();
  const { data, error } = await supabase
    .from("users")
    .select("id, user_name, email, avatar_url")
    .eq("id", user.id)
    .single();

  if (error || !data) throw new Error("Không thể lấy thông tin hồ sơ");
  return data;
};

export const uploadAvatar = async (userId: string, file: File): Promise<string> => {
  const ext = file.name.split(".").pop();
  const filePath = `avatars/${userId}.${ext}`;

  const { error: uploadError } = await supabase.storage
    .from("avatar")
    .upload(filePath, file, { upsert: true });

  if (uploadError) throw new Error("Upload thất bại: " + uploadError.message);

  const { data } = supabase.storage.from("avatar").getPublicUrl(filePath);
  return data.publicUrl;
};

export const updateProfile = async (
  userId: string,
  user_name: string,
  avatar_url?: string
) => {
  const { error } = await supabase
    .from("users")
    .update({ user_name, avatar_url })
    .eq("id", userId);

  if (error) throw new Error("Không thể cập nhật hồ sơ: " + error.message);
};

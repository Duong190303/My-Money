// src/services/authService.ts
import { supabase } from "../../../supabase";

export async function loginWithEmail(email: string, password: string) {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error || !data.user) {
    throw new Error("Invalid email or password");
  }

  const { data: userInfo } = await supabase
    .from("users")
    .select("*")
    .eq("id", data.user.id)
    .single();

  return {
    user: data.user,
    userInfo,
  };
}

export async function registerWithEmail(
  user_name: string,
  email: string,
  password: string
) {
  const { data, error } = await supabase.auth.signUp({ email, password });

  if (error) throw error;
  const user = data.user;

  if (!user) throw new Error("No user created");

  // Check xem email đã tồn tại trong bảng users chưa
  const { data: existing, error: checkError } = await supabase
    .from("users")
    .select("*")
    .eq("email", email)
    .single();

  if (existing) {
    console.warn("User email already exists in users table");
    return user;
  }

  // Chèn vào bảng users nếu chưa tồn tại
  const { error: insertError } = await supabase.from("users").insert({
    id: user.id,
    user_name,
    email,
  });

  if (insertError) throw insertError;

  return user;
}

export async function loginWithGoogle() {
  const { error } = await supabase.auth.signInWithOAuth({
    provider: "google",
  });

  if (error) throw error;
}

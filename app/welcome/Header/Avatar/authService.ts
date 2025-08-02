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
    .eq("id_user", data.user.id)
    .single();

  return {
    user: data.user,
    userInfo,
  };
}

export async function registerWithEmail(email: string, password: string) {
  const { data, error } = await supabase.auth.signUp({ email, password });

  if (error) throw error;

  return data.user;
}

export async function loginWithGoogle() {
  const { error } = await supabase.auth.signInWithOAuth({
    provider: "google",
  });

  if (error) throw error;
}

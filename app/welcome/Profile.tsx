import {
  Avatar,
  Box,
  Button,
  Center,
  Container,
  FileInput,
  Group,
  Stack,
  Text,
  TextInput,
  ThemeIcon,
  Title,
} from "@mantine/core";
import { useEffect, useState } from "react";
import { Notifications } from "@mantine/notifications";
import { supabase } from "../supabase";
import { Header } from "./Header";
import { IconMail, IconUser } from "@tabler/icons-react";
import "../welcome/Style/Profile.css";
import { useNavigate } from "react-router-dom";
type ProfileData = {
  id: string;
  user_name: string;
  email: string;
  avatar_url?: string;
  avatar_file?: File | null;
};

export default function Profile() {
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [username, setUsername] = useState("");
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [user, setUser] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  if (typeof window === "undefined") return null;
  const navigate = useNavigate();

  useEffect(() => {
    const { data: authListener } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        setUser(
          event === "SIGNED_IN" || event === "TOKEN_REFRESHED"
            ? session?.user
            : null
        );
      }
    );

    return () => authListener.subscription.unsubscribe();
  }, []);

  const fetchProfile = async () => {
    setIsLoading(true);

    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      console.error("Lỗi lấy thông tin user:", authError);
      setIsLoading(false);
      return;
    }

    setUser(user);

    const { data, error } = await supabase
      .from("users")
      .select("id, user_name, email, avatar_url")
      .eq("id", user.id)
      .single();

    if (error || !data) {
      console.error("Lỗi lấy thông tin profile:", error);
      setIsLoading(false);
      return;
    }

    // Ưu tiên lấy avatar từ metadata, fallback là DB
    // const avatar_url =
    //   user.user_metadata?.avatar_url || data.avatar_url || "default-avatar.png";

    setProfile({
      id: data.id,
      user_name: data.user_name,
      email: data.email,
      avatar_url: data.avatar_url || "default-avatar.png",
      avatar_file: null,
    });

    setUsername(data.user_name);
    setAvatarPreview(data.avatar_url);
    setIsLoading(false);
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  const handleUpdate = async () => {
  if (!profile || !user) return;
  setIsLoading(true);

  let avatar_url = profile.avatar_url;

  // 1. Upload avatar lên Supabase Storage
  if (avatarFile) {
    const fileExt = avatarFile.name.split(".").pop();
    const filePath = `avatars/${user.id}.${fileExt}`;

    const { error: uploadError } = await supabase.storage
      .from("avatar")
      .upload(filePath, avatarFile, {
        upsert: true,
        cacheControl: "3600",
      });

    if (uploadError) {
      Notifications.show({
        title: "Upload failed",
        message: uploadError.message,
        color: "red",
      });
      setIsLoading(false);
      return;
    }

    const { data: publicUrlData } = supabase.storage
      .from("avatar")
      .getPublicUrl(filePath);

    avatar_url = publicUrlData.publicUrl;
  }

  // 2. Cập nhật user metadata (auth)
  const { error: updateAuthError } = await supabase.auth.updateUser({
    data: {
      user_name: username,
      avatar_url: avatar_url,
    },
  });

  if (updateAuthError) {
    Notifications.show({
      title: "Auth update failed",
      message: updateAuthError.message,
      color: "red",
    });
    setIsLoading(false);
    return;
  }

  // 3. Cập nhật bảng users
  const { error: updateDbError } = await supabase
    .from("users")
    .update({
      user_name: username,
      avatar_url: avatar_url,
    })
    .eq("id", user.id);

  if (updateDbError) {
    Notifications.show({
      title: "Database update failed",
      message: updateDbError.message,
      color: "red",
    });
    setIsLoading(false);
    return;
  }

  // 4. Thành công
  Notifications.show({
    title: "Thành công",
    message: "Đã cập nhật thông tin cá nhân",
    color: "green",
  });

  setIsEditing(false);
  fetchProfile();
  setIsLoading(false);
};


  const handleFileChange = (file: File | null) => {
    if (file) {
      setAvatarFile(file);
      setAvatarPreview(URL.createObjectURL(file));
    }
  };
  //chuyển về trang chủ khi ở trạng thái không có user
  useEffect(() => {
    if (!isLoading && !user) {
      navigate("/");
    }
  }, [isLoading, user]);

  return (
    <div id="background-image">
      <Header />
      <Center>
        <Container>
          <Box
            id="profile-box"
            w={500}
            mx="auto"
            p="xl"
            mt={50}
            style={{
              borderRadius: "20px",
              boxShadow: "0 4px 20px rgba(0, 0, 0, 0.1)",
              position: "relative",
              zIndex: 1,
              backdropFilter: "blur(10px)",
              marginBottom: "20px",
            }}
          >
            {isEditing ? (
              <Stack align="center" id="profile-stack">
                <Avatar
                  src={
                    avatarPreview || profile?.avatar_url || "default-avatar.png"
                  }
                  radius="xl"
                  size="xl"
                />
                <TextInput
                  id="username"
                  label="Username"
                  value={username}
                  onChange={(e) => setUsername(e.currentTarget.value)}
                  required
                />
                <FileInput
                  id="avatar"
                  label="Upload new avatar"
                  accept="image/*"
                  onChange={(file) => handleFileChange(file)}
                />
                <Group mt="md">
                  <Button
                    color="red"
                    onClick={() => setIsEditing(false)}
                  >
                    Cancel
                  </Button>
                  <Button color="green" onClick={handleUpdate}>
                    Update
                  </Button>
                </Group>
              </Stack>
            ) : (
              <Stack align="center" id="profile-stack-update">
                <Avatar
                  src={profile?.avatar_url || "default-avatar.png"}
                  radius="xl"
                  size="xl"
                />
                <Title order={3}>Profile</Title>

                <Group mt="md" align="center">
                  <ThemeIcon variant="light" color="blue" size="lg" radius="xl">
                    <IconUser size={20} />
                  </ThemeIcon>
                  <Text size="md">{profile?.user_name || "No username"}</Text>
                </Group>

                <Group mt="xs" align="center">
                  <ThemeIcon variant="light" color="blue" size="lg" radius="xl">
                    <IconMail size={20} />
                  </ThemeIcon>
                  <Text size="md">{profile?.email || "No email"}</Text>
                </Group>
              </Stack>
            )}

            {!isEditing && (
              <Center>
                <Button
                  variant="outline"
                  color="blue"
                  bg="#fff"
                  mt="md"
                  onClick={() => setIsEditing(true)}
                >
                  Edit Profile
                </Button>
              </Center>
            )}
          </Box>
        </Container>
      </Center>
    </div>
  );
}

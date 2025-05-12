import {
  Avatar,
  BackgroundImage,
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
      .select("id, user_name, email")
      .eq("id", user.id)
      .single();

    if (error || !data) {
      console.error("Lỗi lấy thông tin profile:", error);
      setIsLoading(false);
      return;
    }

    const avatar_url = user.user_metadata?.avatar_url || "default-avatar.png";

    setProfile({
      id: data.id,
      user_name: data.user_name,
      email: data.email,
      avatar_url,
      avatar_file: null,
    });

    setUsername(data.user_name);
    setAvatarPreview(avatar_url);
    setIsLoading(false);
  };

    useEffect(() => {
    fetchProfile();
  }, []);
  const handleUpdate = async () => {
    if (!profile || !user) return;

    let avatar_url = profile.avatar_url;

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
        return;
      }

      const { data } = supabase.storage.from("avatar").getPublicUrl(filePath);
      avatar_url = data.publicUrl;
    }

    const { error: updateError } = await supabase.auth.updateUser({
      data: {
        user_name: username,
        avatar_url: avatar_url,
      },
    });

    const { error } = await supabase
      .from("users")
      .update({ user_name: username })
      .eq("id", user.id);

    if (error) {
      console.error("Lỗi cập nhật username:", error);
    }

    if (updateError) {
      Notifications.show({
        title: "Update failed",
        message: updateError.message,
        color: "red",
      });
      return;
    }

    Notifications.show({
      title: "Success",
      message: "Profile updated",
      color: "green",
    });

    setIsEditing(false);
    fetchProfile();
    // navigate("/");
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
    navigate("/");}
}, [isLoading, user]);


  return (
    <BackgroundImage id="background-image" src="/public/Income-background.png">
      <Header />
      <Center>
        <Container>
          <Box
            bg="#289F99"
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
              <Stack align="center" bg={"#289F99"}>
                <Avatar
                  src={avatarPreview || profile?.avatar_url}
                  radius="xl"
                  size="xl"
                />
                <TextInput
                  id="username"
                  label="Username"
                  value={username}
                  onChange={(e) => setUsername(e.currentTarget.value)}
                />
                <FileInput
                  id="avatar"
                  label="Upload new avatar"
                  accept="image/*"
                  onChange={(file) => handleFileChange(file)}
                />
                <Group p="apart" mt="md">
                  <Button
                    bg={"red"}
                    color="gray"
                    onClick={() => setIsEditing(false)}
                  >
                    Cancel
                  </Button>
                  <Button bg={"green"} color="blue" onClick={handleUpdate}>
                    Update
                  </Button>
                </Group>
              </Stack>
            ) : (
              <Stack align="center" id="profile-stack" bg={"#289F99"}>
                <Avatar src={profile?.avatar_url} radius="xl" size="xl" />
                <Title order={3}>Profile</Title>
                <Container id="profile-container" p={0} mt="md">
                  <ThemeIcon
                    variant="light"
                    color="black"
                    size="md"
                    radius="xl"
                  >
                    <IconUser size={100} color="#fff" />
                  </ThemeIcon>
                  <Text size="lg" w={500}>
                    {profile?.user_name}
                  </Text>
                </Container>
                <Container id="profile-container" p={0} mt="md">
                  <ThemeIcon
                    variant="light"
                    color="black"
                    radius="xl"
                    size="md"
                  >
                    <IconMail size={20} color="#fff" />
                  </ThemeIcon>
                  <Text size="lg" w={500}>
                    {profile?.email}
                  </Text>
                </Container>
              </Stack>
            )}
            {!isEditing && (
              <Center>
                <Button
                  variant="outline"
                  color="blue"
                  bg={"#fff"}
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
    </BackgroundImage>
  );
}

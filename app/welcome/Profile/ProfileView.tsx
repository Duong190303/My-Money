// src/features/profile/components/ProfileView.tsx
"use client";

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
import { Notifications } from "@mantine/notifications";
import { IconMail, IconUser } from "@tabler/icons-react";
import { useEffect, useState } from "react";
import { getProfile, uploadAvatar, updateProfile } from "./profileService";
import classes from "./Profile.module.css";
import { HeaderPage } from "../Header/HeaderPage";

export const ProfileView = () => {
  const [profile, setProfile] = useState<any>(null);
  const [username, setUsername] = useState("");
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const fetchProfile = async () => {
    try {
      const data = await getProfile();
      setProfile(data);
      setUsername(data.user_name);
      setAvatarPreview(data.avatar_url ?? null);
    } catch (error: any) {
      Notifications.show({
        title: "Lỗi",
        message: error.message,
        color: "red",
      });
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  const handleFileChange = (file: File | null) => {
    setAvatarFile(file);
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      setAvatarPreview(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleUpdate = async () => {
    if (!profile) return;
    setIsLoading(true);
    try {
      let avatarUrl = profile.avatar_url;

      if (avatarFile) {
        avatarUrl = await uploadAvatar(profile.id, avatarFile);
      }

      await updateProfile(profile.id, username, avatarUrl);

      Notifications.show({
        title: "Thành công",
        message: "Hồ sơ đã được cập nhật",
        color: "green",
      });

      setIsEditing(false);
      fetchProfile();
    } catch (err: any) {
      Notifications.show({
        title: "Lỗi cập nhật",
        message: err.message,
        color: "red",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    // <Box bg="#f0f4f8" py="xl">
    //   <Center>
    //     <Container w={480} p="xl" bg="white" style={{ borderRadius: 12 }}>
    //       {isEditing ? (
    //         <Stack align="center">
    //           <Avatar src={avatarPreview || profile?.avatar_url} size="xl" />
    //           <TextInput
    //             label="Tên người dùng"
    //             value={username}
    //             onChange={(e) => setUsername(e.currentTarget.value)}
    //           />
    //           <FileInput label="Chọn ảnh đại diện" onChange={handleFileChange} />
    //           <Group mt="md">
    //             <Button variant="default" onClick={() => setIsEditing(false)}>
    //               Hủy
    //             </Button>
    //             <Button onClick={handleUpdate} loading={isLoading}>
    //               Lưu thay đổi
    //             </Button>
    //           </Group>
    //         </Stack>
    //       ) : (
    //         <Stack align="center">
    //           <Avatar src={profile?.avatar_url} size="xl" />
    //           <Title order={3}>Thông tin cá nhân</Title>
    //           <Group>
    //             <ThemeIcon color="blue" variant="light"><IconUser size={18} /></ThemeIcon>
    //             <Text>{profile?.user_name}</Text>
    //           </Group>
    //           <Group>
    //             <ThemeIcon color="blue" variant="light"><IconMail size={18} /></ThemeIcon>
    //             <Text>{profile?.email}</Text>
    //           </Group>
    //           <Button mt="md" onClick={() => setIsEditing(true)}>
    //             Chỉnh sửa
    //           </Button>
    //         </Stack>
    //       )}
    //     </Container>
    //   </Center>
    // </Box>
    <Box className={classes.backgroundImage}>
      <HeaderPage />
      <Box className={classes.profileContainer}>
        <Box>
          {/* <Container> */}
          <Box className={classes.profileBox}>
            {isEditing ? (
              <Stack className={classes.profileStack}>
                <Avatar
                  src={
                    avatarPreview || profile?.avatar_url || "default-avatar.png"
                  }
                />
                <TextInput
                  className={classes.username}
                  label="Username"
                  value={username}
                  onChange={(e) => setUsername(e.currentTarget.value)}
                  required
                />
                <FileInput
                  className={classes.avatar}
                  label="Upload new avatar"
                  accept="image/*"
                  onChange={handleFileChange}
                />
                <Group>
                  <Button color="red" onClick={() => setIsEditing(false)}>
                    Cancel
                  </Button>
                  <Button
                    color="green"
                    onClick={handleUpdate}
                    loading={isLoading}
                  >
                    Update
                  </Button>
                </Group>
              </Stack>
            ) : (
              <Stack align="center" className={classes.profileStackUpdate}>
                <Avatar
                  src={profile?.avatar_url || "default-avatar.png"}
                  radius="xl"
                  size="xl"
                />
                <Title order={3}>Profile</Title>
                <Box className={classes.profileGroup}>
                <Group align="center" className={classes.profileGroupText}>
                  <ThemeIcon variant="light" color="blue" size="lg" radius="xl">
                    <IconUser size={20} />
                  </ThemeIcon>
                  <Text size="md">{profile?.user_name || "No username"}</Text>
                </Group>
                <Group align="center">
                  <ThemeIcon variant="light" color="blue" size="lg" radius="xl">
                    <IconMail size={20} />
                  </ThemeIcon>
                  <Text size="md">{profile?.email || "No email"}</Text>
                </Group>
                </Box>
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
        </Box>
        {/* </Container> */}
      </Box>
    </Box>
  );
};

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
  Image,
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
    <Box className={classes.backgroundImage}>
      <HeaderPage />
      <Box className={classes.profileContainer}>
        <Box className={classes.profileBox}>
          {isEditing ? (
            <Box className={classes.profilePaperUpdate}>
              <Avatar
                src={
                  avatarPreview || profile?.avatar_url || "default-avatar.png"
                }
              />
              <Box className={classes.inputBox}>
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
              </Box>
              <Box className={classes.btnBox}>
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
              </Box>
            </Box>
          ) : (
            <Box className={classes.profilePaper}>
              <Avatar
                src={profile?.avatar_url || "default-avatar.png"}
                radius="xl"
                size="xl"
              />
              <Title order={3}>Profile</Title>
              <Box className={classes.profileGroup}>
                <Box className={classes.profileGroupText}>
                  <Image src={"/user.png"} w={40} h={40} />
                  <Text>{profile?.user_name || "No username"}</Text>
                </Box>
                <Box className={classes.profileGroupText}>
                  <Image src={"/email.png"} w={40} h={40} />
                  <Text>{profile?.email || "No email"}</Text>
                </Box>
              </Box>
            </Box>
          )}

          {!isEditing && (
            <Box className={classes.editBtnBox}>
              <Button
                variant="outline"
                color="blue"
                bg="#fff"
                onClick={() => setIsEditing(true)}
                className={classes.editBtn}
              >
                Edit Profile
              </Button>
            </Box>
          )}
        </Box>
      </Box>
    </Box>
  );
};

// "use client";

// import {
//   Avatar,
//   Box,
//   Button,
//   Center,
//   Container,
//   FileInput,
//   Group,
//   Stack,
//   Text,
//   TextInput,
//   ThemeIcon,
//   Title,
// } from "@mantine/core";
// import { useEffect, useState } from "react";
// import { Notifications } from "@mantine/notifications";
// import { HeaderPage } from "../Header/HeaderPage";
// import { IconMail, IconUser } from "@tabler/icons-react";
// import classes from "./Profile.module.css";
// import {
//   getProfile,
//   uploadAvatar,
//   updateAuthMetadata,
//   updateUserProfile,
// } from "./profileService";

// // export async function loader() {
// //   return null;
// // }
// export const Profile = () => {
//   const [profile, setProfile] = useState<any>(null);
//   const [isEditing, setIsEditing] = useState(false);
//   const [username, setUsername] = useState("");
//   const [avatarFile, setAvatarFile] = useState<File | null>(null);
//   const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
//   const [isLoading, setIsLoading] = useState(false);

//   useEffect(() => {
//     fetchProfile();
//   }, []);

//   const fetchProfile = async () => {
//     setIsLoading(true);
//     try {
//       const data = await getProfile();
//       setProfile(data);
//       setUsername(data.user_name);
//       setAvatarPreview(data.avatar_url ?? null);
//       Notifications.show({
//         title: "Lỗi",
//         message: "Không thể tải thông tin người dùng",
//         color: "red",
//       });
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const handleFileChange = (file: File | null) => {
//     if (!file) return;
//     setAvatarFile(file);
//     const reader = new FileReader();
//     reader.onloadend = () => {
//       setAvatarPreview(reader.result as string);
//     };
//     reader.readAsDataURL(file);
//   };

//   const handleUpdate = async () => {
//     if (!profile) return;
//     setIsLoading(true);
//     try {
//       let avatarUrl = profile.avatar_url;

//       if (avatarFile) {
//         avatarUrl = await uploadAvatar(profile.id, avatarFile);
//       }

//       await updateAuthMetadata(username, avatarUrl);
//       await updateUserProfile(profile.id, username, avatarUrl);

//       Notifications.show({
//         title: "Cập nhật thành công",
//         message: "Thông tin đã được cập nhật",
//         color: "green",
//       });

//       setIsEditing(false);
//       fetchProfile();
//     } catch (error: any) {
//       Notifications.show({
//         title: "Lỗi cập nhật",
//         message: error.message || "Đã xảy ra lỗi khi cập nhật",
//         color: "red",
//       });
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   return (
//     <Box id={classes.backgroundImage}>
//       <HeaderPage />
//       <Center>
//         <Container>
//           <Box
//             id={classes.profileBox}
//             w={500}
//             mx="auto"
//             p="xl"
//             mt={50}
//             style={{
//               borderRadius: "20px",
//               boxShadow: "0 4px 20px rgba(0, 0, 0, 0.1)",
//               position: "relative",
//               zIndex: 1,
//               backdropFilter: "blur(10px)",
//               marginBottom: "20px",
//             }}
//           >
//             {isEditing ? (
//               <Stack align="center" id={classes.profileStack}>
//                 <Avatar
//                   src={
//                     avatarPreview || profile?.avatar_url || "default-avatar.png"
//                   }
//                   radius="xl"
//                   size="xl"
//                 />
//                 <TextInput
//                   id={classes.username}
//                   label="Username"
//                   value={username}
//                   onChange={(e) => setUsername(e.currentTarget.value)}
//                   required
//                 />
//                 <FileInput
//                   id={classes.avatar}
//                   label="Upload new avatar"
//                   accept="image/*"
//                   onChange={handleFileChange}
//                 />
//                 <Group mt="md">
//                   <Button color="red" onClick={() => setIsEditing(false)}>
//                     Cancel
//                   </Button>
//                   <Button
//                     color="green"
//                     onClick={handleUpdate}
//                     loading={isLoading}
//                   >
//                     Update
//                   </Button>
//                 </Group>
//               </Stack>
//             ) : (
//               <Stack align="center" id={classes.profileStackUpdate}>
//                 <Avatar
//                   src={profile?.avatar_url || "default-avatar.png"}
//                   radius="xl"
//                   size="xl"
//                 />
//                 <Title order={3}>Profile</Title>
//                 <Group mt="md" align="center">
//                   <ThemeIcon variant="light" color="blue" size="lg" radius="xl">
//                     <IconUser size={20} />
//                   </ThemeIcon>
//                   <Text size="md">{profile?.user_name || "No username"}</Text>
//                 </Group>
//                 <Group mt="xs" align="center">
//                   <ThemeIcon variant="light" color="blue" size="lg" radius="xl">
//                     <IconMail size={20} />
//                   </ThemeIcon>
//                   <Text size="md">{profile?.email || "No email"}</Text>
//                 </Group>
//               </Stack>
//             )}

//             {!isEditing && (
//               <Center>
//                 <Button
//                   variant="outline"
//                   color="blue"
//                   bg="#fff"
//                   mt="md"
//                   onClick={() => setIsEditing(true)}
//                 >
//                   Edit Profile
//                 </Button>
//               </Center>
//             )}
//           </Box>
//         </Container>
//       </Center>
//     </Box>
//   );
// };
import { ProfileView } from "./ProfileView";

export default function ProfilePage() {
  return <ProfileView />;
}

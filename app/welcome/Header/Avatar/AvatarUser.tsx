"use client";
import React, { useState, useEffect } from "react";
import {
  Button,
  Group,
  Box,
  Text,
  Paper,
  Avatar,
  Image,
  Drawer,
} from "@mantine/core";
import { Link } from "react-router-dom";
import { IconChevronRight } from "@tabler/icons-react";
import { useNavigate } from "react-router-dom";
import { showNotification } from "@mantine/notifications";
import { supabase } from "../../../supabase";
import { useDisclosure } from "@mantine/hooks";
import classes from "../Header.module.css";
import { Menu } from "../Menu";

export const AvatarUser: React.FC = () => {
  // if (typeof window === "undefined") return null;
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [userId, setUserId] = useState<string | null>(null);
  const [avatar, setAvatar] = useState<string | null>(null); // Thay đổi kiểu dữ liệu của avatar thành string | null
  const [popoverOpened, setPopoverOpened] = useState(false);
  const [opened, { open, close }] = useDisclosure(false);

  useEffect(() => {
    async function getCurrentUser() {
      const {
        data: { user },
        error,
      } = await supabase.auth.getUser();

      if (error) {
        console.error("No User!", error.message);
      } else if (user) {
        setUserId(user.id);

        const { data, error } = await supabase
          .from("users")
          .select("id, user_name, email, avatar_url")
          .eq("id", user.id)
          .single();

        if (error) {
          console.error("No User!", error.message);
        } else if (data) {
          setUsername(data.user_name || "");
          setEmail(data.email);
          setAvatar(
            data.avatar_url ||
              "https://cdn.builder.io/api/v1/image/assets/TEMP/79bd5203f63e2a5e79bf3c947570b8ed31965494"
          ); // Lấy avatar từ bảng users);
        }
      } else {
        setUserId(null);
        setUsername("");
        setEmail("");
        setAvatar(null);
      }
    }

    getCurrentUser();
  }, []);

  // Xử lý đăng xuất
  const handleLogout = async () => {
    // Đăng xuất khỏi phiên Supabase
    const { error } = await supabase.auth.signOut();
    setUserId(null);
    if (error) {
      showNotification({
        title: "Lỗi đăng xuất",
        message: error.message,
        color: "red",
      });
      return;
    }

    // Xóa dữ liệu lưu trữ cục bộ (nếu cần)
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    // Reload toàn bộ trang để reset toàn bộ state, bao gồm useState
    window.location.reload();
    navigate("/"); // Chuyển về trang chính
  };

  const handleLogin = () => {
    navigate("/login"); // Chuyển về trang Login
  };

  const handleNotifications = (route: string, message: string) => {
    if (userId) {
      navigate(route);
    } else {
      showNotification({
        title: "Not logged in",
        message,
        color: "red",
      });
    }
  };

  return (
    // <Grid>
    //   <Grid.Col span="content" className={classes.homeLoginContainer}>
    //     <Popover
    //       width={200}
    //       opened={popoverOpened}
    //       onChange={setPopoverOpened}
    //       position="bottom"
    //       withArrow
    //       shadow="md"
    //     >
    //       <Popover.Target>
    //         <Avatar>
    //           <Image src={avatar} alt="User Avatar" />
    //         </Avatar>
    //       </Popover.Target>
    //       <Popover.Dropdown
    //         onMouseEnter={() => setPopoverOpened(true)}
    //         onMouseLeave={() => setPopoverOpened(false)}
    //       >
    //         {userId ? (
    //           <>
    //             <Paper shadow="sm" radius="md" p="md">
    //               <Group align="bottom-left">
    //                 <Avatar src={avatar} radius="xl" size="md" />
    //                 <Box>
    //                   <Text fw={500} size="sm">
    //                     {username || "Loading..."}
    //                   </Text>
    //                   <Text size="xs" c="dimmed">
    //                     {email || "Loading..."}
    //                   </Text>
    //                 </Box>
    //               </Group>
    //             </Paper>
    //             <Button
    //               variant="subtle"
    //               component={Link}
    //               to="/profile"
    //               fullWidth
    //               mt="sm"
    //             >
    //               Profile{" "}
    //               <IconChevronRight size={16} style={{ marginLeft: 5 }} />
    //             </Button>
    //             <Button
    //               variant="subtle"
    //               onClick={handleLogout}
    //               fullWidth
    //               mt="sm"
    //               style={{ backgroundColor: "red", color: "white" }}
    //             >
    //               Log out
    //             </Button>
    //           </>
    <>
      <Drawer
        opened={opened}
        onClose={close}
        padding="xs"
        size="sm"
        position="right"
        withCloseButton={false}
        styles={{
          content: {
            background: "#3ca6a5",
          },
        }}
        classNames={{
          inner: classes.drawerInner,
          overlay: classes.drawerOverlay,
        }}
      >
        {userId ? (
          <Box className={classes.drawerContainer}>
            <Paper shadow="sm" radius="md" p="md" className={classes.paperUser}>
              <Group align="bottom-left">
                <Avatar src={avatar} radius="xl" size="md" />
                <Box>
                  <Text fw={500} size="sm">
                    {username || ""}
                  </Text>
                  <Text size="xs" c="dimmed">
                    {email || ""}
                  </Text>
                </Box>
              </Group>
            </Paper>
            <Link to="/profile" className={classes.btnProfile}>
              Profile{" "}
              <IconChevronRight
                size={16}
                style={{ marginLeft: 5 }}
                className={classes.iconChevronRight}
              />
            </Link>
            <Box hiddenFrom="md">
              <Menu />
            </Box>
            <Button
              variant="subtle"
              onClick={handleLogout}
              fullWidth
              className={classes.btnLogout}
              classNames={{
                label: classes.labelLogout,
                root: classes.rootLogout,
              }}
            >
              Log out
            </Button>
          </Box>
        ) : (
          <Button
            variant="transparent"
            className={classes.btnWithMymoney}
            onClick={() => (window.location.href = "/login")}
          >
            Login
          </Button>
        )}
      </Drawer>
      <Avatar
        onClick={open}
        className={classes.avatar}
        radius="xl"
        size="md"
        w={35}
        h={35}
      >
        <Image src={avatar} alt="User Avatar" fit="cover" />
      </Avatar>
    </>
  );
};

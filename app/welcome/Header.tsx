import { Button, Text } from "@mantine/core";
import { Link, useNavigate } from "react-router-dom";
import { IconChevronRight } from "@tabler/icons-react";
import { useState, useEffect } from "react";
import { Avatar, Group, UnstyledButton } from "@mantine/core";
import { supabase } from "../supabase"; // Đường dẫn đến tệp supabase.ts
import { Popover, Paper, Box } from "@mantine/core";
import {showNotification } from "@mantine/notifications";
export function Header() {
  if (typeof window === "undefined") return null;
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [userId, setUserId] = useState<string | null>(null); // Thay đổi kiểu dữ liệu của userId thành string | null
  const [opened, setOpened] = useState(false);
  const [avatar, setAvatar] = useState<string | null>(null); // Thay đổi kiểu dữ liệu của avatar thành string | null

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

      // Ưu tiên user_name (từ đăng ký thường), sau đó full_name / name (Google), cuối cùng dùng phần đầu email
      const fallbackUsername =
        user.user_metadata.user_name ||
        user.user_metadata.full_name ||
        user.user_metadata.name ||
        user.email?.split("@")[0] || // phần trước @ trong email
        "anonymous";

      setUsername(fallbackUsername);        
      setEmail(user.email ?? "");
        setAvatar(
          user.user_metadata.avatar_url ||
            "https://cdn.builder.io/api/v1/image/assets/TEMP/79bd5203f63e2a5e79bf3c947570b8ed31965494"
        ); // Lấy avatar từ user metadata
      }
    }

    getCurrentUser();
  }, []);

  // Xử lý đăng xuất
  const handleLogout = () => {
    localStorage.removeItem("token"); // Xóa token hoặc user session
    localStorage.removeItem("user");
    navigate("/login"); // Chuyển về trang Login
  };

  const handleLogin = () => {
    navigate("/login"); // Chuyển về trang Login
  };

const handleNotifications = (route: string, message: string) => {
  if (userId) {
    navigate(route);
  } else {
    showNotification({
      title: "Chưa đăng nhập",
      message,
      color: "red",
    });
  }
};

const handleIncome = () => handleNotifications ("/income", "Vui lòng đăng nhập để truy cập INCOME");
const handleDataReport = () => handleNotifications ("/datareport", "Vui lòng đăng nhập để truy cập DATA REPORT");
const handleExpenses = () => handleNotifications ("/expenses", "Vui lòng đăng nhập để truy cập EXPENSES");
  return (
    <div
      className="header-background"
      style={{
        display: "flex",
        width: "105%",
        justifyContent: "space-evenly",
      }}
    >
{/* <Notifications position="top-right" zIndex={1000} />   */}
    {/* Header nằm trong background */}
      <div className="home-header-container">
        <img
          src="https://cdn.builder.io/api/v1/image/assets/TEMP/18083109a25a67b4d19a5291268bdd2c91ef258e"
          className="home-logo"
          alt="My Money"
        />
        <nav className="home-navigation">
          <Button
            variant="white"
            color="Black"
            size="md"
            radius="xl"
            className="home-nav-item"
            onClick={() => navigate("/")}
          >
            HOME
          </Button>
          <Button
            variant="white"
            color="Black"
            size="md"
            radius="xl"
            className="home-nav-item"
            onClick={() => handleIncome()}
          >
            INCOME
          </Button>
          <Button
            variant="white"
            color="Black"
            size="md"
            radius="xl"
            className="home-nav-item"
            onClick={() => handleExpenses()}
          >
            EXPENSES
          </Button>
          <Button
            variant="white"
            color="Black"
            size="md"
            radius="xl"
            className="home-nav-item"
            onClick={() => handleDataReport()}
          >
            DATA REPORT
          </Button>
        </nav>
        <div className="home-login-container">
          <Popover
            id="popover"
            width={200}
            opened={opened}
            onChange={setOpened}
            position="bottom"
            withArrow
            shadow="md"
          >
            <Popover.Target>
              <Avatar
                id="avatar"
                src={avatar}
                alt="User Avatar"
                color="black"
                radius="xl"
                onMouseEnter={() => setOpened(true)}
                onMouseLeave={() => setOpened(false)}
                style={{ cursor: "pointer", backgroundColor: "white" }}
              />
            </Popover.Target>
            <Popover.Dropdown
              id="popover-dropdown"
              onMouseEnter={() => setOpened(true)}
              onMouseLeave={() => setOpened(false)}
            >
              <Paper shadow="sm" radius="md" p="md" id="paper">
                <Group align="bottom-left">
                  <Avatar
                    style={{ display: "flex", justifyContent: "center" }}
                    src={avatar}
                    radius="xl"
                    size="md"
                  />
                  <Box>
                    <Text fw={500} size="sm">
                      {username || "Loading..."}
                    </Text>
                    <Text size="xs" c="dimmed">
                      {email || "Loading..."}
                    </Text>
                  </Box>
                </Group>
              </Paper>
              {userId ? (
                <Button
                  id="logout-button"
                  variant="subtle"
                  component="button"
                  onClick={handleLogout}
                >
                  Log out
                </Button>
              ) : (
                <Button
                  id="login-button"
                  variant="subtle"
                  component="button"
                  onClick={handleLogin}
                >
                  Log in
                </Button>
              )}
            </Popover.Dropdown>
          </Popover>
        </div>
      </div>
    </div>
  );
}

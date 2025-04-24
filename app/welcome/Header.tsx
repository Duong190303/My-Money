import { Button, Text } from "@mantine/core";
import { Link, useNavigate } from "react-router-dom";
import { IconChevronRight } from "@tabler/icons-react";
import { useState, useEffect } from "react";
import { Avatar, Group, UnstyledButton } from "@mantine/core";
import { supabase } from "../supabase"; // Đường dẫn đến tệp supabase.ts
import { Popover, Paper, Box } from "@mantine/core";

export function Header() {
  if (typeof window === "undefined") return null;
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [userId, setUserId] = useState<string | null>(null); // Thay đổi kiểu dữ liệu của userId thành string | null
  const [opened, setOpened] = useState(false);
  // User
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
        console.log("User ID:", user.id);
      }
    }

    getCurrentUser();
  }, []);

  useEffect(() => {
    const fetchUserInfo = async () => {
      const userData = localStorage.getItem("user");
      if (!userData) {
        navigate("/login");
        return;
      }

      const { user_id } = JSON.parse(userData);

      const { data, error } = await supabase
        .from("users")
        .select("username, email")
        .eq("id_user", user_id)
        .single();

      if (error) {
        console.error("Lỗi khi lấy user từ bảng users:", error.message);
        return;
      }

      setUsername(data.username);
      setEmail(data.email);
    };

    fetchUserInfo();
  }, [navigate]);

  // Xử lý đăng xuất
  const handleLogout = () => {
    localStorage.removeItem("token"); // Xóa token hoặc user session
    localStorage.removeItem("user");
    navigate("/login"); // Chuyển về trang Login
  };
  return (
    <div
      className="header-background"
      style={{
        display: "flex",
        width: "105%",
        justifyContent: "space-evenly",
      }}
    >
      {/* Header nằm trong background */}
      <div className="home-header-container">
        <img
          src="https://cdn.builder.io/api/v1/image/assets/TEMP/18083109a25a67b4d19a5291268bdd2c91ef258e"
          className="home-logo"
          alt="My Money"
        />
        <nav className="home-navigation">
          <Link className="home-nav-item" to="/">
            HOME
          </Link>
          <Link className="home-nav-item" to="/income">
            INCOME
          </Link>
          <Link className="home-nav-item" to="/expenses">
            EXPENSES
          </Link>
          <Link className="home-nav-item" to="/datareport">
            DATA REPORT
          </Link>
        </nav>
        <div className="home-login-container">
          {/* <UnstyledButton onClick={handleLogout}>
            <Group>
              <Avatar
                src="https://cdn.builder.io/api/v1/image/assets/TEMP/79bd5203f63e2a5e79bf3c947570b8ed31965494"
                radius="xl"
              />
              <div style={{ flex: 1 }}>
                <Text size="sm" fw={500}>
                  {username || "Loading..."}
                </Text>
                <Text c={"dimmed"} size="xs" fw={500}>
                  {email || "Email"}
                </Text>
              </div>
              <IconChevronRight size={14} stroke={1.5} />
            </Group>
          </UnstyledButton> */}
          <Popover id="popover"
            width={200}
            opened={opened}
            onChange={setOpened}
            position="bottom"
            withArrow
            shadow="md"

          >
            <Popover.Target>
              <Avatar id="avatar"
                src="https://cdn.builder.io/api/v1/image/assets/TEMP/79bd5203f63e2a5e79bf3c947570b8ed31965494"
                radius="xl"
                onMouseEnter={() => setOpened(true)}
                onMouseLeave={() => setOpened(false)}
                style={{ cursor: "pointer" }}
              />
            </Popover.Target>
            <Popover.Dropdown id="popover-dropdown"
              onMouseEnter={() => setOpened(true)}
              onMouseLeave={() => setOpened(false)}
            >
              <Paper shadow="sm" radius="md" p="md" id="paper">
                <Group align="center">
                  <Avatar
                    src="https://cdn.builder.io/api/v1/image/assets/TEMP/79bd5203f63e2a5e79bf3c947570b8ed31965494"
                    radius="xl"
                    size="md"
                  />
                  <Box>
                    <Text fw={500} size="sm">
                      {username || "Loading..."}
                    </Text>
                    <Text size="xs" c="dimmed">
                      {email || "Email"}
                    </Text>
                  </Box>
                </Group>
              </Paper>
              <Button id="logout-button"
                  variant="subtle"
                  component="button"
                  onClick={handleLogout}

                >
                  Log out
                </Button>
            </Popover.Dropdown>
          </Popover>
        </div>
      </div>
    </div>
  );
}
// import {
//   Avatar,
//   Group,
//   Text,
//   UnstyledButton,
// } from "@mantine/core";
// import { Link, useNavigate } from "react-router-dom";
// import { IconChevronRight } from "@tabler/icons-react";
// import { useState, useEffect } from "react";
// import { supabase } from "../supabase";

// interface User {
//   username: string;
//   email: string;
// }

// export function Header() {
//   const navigate = useNavigate();
//   const [userInfo, setUserInfo] = useState<User | null>(null);

//   useEffect(() => {
//     const fetchUser = async () => {
//       const { data, error } = await supabase.auth.getUser();
//       if (error || !data.user) {
//         console.error("Không thể lấy thông tin người dùng:", error?.message);
//         return;
//       }

//       const { email, user_metadata } = data.user;
//       setUserInfo({
//         username: user_metadata?.username || "",
//         email: email || "",
//       });
//     };

//     fetchUser();
//   }, []);

//   const handleLogout = async () => {
//     await supabase.auth.signOut();
//     localStorage.clear();
//     navigate("/login");
//   };

//   // Nếu chưa có userInfo → chưa render để tránh mismatch
//   if (!userInfo) return null;

//   return (
//     <div
//       className="header-background"
//       style={{
//         display: "flex",
//         width: "105%",
//         justifyContent: "space-evenly",
//       }}
//     >
//       <div className="home-header-container">
//         <img
//           src="https://cdn.builder.io/api/v1/image/assets/TEMP/18083109a25a67b4d19a5291268bdd2c91ef258e"
//           className="home-logo"
//           alt="My Money"
//         />
//         <nav className="home-navigation">
//           <Link className="home-nav-item" to="/">HOME</Link>
//           <Link className="home-nav-item" to="/income">INCOME</Link>
//           <Link className="home-nav-item" to="/expenses">EXPENSES</Link>
//           <Link className="home-nav-item" to="/datareport">DATA REPORT</Link>
//         </nav>
//         <div className="home-login-container">
//           <UnstyledButton onClick={handleLogout}>
//             <Group>
//               <Avatar
//                 src="https://cdn.builder.io/api/v1/image/assets/TEMP/79bd5203f63e2a5e79bf3c947570b8ed31965494"
//                 radius="xl"
//               />
//               <div style={{ flex: 1 }}>
//                 <Text size="sm" fw={500}>{userInfo.username}</Text>
//                 <Text c={"dimmed"} size="xs" fw={500}>{userInfo.email}</Text>
//               </div>
//               <IconChevronRight size={14} stroke={1.5} />
//             </Group>
//           </UnstyledButton>
//         </div>
//       </div>
//     </div>
//   );
// }

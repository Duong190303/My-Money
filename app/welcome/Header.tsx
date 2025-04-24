// import { Text } from "@mantine/core";
// import { Link, useNavigate } from "react-router-dom";

// export function Header() {
//   if (typeof window === "undefined") return null;
//   const navigate = useNavigate();


//   // Xử lý đăng xuất
//   const handleLogout = () => {
//     localStorage.removeItem("token"); // Xóa token hoặc user session
//     localStorage.removeItem("user");
//     navigate("/login"); // Chuyển về trang Login
//   };
//   return (
    
//   <div className="header-background"
//   style={{
//     display: "flex",
//     width: "105%",
//     justifyContent: "space-evenly"
//   }}
//   >
//     {/* Header nằm trong background */}
//     <div className="home-header-container">
//       <img
//         src="https://cdn.builder.io/api/v1/image/assets/TEMP/18083109a25a67b4d19a5291268bdd2c91ef258e"
//         className="home-logo"
//         alt="My Money"
//       />
//       <nav className="home-navigation">
//         <Link className="home-nav-item" to="/">
//           HOME
//         </Link>
//         <Link className="home-nav-item" to="/income">
//           INCOME
//         </Link>
//         <Link className="home-nav-item" to="/expenses">
//           EXPENSES
//         </Link>
//         <Link className="home-nav-item" to="/datareport">
//           DATA REPORT
//         </Link>
//       </nav>
//       <div className="home-login-container">
//         <div className="home-login-button" onClick={handleLogout}>
//           <img
//             src="https://cdn.builder.io/api/v1/image/assets/TEMP/79bd5203f63e2a5e79bf3c947570b8ed31965494"
//             className="home-profile-icon"
//             alt=""
//           />
//           <span className="home-login-text">
//             Log out
//           </span>
//         </div>
//       </div>
//     </div>
//   </div>
//   );
// };
import {
  Avatar,
  Group,
  Text,
  UnstyledButton,
} from "@mantine/core";
import { Link, useNavigate } from "react-router-dom";
import { IconChevronRight } from "@tabler/icons-react";
import { useState, useEffect } from "react";
import { supabase } from "../supabase";

interface User {
  username: string;
  email: string;
}

export function Header() {
  const navigate = useNavigate();
  const [userInfo, setUserInfo] = useState<User | null>(null);

  useEffect(() => {
    const fetchUser = async () => {
      const { data, error } = await supabase.auth.getUser();
      if (error || !data.user) {
        console.error("Không thể lấy thông tin người dùng:", error?.message);
        return;
      }

      const { email, user_metadata } = data.user;
      setUserInfo({
        username: user_metadata?.username || "",
        email: email || "",
      });
    };

    fetchUser();
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    localStorage.clear();
    navigate("/login");
  };

  // Nếu chưa có userInfo → chưa render để tránh mismatch
  if (!userInfo) return null;

  return (
    <div
      className="header-background"
      style={{
        display: "flex",
        width: "105%",
        justifyContent: "space-evenly",
      }}
    >
      <div className="home-header-container">
        <img
          src="https://cdn.builder.io/api/v1/image/assets/TEMP/18083109a25a67b4d19a5291268bdd2c91ef258e"
          className="home-logo"
          alt="My Money"
        />
        <nav className="home-navigation">
          <Link className="home-nav-item" to="/">HOME</Link>
          <Link className="home-nav-item" to="/income">INCOME</Link>
          <Link className="home-nav-item" to="/expenses">EXPENSES</Link>
          <Link className="home-nav-item" to="/datareport">DATA REPORT</Link>
        </nav>
        <div className="home-login-container">
          <UnstyledButton onClick={handleLogout}>
            <Group>
              <Avatar
                src="https://cdn.builder.io/api/v1/image/assets/TEMP/79bd5203f63e2a5e79bf3c947570b8ed31965494"
                radius="xl"
              />
              <div style={{ flex: 1 }}>
                <Text size="sm" fw={500}>{userInfo.username}</Text>
                <Text c={"dimmed"} size="xs" fw={500}>{userInfo.email}</Text>
              </div>
              <IconChevronRight size={14} stroke={1.5} />
            </Group>
          </UnstyledButton>
        </div>
      </div>
    </div>
  );
}

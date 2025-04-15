import { Text } from "@mantine/core";
import { Link, useNavigate } from "react-router-dom";
import { Header } from "./Header";

export function Home() {
  if (typeof window === "undefined") return null;
  const navigate = useNavigate();


  // Xử lý đăng xuất
  const handleLogout = () => {
    localStorage.removeItem("token"); // Xóa token hoặc user session
    localStorage.removeItem("user");
    navigate("/login"); // Chuyển về trang Login
  };
  return (
    
  <div className="home-background">
    <Header/>
  </div>
  );
};

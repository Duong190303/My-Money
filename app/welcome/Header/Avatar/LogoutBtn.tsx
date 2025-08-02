import { Button } from "@mantine/core";
// import { showNotification } from "@mantine/notifications";
import { supabase } from "../../../supabase";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

export const LogoutBtn: React.FC = () => {
  const navigate = useNavigate();

  const [userId, setUserId] = useState<string | null>(null);
  const handleLogin = () => {
    navigate("/login"); // Chuyển về trang Login
  };
  const handleLogout = async () => {
    // Đăng xuất khỏi phiên Supabase
    const { error } = await supabase.auth.signOut();
    setUserId(null);
  };

  return <Button onClick={handleLogout}>Logout</Button>;
};

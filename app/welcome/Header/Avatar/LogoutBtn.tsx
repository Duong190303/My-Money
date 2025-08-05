import { Button } from "@mantine/core";
import { supabase } from "../../../supabase";
import { useNavigate } from "react-router-dom";
import classes from "./Login.module.css";

export const LogoutBtn: React.FC = () => {
  const navigate = useNavigate();

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.error("Lỗi khi đăng xuất:", error);
    } else {
      // Đăng xuất thành công, chuyển hướng người dùng về trang login
      navigate("/login");
    }
  };

  return <Button className={classes.LogoutBtn} onClick={handleLogout}>Logout</Button>;
};
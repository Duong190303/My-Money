import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import { supabase } from "../supabase";
import { useDisclosure } from "@mantine/hooks";
import { PasswordInput, Stack, TextInput, Button, Loader } from "@mantine/core";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useForm } from "@mantine/form";
import "../welcome/Style/Login.css";
import Home from "../welcome/Home";


export function Login() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [visible, { toggle }] = useDisclosure(false);
  if (typeof window === "undefined") return null;
  const navigate = useNavigate();

  const form = useForm({
    initialValues: {
      email: "",
      password: "",
    },
    validate: {
      email: (value) =>
        /^\S+@\S+\.\S+$/.test(value) ? null : "Email không hợp lệ",
      password: (value) =>
        value.length >= 8 ? null : "Mật khẩu ít nhất 8 ký tự",
    },
  });

  const handleLogin = async (values: typeof form.values) => {
    setLoading(true);
    setError(null);

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: values.email,
        password: values.password,
      });

      if (error || !data.user) {
        setError("Email hoặc mật khẩu không đúng!");
        setLoading(false);
        return;
      }

      // Lưu user info vào localStorage (hoặc context)
      localStorage.setItem("user", JSON.stringify(data.user));

      // Lấy thêm thông tin mở rộng từ bảng users (nếu cần)
      const { data: userInfo } = await supabase
        .from("users")
        .select("*")
        .eq("id_user", data.user.id)
        .single();

      if (userInfo) {
        localStorage.setItem("userInfo", JSON.stringify(userInfo));
      }

      navigate("/");
    } catch (err) {
      setError("Đăng nhập thất bại. Vui lòng thử lại.");
    }

    setLoading(false);
  };
  const handleHomeClick = () => {
    window.location.href = "/"; // Chuyển đến trang chủ
  };

  return (
    <div className="login-container">
      <div className="form-section">
        <div className="welcome-title">Welcome Back!</div>
        <div className="welcome-subtitle">
          This web helps you manage your money effectively
        </div>
        <div className="form">
          <form
            onSubmit={form.onSubmit(handleLogin)}
            className="form-login-container"
          >
            <Stack
              style={{
                width: "310px",
                height: "150px",
                backgroundColor: "#C3BDBD",
              }}
            >
              <TextInput
                type="email"
                placeholder="Email"
                {...form.getInputProps("email")}
                styles={{
                  input: {
                    borderRadius: "20px",
                    backgroundColor: "white", // Màu nền input
                    height: "42px",
                    width: "310px",
                  },
                }}
              />
              <PasswordInput
                type="password"
                placeholder="Password"
                visible={visible}
                onVisibilityChange={toggle}
                {...form.getInputProps("password")}
                rightSectionWidth={42} // Đặt độ rộng của phần chứa icon
                styles={{
                  input: {
                    borderRadius: "20px",
                    backgroundColor: "white", // Màu nền input
                    height: "42px",
                    marginTop: "16px",
                    width: "310px",
                  },
                }}
              />
            </Stack>
            <Button
              type="submit"
              disabled={loading}
              className="register-button"
              styles={{
                root: {
                  borderRadius: "20px",
                  backgroundColor: "#35A7B9", // Màu nền input
                  height: "40px",
                  width: "150px",
                  marginBottom: "20px",
                },
              }}
            >
              {loading ? <Loader size="xs" /> : "Login"}
            </Button>
            <div className="register-link-container">
              <span className="register-text">
                You have't had an account? <Link to="/register">Register</Link>
              </span>
            </div>
            {error && (
              <div className="error-message" style={{ color: "red" }}>
                {error}
              </div>
            )}
          </form>
        </div>
        <Link to="/" className="back-link" onClick={handleHomeClick} >
        </Link>
      </div>
      <div className="image-section">
        <div className="image-container">
          <img
            src="https://cdn.builder.io/api/v1/image/assets/TEMP/217622f788d0368249d19a34c85ab3254f670259"
            alt="Money management illustration"
          />
        </div>
      </div>
    </div>
  );
}
export default Login;

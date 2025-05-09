import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import { supabase } from "../supabase";
import { useDisclosure } from "@mantine/hooks";
import { PasswordInput, Stack, TextInput, Button, Loader, ThemeIcon } from "@mantine/core";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useForm } from "@mantine/form";
import "../welcome/Style/Login.css";
// import Home from "../welcome/Home";
import { faGoogle } from "@fortawesome/free-brands-svg-icons";
import { showNotification } from "@mantine/notifications";


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
        /^\S+@\S+\.\S+$/.test(value) ? null : "Invalid email",
      password: (value) =>
        value.length >= 8 ? null : "Password at least 8 characters",
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
        showNotification({
          title: "Login failed",
          message: "Email or password incorrectly",
          color: "red",
        });
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
  
      showNotification({
        title: "Login successfully",
        message: "Welcome to login",
        color: "teal",
      });
      navigate("/");
    } catch (err) {
      showNotification({
        title: "Login failed",
        message: "Please try again",
        color: "red",
      });
    }
  
    setLoading(false);
  };  const handleHomeClick = () => {
    window.location.href = "/"; // Chuyển đến trang chủ
  };
  const handleGoogleLogin = async () => {
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: "google",
    });
    if (error) {
      console.error("Error logging in:", error.message);
    }
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
            <div id="or">
              <span>OR</span>
            </div>

            <Button
              variant="outline"
              onClick={handleGoogleLogin}
              // leftIcon={<FcGoogle size={18} />}
              styles={{
                root: {
                  borderRadius: "20px",
                  backgroundColor: "white",
                  color: "#333",
                  border: "1px solid #ccc",
                  height: "40px",
                  width: "310px",
                  marginBottom: "10px",
                },
              }}
            >
              <FontAwesomeIcon icon={faGoogle} size="lg" color="#4285F4" style={{ marginRight: "1 0px" }}/>
              Log in with Google
            </Button>
            {error && (     
              <div className="error-message" style={{ color: "red" }}>
                {error}
              </div>
            )}
          </form>
        </div>
        <Link to="/" className="back-link" onClick={handleHomeClick}></Link>
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

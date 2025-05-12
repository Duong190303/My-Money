import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../supabase";
import { useDisclosure } from "@mantine/hooks";
import {
  PasswordInput,
  Stack,
  TextInput,
  Button,
  Loader,
  Center,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import "../welcome/Style/Login.css";
// import Home from "../welcome/Home";
import { showNotification } from "@mantine/notifications";
import { Form } from "react-router";
import { Image } from "@mantine/core";

export function Login() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [visible, { toggle }] = useDisclosure(false);
  if (typeof window === "undefined") return null;
  const navigate = useNavigate();
  const [isSignUp, setIsSignUp] = useState(false);
  const [isActive, setIsActive] = useState(false);

  const formRegister = useForm({
    initialValues: {
      email: "",
      password: "",
      confirmPassword: "",
    },
    validate: {
      email: (value) => (/^\S+@\S+\.\S+$/.test(value) ? null : "Invalid email" ),
      password: (value) =>
        value.length >= 8 ? null : "Password at least 8 characters",
      confirmPassword: (value, values) =>
        value === values.password ? null : "The password is not matched",
    },
  });

  const formLogin = useForm({
    initialValues: {
      email: "",
      password: "",
    },
    validate: {
      email: (value) => (/^\S+@\S+\.\S+$/.test(value) ? null : "Invalid email"),
      password: (value) =>
        value.length >= 8 ? null : "Password at least 8 characters",
    },
  });
  const handleLogin = async (values: typeof formLogin.values) => {
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
    } finally {
      setLoading(false);
    }

    setLoading(false);
  };
  const handleHomeClick = () => {
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
  /*Register */
  const handleRegister = async (values: typeof formRegister.values) => {
    setLoading(true);
    setError(null);

    try {
      const { data, error } = await supabase.auth.signUp({
        email: values.email,
        password: values.password,
      });

      if (error) throw error;

      navigate("/"); // hoặc chuyển hướng tới trang xác nhận
    } catch (err: any) {
      showNotification({
        title: "Register for failure",
        message: err.message || "Please try again",
        color: "red",
      });
    } finally {
      setLoading(false);
    }

    setLoading(false);
  };
  return (
    <div className={isActive ? "container-w active" : "container-w"}>
      <div className="form-box-login">
        <div className="form-section register-section">
          <div id="form">
            <Center>
              <h3>Register Here</h3>
            </Center>
            <Center>
              <span id="span">This web helps you manage your money effectively</span>
            </Center>
            <Form
              id="register-form"
              onSubmit={formRegister.onSubmit(handleRegister)}
              className="form-register-container"
            >
              <div id="register-input">
                <TextInput
                  id="email-login input"
                  size="lg"
                  radius="md"
                  styles={{
                    input: {
                      width: "40vh",
                      marginBottom: "20px",
                    },
                  }}
                  type="email"
                  placeholder="Email"
                  {...formRegister.getInputProps("email")}
                />

                <PasswordInput
                  id="password-login input"
                  size="lg"
                  radius="md"
                  styles={{
                    input: {
                      width: "40vh",
                      marginBottom: "20px",
                    },
                  }}
                  type="password"
                  placeholder="Password"
                  {...formRegister.getInputProps("password")}
                />

                <PasswordInput
                  id="confirm-password-login input"
                  size="lg"
                  radius="md"
                  styles={{
                    input: {
                      width: "40vh",
                      marginBottom: "20px",
                    },
                  }}
                  type="password"
                  placeholder="Re-enter Password"
                  {...formRegister.getInputProps("confirmPassword")} // Lưu trực tiếp mật khẩu
                />
              </div>
              <Button
                id="register-button-form"
                variant="outline"
                type="submit"
                disabled={loading}
                styles={{
                  root: {
                    borderRadius: "20px",
                    backgroundColor: "#35A7B9", // Màu nền input
                    height: "40px",
                    width: "150px",
                    marginBottom: "20px",
                    color: "white",
                    marginLeft: "28%",
                    fontFamily: "Afaria, sans-serif",
                  },
                }}
              >
                {loading ? <Loader size="xs" /> : "Register"}{" "}
              </Button>
            </Form>
          </div>
        </div>

        <div className="form-section login-section">
          <div id="form">
            <Center>
              <h3>Login Here</h3>
            </Center>
            <Center>
              <span id="span">
                This web helps you manage your money effectively
              </span>
            </Center>
            <Form
              id="login-form"
              onSubmit={formLogin.onSubmit(handleLogin)}
              className="form-login-container"
            >
              <div id="login-input">
                <TextInput
                  id="email-login input"
                  size="lg"
                  radius="md"
                  styles={{
                    input: {
                      width: "40vh",
                      marginBottom: "20px",
                    },
                  }}
                  type="email"
                  placeholder="Email"
                  {...formLogin.getInputProps("email")}
                />

                <PasswordInput
                  id="password-login input"
                  size="lg"
                  radius="md"
                  styles={{
                    input: {
                      width: "40vh",
                      marginBottom: "20px",
                    },
                  }}
                  visible={visible}
                  onVisibilityChange={toggle}
                  type="password"
                  placeholder="Password"
                  {...formLogin.getInputProps("password")}
                />
              </div>
              <Button
                id="login-button-form"
                variant="outline"
                type="submit"
                disabled={loading}
                styles={{
                  root: {
                    borderRadius: "20px",
                    backgroundColor: "#35A7B9", // Màu nền input
                    height: "40px",
                    width: "150px",
                    marginBottom: "20px",
                    color: "white",
                    marginLeft: "28%",
                    fontFamily: "Afaria, sans-serif",
                  },
                }}
              >
                {loading ? <Loader size="xs" /> : "Login"}{" "}
              </Button>
              <div id="or">
                <span>OR</span>
              </div>
              <Button
                id="google-button"
                variant="outline"
                onClick={handleGoogleLogin}
                styles={{
                  root: {
                    borderRadius: "20px",
                    backgroundColor: "white",
                    color: "#333",
                    border: "1px solid #ccc",
                    height: "40px",
                    width: "250px",
                    marginLeft: "12%",
                    fontFamily: "Afaria, sans-serif",
                  },
                }}
              >
                <Image
                  src="/Google.png"
                  alt="google"
                  width={20}
                  height={20}
                  style={{
                    marginRight: "10px",
                    width: "20px",
                    height: "20px",
                  }}
                />
                Log in with Google
              </Button>
            </Form>
          </div>
        </div>

        <div className="toggle-box">
          <div className="toggle-panel toggle-left">
            <h1>Welcome Back!</h1>
            <p>Don't have an account?</p>
            <button
              className="btn register-btn"
              onClick={() => {
                setError(null);
                setIsActive(true);
              }}
            >
              Register{" "}
            </button>
          </div>

          <div className="toggle-panel toggle-right">
            <h1>Hello, Friend!</h1>
            <p>Already have an account?</p>
            <button
              className="btn login-btn"
              onClick={() => {
                setError(null);
                setIsActive(false);
              }}
            >
              {" "}
              Login
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
export default Login;

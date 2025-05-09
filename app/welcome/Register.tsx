import { useState } from "react";
import { supabase } from "../supabase";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import { useDisclosure } from "@mantine/hooks";
import { PasswordInput, Stack, TextInput, Button, Loader } from "@mantine/core";
import { useForm } from "@mantine/form";
import { showNotification } from "@mantine/notifications";

const Register: React.FC = () => {
  if (typeof window === "undefined") return null;
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [visible, { toggle }] = useDisclosure(false);
  if (typeof window === "undefined") return null;

  const form = useForm({
    initialValues: {
      data: {
        user_name: "",
      },
      email: "",
      password: "",
      confirmPassword: "",
    },
    validate: {
      data: {
        user_name: (value) =>
          value.length >= 3 ? null : "Username at least 3 characters",
      },
      email: (value) =>
        /^\S+@\S+\.\S+$/.test(value) ? null : "Invalid email",
      password: (value) =>
        value.length >= 8 ? null : "Password at least 8 characters",
      confirmPassword: (value, values) =>
        value === values.password ? null : "The password is not matched",
    },
  });

  const handleRegister = async (values: typeof form.values) => {
    setLoading(true);
    setError(null);
  
    try {
      const { data, error } = await supabase.auth.signUp({
        email: values.email,
        password: values.password,
        options: {
          data: {
            user_name: values.data.user_name,
          },
        },
      });
  
      if (error) throw error;
  
      // showNotification({
      //   title: "Đăng ký thành công",
      //   message: "Kiểm tra email để xác nhận đăng ký",
      //   color: "teal",
      // });
      navigate("/"); // hoặc chuyển hướng tới trang xác nhận
    } catch (err: any) {
      showNotification({
        title: "Register for failure",
        message: err.message || "Please try again",
        color: "red",
      });
    }
  
    setLoading(false);
  };
  
  return (
    <div className="design-background">
      <div className="input-design-container">
        <div className="form-container">
          <div className="logo-container">
            <img
              src="https://cdn.builder.io/api/v1/image/assets/TEMP/3ce0e01ab67abecd3773c55952bbd06d95e19da1"
              alt="My Money Logo"
              className="logo-image"
            />
          </div>
          <form
            onSubmit={form.onSubmit(handleRegister)}
            className="form-register-container"
          >
            <Stack style={{ width: "310px", height: "250px" }}>
              <TextInput
                placeholder="Username"
                {...form.getInputProps("data.user_name")}
                styles={{
                  input: {
                    borderRadius: "20px",
                    backgroundColor: "#D9D9D9A6", // Màu nền input
                    height: "42px",
                    width: "310px",
                    marginLeft: "0px",
                  },
                }}
              />
              <TextInput
                placeholder="Email"
                {...form.getInputProps("email")}
                styles={{
                  input: {
                    borderRadius: "20px",
                    backgroundColor: "#D9D9D9A6", // Màu nền input
                    height: "42px",
                    width: "310px",
                    marginLeft: "0px",
                  },
                }}
              />
              <PasswordInput
                placeholder="Password"
                visible={visible}
                onVisibilityChange={toggle}
                {...form.getInputProps("password")}
                styles={{
                  input: {
                    borderRadius: "20px",
                    backgroundColor: "#D9D9D9A6", // Màu nền input
                    height: "42px",
                    width: "310px",
                  },
                }}
              />
              <PasswordInput
                placeholder="Re-enter Password"
                visible={visible}
                onVisibilityChange={toggle}
                {...form.getInputProps("confirmPassword")}
                styles={{
                  input: {
                    borderRadius: "20px",
                    backgroundColor: "#D9D9D9A6", // Màu nền input
                    height: "42px",
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
                  // marginTop: "15px",
                },
              }}
            >
              {loading ? <Loader size="xs" /> : "Register"}
            </Button>
            <div className="login-link-container">
              <span className="login-text">
                Already have account? <Link to="/login">Login</Link>
              </span>
            </div>
          </form>
        </div>
        <div className="image-section1">
          <div className="image-container1">
            <img src="/public/img1.png" alt="img1" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;

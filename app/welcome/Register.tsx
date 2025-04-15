
import { useState } from "react";
import { supabase } from "../supabase";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import { useDisclosure } from "@mantine/hooks";
import { PasswordInput, Stack, TextInput, Button, Loader } from "@mantine/core";
import { useForm } from "@mantine/form";

const Register: React.FC = () => {
  if (typeof window === "undefined") return null;
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [visible, { toggle }] = useDisclosure(false);
    if (typeof window === "undefined") return null;
    


  const form = useForm({
    initialValues: {
      email: "",
      password: "",
      confirmPassword: "",
    },
    validate: {
      email: (value) =>
        /^\S+@\S+\.\S+$/.test(value) ? null : "Email không hợp lệ",
      password: (value) =>
        value.length >= 8 ? null : "Mật khẩu ít nhất 8 ký tự",
      confirmPassword: (value, values) =>
        value === values.password ? null : "Mật khẩu nhập lại không khớp",
    },
  });

  const handleRegister = async (values: typeof form.values) => {
    setLoading(true);
    setError(null);

    try {
      const { data,error } = await supabase.auth.signUp(
        {
          email: values.email,
          password: values.password, // Lưu trực tiếp mật khẩu
        },
      );

      if (error) throw error;

      // Nếu đăng ký thành công, lưu thông tin vào bảng users
      const { error: insertError } = await supabase.from("users").insert([
        {
          id_user: data.user?.id, // Lưu ID của user từ Auth
          email: values.email,
          password: values.password,
        },
      ]);

      if (insertError) throw insertError;

      navigate("/");
    } catch (err: any) {
      setError(err.message || "Đăng ký thất bại. Vui lòng thử lại.");
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
            <Stack
            style={{ width: "310px",height: "250px", }}>
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
                    marginTop: "16px",
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

"use client";

import React, { useState } from "react";
import {
  Box,
  Button,
  Center,
  Image,
  Loader,
  PasswordInput,
  Text,
  TextInput,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { showNotification } from "@mantine/notifications";
import classes from "./Login.module.css";
import { Form } from "react-router-dom";
import { registerWithEmail, loginWithGoogle } from "./authService";
import { useNavigate } from "react-router-dom";

export const RegisterForm: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const form = useForm({
    initialValues: {
      user_name: "",
      email: "",
      password: "",
      confirmPassword: "",
    },

    validate: {
      user_name: (value) =>
        value.trim().length > 0 ? null : "Name is required",
      email: (value) => (/^\S+@\S+\.\S+$/.test(value) ? null : "Invalid email"),
      password: (value) =>
        value.length >= 8 ? null : "Password must be at least 8 characters",
      confirmPassword: (value, values) =>
        value === values.password ? null : "Passwords do not match",
    },
  });

  const handleRegister = async (values: typeof form.values) => {
    setLoading(true);

    try {
      const user = await registerWithEmail(
        values.user_name,
        values.email,
        values.password
      );

      if (!user) {
        throw new Error("No user.");
      }

      console.log(" Registered user:", user);

      showNotification({
        title: "Registered successfully",
        message: "Please check your email to confirm your account",
        color: "teal",
      });

      navigate("/");
    } catch (err: any) {
      console.error("Register error:", err);
      let emailError = "Đã xảy ra lỗi không xác định.";

      // Kiểm tra lỗi cụ thể từ Supabase
      if (err.message.includes("User already registered")) {
        emailError = "The account has existed. Please login!";
      } else if (err.message.includes("Unable to validate email address")) {
        emailError = "Invalid email.";
      } else {
        emailError = err.message || emailError;
      }

      // Hiển thị lỗi ngay trên form cho trường email
      form.setErrors({ email: emailError });

      // Hiển thị thêm notification để người dùng dễ chú ý
      showNotification({
        title: "Register failed",
        message: emailError,
        color: "red",
      });
    } finally {
      setLoading(false);
    }
  };
  const handleGoogleLogin = async () => {
    try {
      await loginWithGoogle();
    } catch (err: any) {
      showNotification({
        title: "Google login failed",
        message: err.message || "An error occurred",
        color: "red",
      });
    }
  };

  return (
    <Box className={classes.form}>
      <Center>
        <Box component="h3">Register Here</Box>
      </Center>
      <Center>
        <Text span className={classes.span}>
          This web helps you manage your money effectively
        </Text>
      </Center>

      <Form
        onSubmit={form.onSubmit(handleRegister)}
        className={classes.registerForm + " " + classes.formRegisterContainer}
      >
        <Box className={classes.registerInput}>
          <TextInput
            className={`${classes.input} ${classes.nameLogin}`}
            classNames={{
              root: classes.inputRoot,
              input: classes.inputInput,
              label: classes.inputLabel,
              wrapper: classes.inputWrapper,
            }}
            placeholder="Name"
            {...form.getInputProps("user_name")}
          />

          <TextInput
            className={`${classes.input} ${classes.emailLogin}`}
            classNames={{
              root: classes.inputRoot,
              input: classes.inputInput,
              label: classes.inputLabel,
              wrapper: classes.inputWrapper,
            }}
            type="email"
            placeholder="Email"
            {...form.getInputProps("email")}
          />

          <PasswordInput
            className={`${classes.input} ${classes.passwordLogin}`}
            classNames={{
              root: classes.inputRoot,
              input: classes.inputInput,
              label: classes.inputLabel,
              wrapper: classes.inputWrapper,
            }}
            placeholder="Password"
            {...form.getInputProps("password")}
          />

          <PasswordInput
            className={`${classes.input} ${classes.confirmPasswordLogin}`}
            classNames={{
              root: classes.inputRoot,
              input: classes.inputInput,
              label: classes.inputLabel,
              wrapper: classes.inputWrapper,
            }}
            placeholder="Re-enter Password"
            {...form.getInputProps("confirmPassword")}
          />
        </Box>

        <Center className={classes.centerButton}>
          <Button
            variant="transparent"
            type="submit"
            disabled={loading}
            className={classes.registerButtonForm}
            classNames={{
              root: classes.loginButtonRoot,
              label: classes.loginButtonLabel,
              inner: classes.loginButtonInner,
            }}
          >
            {loading ? <Loader size="xs" /> : "Register"}
          </Button>

          <Box className={classes.or}>
            <Text span>OR</Text>
          </Box>

          <Button
            variant="transparent"
            onClick={handleGoogleLogin}
            className={classes.googleButton}
            classNames={{ root: classes.googleButtonRoot }}
            leftSection={<Image src="/Google.png" alt="google" w={20} h={20} />}
          >
            Log in with Google
          </Button>
        </Center>
      </Form>
    </Box>
  );
};

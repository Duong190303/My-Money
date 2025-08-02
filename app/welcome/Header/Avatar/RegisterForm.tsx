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
import classes from "./Login.module.css"; // Đổi tên phù hợp nếu cần
import { Form } from "react-router-dom"; // ← dùng react-router
import { registerWithEmail, loginWithGoogle } from "./authService"; // chỉnh path tùy theo dự án

export const RegisterForm: React.FC = () => {
  const [loading, setLoading] = useState(false);

  const formRegister = useForm({
    initialValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    },

    validate: {
      email: (value) => (/^\S+@\S+\.\S+$/.test(value) ? null : "Invalid email"),
      password: (value) =>
        value.length >= 8 ? null : "Password must be at least 8 characters",
      confirmPassword: (value, values) =>
        value === values.password ? null : "Passwords do not match",
    },
  });

  const handleRegister = async (values: typeof formRegister.values) => {
    setLoading(true);
    try {
      await registerWithEmail(values.email, values.password);
      showNotification({
        title: "Registered successfully",
        message: "Please check your email to confirm your account",
        color: "teal",
      });
    } catch (err: any) {
      showNotification({
        title: "Register failed",
        message: err.message || "An error occurred",
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
    // <Box className={`${classes.formSection} ${classes.registerSection}`}>
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
        onSubmit={formRegister.onSubmit(handleRegister)}
        className={classes.registerForm + " " + classes.formRegisterContainer}
      >
        <Box className={classes.registerInput}>
          <TextInput
            className={`${classes.input} ${classes.emailLogin} ${classes.nameLogin}`}
            classNames={{
              root: classes.inputRoot,
              input: classes.inputInput,
              label: classes.inputLabel,
              wrapper: classes.inputWrapper,
            }}
            placeholder="Name"
            {...formRegister.getInputProps("name")}
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
            {...formRegister.getInputProps("email")}
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
            {...formRegister.getInputProps("password")}
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
            {...formRegister.getInputProps("confirmPassword")}
          />
        </Box>

        <Button
          variant="transparent"
          type="submit"
          disabled={loading}
          className={classes.registerButtonForm}
          classNames={{ root: classes.loginButtonRoot }}
        >
          {loading ? <Loader size="xs" /> : "Register"}
        </Button>

        <Box className={classes.or}>
          <Text span>OR</Text>
        </Box>

        <Button
          variant="transparent"
          fullWidth
          onClick={handleGoogleLogin}
          className={classes.googleButton}
          classNames={{ root: classes.googleButtonRoot }}
          leftSection={<Image src="/Google.png" alt="google" w={20} h={20} />}
        >
          Log in with Google
        </Button>
      </Form>
    </Box>
    // </Box>
  );
};

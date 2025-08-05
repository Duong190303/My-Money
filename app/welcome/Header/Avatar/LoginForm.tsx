"use client";

import React, { useState } from "react";
import {
  Button,
  Center,
  TextInput,
  PasswordInput,
  Box,
  Text,
  Loader,
  Image,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { showNotification } from "@mantine/notifications";
import { loginWithEmail, loginWithGoogle } from "./authService"; // tùy path dự án
import classes from "./Login.module.css";
import { useNavigate } from "react-router-dom";
export const LoginForm: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [visible, setVisible] = useState(false);
  const navigate = useNavigate();
  const toggle = () => setVisible((v) => !v);

  const formLogin = useForm({
    initialValues: {
      email: "",
      password: "",
    },
    validate: {
      email: (value) => (/^\S+@\S+\.\S+$/.test(value) ? null : "Invalid email"),
      password: (value) =>
        value.length >= 8 ? null : "Password must be at least 8 characters",
    },
  });

  const handleLogin = async (values: typeof formLogin.values) => {
    setLoading(true);
    try {
      await loginWithEmail(values.email, values.password);
      showNotification({
        title: "Login successful",
        message: "Welcome back!",
        color: "teal",
      });

      navigate("/");
    } catch (err: any) {
      formLogin.setErrors({
        email: "Account or password incorrect.",
        password: "Account or password incorrect.",
      });

      // showNotification({
      //   title: "Login failed",
      //   message: err.message || "Wrong email or password",
      //   color: "red",
      // });
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
        <Box component={"h3"}>Login Here</Box>
      </Center>
      <Text span className={classes.span}>
        This web helps you manage your money effectively
      </Text>
      <Box
        component="form"
        onSubmit={formLogin.onSubmit(handleLogin)}
        className={classes.loginForm + " " + classes.formLoginContainer}
      >
        <Box className={classes.loginInput} w={"100%"} h={"100%"}>
          <TextInput
            className={`${classes.input} ${classes.emailLogin} ${classes.nameLogin}`}
            classNames={{
              root: classes.inputRoot,
              input: classes.inputInput,
              label: classes.inputLabel,
              wrapper: classes.inputWrapper,
            }}
            type="email"
            placeholder="Email"
            {...formLogin.getInputProps("email")}
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
            visible={visible}
            onVisibilityChange={toggle}
            {...formLogin.getInputProps("password")}
          />
        </Box>

        <Center className={classes.centerButton}>
          <Button
            className={classes.loginButtonForm}
            fullWidth
            classNames={{
              root: classes.loginButtonRoot,
              label: classes.loginButtonLabel,
              inner: classes.loginButtonInner,
            }}
            variant="transparent"
            type="submit"
            disabled={loading}
          >
            {loading ? <Loader size="xs" /> : "Login"}
          </Button>

          <Box className={classes.or}>
            <Text span>OR</Text>
          </Box>

          <Button
            className={classes.googleButton}
            classNames={{ root: classes.googleButtonRoot }}
            variant="outline"
            onClick={handleGoogleLogin}
            leftSection={<Image src="/Google.png" alt="google" w={20} h={20} />}
          >
            Log in with Google
          </Button>
        </Center>
      </Box>
    </Box>
    // </Box>
  );
};

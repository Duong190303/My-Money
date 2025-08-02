import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDisclosure } from "@mantine/hooks";
import { Button, Text, Box } from "@mantine/core";
import classes from "./Login.module.css";
import { RegisterForm } from "./RegisterForm";
import { LoginForm } from "./LoginForm";

export function Login() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [visible, { toggle }] = useDisclosure(false);
  if (typeof window === "undefined") return null;
  const navigate = useNavigate();
  const [isActive, setIsActive] = useState(false);

  return (
    <Box className={`${classes.containerW} ${isActive ? classes.active : ""}`}>
      <Box className={classes.formBoxLogin}>
        <Box className={classes.formsWrapper}>
          <Box className={classes.formSection}>
            <RegisterForm />
          </Box>
          <Box className={classes.formSection}>
            <LoginForm />
          </Box>
        </Box>
        <Box className={classes.toggleBox}>
          <Box className={classes.togglePanel + " " + classes.toggleLeft}>
            <Box component={"h1"}>Welcome Back!</Box>
            <Text component={"p"}>Don't have an account?</Text>
            <Button
              className={classes.btn + " " + classes.registerBtn}
              onClick={() => {
                setError(null);
                setIsActive(true);
              }}
            >
              Register{" "}
            </Button>
          </Box>

          <Box className={classes.togglePanel + " " + classes.toggleRight}>
            <Box component={"h1"}>Hello, Friend!</Box>
            <Box component={"p"}>Already have an account?</Box>
            <Button
              className={classes.btn + " " + classes.loginBtn}
              onClick={() => {
                setError(null);
                setIsActive(false);
              }}
            >
              {" "}
              Login
            </Button>
          </Box>
        </Box>
      </Box>
    </Box>
  );
}
export default Login;

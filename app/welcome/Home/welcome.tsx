import { Button, Group, Box, Text } from "@mantine/core";
import { useEffect } from "react";
import { useState } from "react";
import { supabase } from "../../supabase";
import { HeaderPage } from "../Header/HeaderPage";
import classes from "./home.module.css";

export function Home() {
  if (typeof window === "undefined") return null;
  const [userId, setUserId] = useState<string | null>(null);
  useEffect(() => {
    async function getCurrentUser() {
      const {
        data: { user },
        error,
      } = await supabase.auth.getUser();
      if (error) {
        console.error("No User:", error.message);
      } else if (user) {
        setUserId(user.id);
        console.log("User ID:", user.id);
      }
    }

    getCurrentUser();
  }, []);
  return (
    <Box className="home-background">
      <HeaderPage />

      <Box className={classes.homeContainer}>
        <Box component="h1" className={classes.TittleH1}>
          <Box className={classes.TittleH1Text}>
            <Text c={"#87D7ED"} span fw={800} className={classes.titleText}>
              MANAGE{" "}
            </Text>
            <Text c={"white"} span fw={800} className={classes.titleText}>
              YOUR MONEY{" "}
            </Text>
          </Box>
          <Box className={classes.TittleH1Text}>
            <Text span c={"#87D7ED"} fw={800} className={classes.titleText}>
              {" "}
              MASTER{" "}
            </Text>{" "}
            <Text span c={"white"} fw={800} className={classes.titleText}>
              {" "}
              YOUR LIFE
            </Text>
          </Box>
          <Box
            component="h6"
            className={`${classes.TittleH6} ${classes.title}`}
          >
            <Text>
              Managing your finances can be overwhelming, but with my money, you
              can easily 
            </Text>
            <Text>
             track your income, monitor your expenses, and build better financial habits.{" "}
            </Text>
          </Box>
          {!userId && (
            <Button
              className={classes.btnWithMymoney}
              onClick={() => (window.location.href = "/login")}
            >
              Start with MyMoney
            </Button>
          )}
        </Box>
        <img className={classes.coinBg} src="/icon.gif" alt="coin" />
      </Box>
    </Box>
  );
}

"use client";
import React from "react";
import { Button, Group, Box } from "@mantine/core";
import { supabase } from "../../supabase";
import { useState, useEffect } from "react";
import { showNotification } from "@mantine/notifications";
import { useNavigate } from "react-router-dom";
import classes from "./Header.module.css";

export const Menu: React.FC = () => {
  const navigate = useNavigate();
  const [userId, setUserId] = useState<string | null>(null);
  useEffect(() => {
    async function getCurrentUser() {
      const {
        data: { user },
        error,
      } = await supabase.auth.getUser();
      if (error) {
        console.error("No User!", error.message);
      } else if (user) {
        setUserId(user.id);
      }
    }
    getCurrentUser();
  });
  const handleNotifications = (route: string, message: string) => {
    if (userId) {
      navigate(route);
    } else {
      showNotification({
        title: "Not logged in",
        message,
        color: "red",
      });
    }
  };
  const handleIncome = () =>
    handleNotifications("/income", "Please login to access Income");
  const handleDataReport = () =>
    handleNotifications("/datareport", "Please login to access Data Report");
  const handleExpenses = () =>
    handleNotifications("/expenses", "Please login to access Expenses");
  return (
    <Box className={classes.homeNavigation}>
      <Button
        className={classes.homeNavItem}
        variant="transparent"
        onClick={() => navigate("/")}
      >
        home
      </Button>
      <Button
        className={classes.homeNavItem}
        variant="transparent"
        // onClick={handleIncome}
        onClick={() => navigate("/income")}
      >
        income
      </Button>
      <Button
        className={classes.homeNavItem}
        variant="transparent"
        // onClick={handleExpenses}
        onClick={() => navigate("/expenses")}
      >
        expenses
      </Button>
      <Button
        className={classes.homeNavItem}
        variant="transparent"
        // onClick={handleDataReport}
        onClick={() => navigate("/datareport")}
      >
        data report
      </Button>
    </Box>
  );
};

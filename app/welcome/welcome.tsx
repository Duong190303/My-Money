import { Button, Group } from "@mantine/core";
import { Header } from "./Header";
import { useEffect } from "react";
import { useState } from "react";
import { supabase } from "../supabase";

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
    <div className="home-background">
      <Header />
      <Group p="center">
        <div className="Tittle-01 title">
          {" "}
          <h1>
            <span>MANAGE </span> YOUR MONEY
            <br />
            <span> MASTER </span> YOUR LIFE
          </h1>{" "}
        </div>
        <div className="Tittle-02 title">
          <h6>
            Managing your finances can be overwhelming, but with my money, you
            can easily track your
            <br /> income, monitor your expenses, and build better financial
            habits{" "}
          </h6>
        </div>
        {!userId && (
          <Button
            id="btn-with-mymoney"
            onClick={() => (window.location.href = "/login")}
          >
            Start with MyMoney
          </Button>
        )}

          <img className="coin-bg"
            src="/icon.gif"
            alt="coin"
          />
      </Group>
    </div>
        

  );
}

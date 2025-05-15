import { Button, Group } from "@mantine/core";
import { Header } from "./Header";
import { useEffect } from "react";
import { useState } from "react";
import { supabase } from "../supabase";
import { Container, Stack, Title, Text, Image } from "@mantine/core";

export function Home() {
  const [userId, setUserId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
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
  if (typeof window === "undefined") return null;
  return (
    // <div className="home-background">
    //   <Header />
    //   <Group p="center">
    //     <div className="Tittle-01 title">
    //       {" "}
    //       <h1>
    //         <span>MANAGE </span> YOUR MONEY
    //         <br />
    //         <span> MASTER </span> YOUR LIFE
    //       </h1>{" "}
    //     </div>
    //     <div className="Tittle-02 title">
    //       <h6>
    //         Managing your finances can be overwhelming, but with my money, you
    //         can easily track your
    //         <br /> income, monitor your expenses, and build better financial
    //         habits{" "}
    //       </h6>
    //     </div>
    //     {!userId && (
    //       <Button
    //         id="btn-with-mymoney"
    //         onClick={() => (window.location.href = "/login")}
    //       >
    //         Start with MyMoney
    //       </Button>
    //     )}

    //       <img className="coin-bg"
    //         src="/shiny-coins-loop.gif"
    //         alt="coin"
    //       />
    //   </Group>
    // </div>
        <div className="home-background">
      <Header />

      <Container size="md" py="xl">
        <Stack align="center" >
          {/* Tiêu đề lớn */}
          <Title order={1} ta="center" className="text-gradient" fw={700}>
            <span>MANAGE </span> YOUR MONEY
            <br />
            <span> MASTER </span> YOUR LIFE
          </Title>

          {/* Đoạn mô tả */}
          <Text ta="center" size="md" c="dimmed">
            Managing your finances can be overwhelming, but with MyMoney, you can easily track your
            income, monitor your expenses, and build better financial habits.
          </Text>

          {/* Nút login */}
          {!userId && (
            <Button
              id="btn-with-mymoney"
              onClick={() => (window.location.href = "/login")}
              size="md"
              mt="md"
            >
              Start with MyMoney
            </Button>
          )}

          {/* Hình ảnh động */}
          <Image
            src="/shiny-coins-loop.gif"
            alt="coin"
            className="coin-bg"
            maw={300}
            mx="auto"
            mt="xl"
          />
        </Stack>
      </Container>
    </div>

  );
}

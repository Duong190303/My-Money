import type { Route } from "./+types/home";
import { Home as Welcome } from "../welcome/welcome"; // Rename the imported component to Welcome
import { MantineProvider } from "@mantine/core";
import React from "react";
import { Notifications } from "@mantine/notifications";


export default function Home() {
  return (
    <React.StrictMode>
      <MantineProvider>
        <Welcome />
      </MantineProvider>
    </React.StrictMode>
  );
}

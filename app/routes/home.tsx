import { Home as Welcome } from "../welcome/Home/welcome"; // Rename the imported component to Welcome
import React from "react";
import { Notifications } from '@mantine/notifications';
import { MantineProvider } from "@mantine/core";

export default function Home() {
  return (
    <React.StrictMode>
    <MantineProvider>
      <Notifications />
      <Welcome />      
    </MantineProvider>
    </React.StrictMode>
  );
}

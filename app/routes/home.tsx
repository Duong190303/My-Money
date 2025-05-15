import { Home as Welcome } from "../welcome/welcome"; // Rename the imported component to Welcome
import React from "react";
import { Notifications } from '@mantine/notifications';
import { MantineProvider } from "@mantine/core";

export default function Home() {
  return (
    <React.StrictMode>
    <MantineProvider>
      <Welcome />
    </MantineProvider>
    </React.StrictMode>
  );
}

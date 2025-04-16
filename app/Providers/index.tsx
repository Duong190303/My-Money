import { MantineProvider } from "@mantine/core";
import type { PropsWithChildren } from "react";
import '@mantine/core/styles.css';
import { Notifications } from "@mantine/notifications";

export const Providers: React.FC<PropsWithChildren> = ({children}) => {
  return <MantineProvider>{children}</MantineProvider>;
};

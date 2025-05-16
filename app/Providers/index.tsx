import { MantineProvider } from "@mantine/core";
import type { PropsWithChildren } from "react";
import '@mantine/core/styles.css';
// import '@mantine/notifications/styles.css';
import '@mantine/dates/styles.css';
import '@mantine/charts/styles.css';


export const Providers: React.FC<PropsWithChildren> = ({children}) => {
  return <MantineProvider>{children}</MantineProvider>;
};

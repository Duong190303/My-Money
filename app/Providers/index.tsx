import { MantineProvider } from "@mantine/core";
import type { PropsWithChildren } from "react";
import '@mantine/core/styles.css';

export const Providers: React.FC<PropsWithChildren> = ({children}) => {
  return <MantineProvider>{children}</MantineProvider>;
};

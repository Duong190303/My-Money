import { Menu } from "./Menu";
import { Logo } from "./Logo";
import { AvatarUser } from "./Avatar/AvatarUser";
import { Box, Center } from "@mantine/core";
import classes from "./Header.module.css";

export function HeaderPage() {
  if (typeof window === "undefined") return null;

  return (
    <Box className={classes.headerBackground}>
      <Box className={classes.homeHeaderContainer}>
        <Logo />
        <Box visibleFrom="md" className={classes.headerMenu}>
          <Menu />
        </Box>

        <AvatarUser />
      </Box>
    </Box>
  );
}

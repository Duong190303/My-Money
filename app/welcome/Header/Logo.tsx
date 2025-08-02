"use client";
import React from "react";
import { Image } from "@mantine/core";
import classes from "./Header.module.css";
export const Logo: React.FC = () => {
  return (
    <>
      <Image
        src="https://cdn.builder.io/api/v1/image/assets/TEMP/18083109a25a67b4d19a5291268bdd2c91ef258e"
        className={classes.homelogo}
        alt="My Money"
        fit="cover"
        w={"100%"}
        h={"100%"}
      />
    </>
  );
};

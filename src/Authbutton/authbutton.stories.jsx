import React from "react";
import { PSAAuthButton } from "./authButton";
import { Button, Typography } from "@mui/material";

const meta = {
  component: PSAAuthButton,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
  },
};

export default meta;

export const DefaultAuthButton = {
  args: {},
};

export const CustomAuthButton = {
  args: {
    buttonSx: {
      height: "100px",
      backgroundColor: "main.accent1",
    },
    textSx: {
      fontSize: "2rem",
    },
  },
};

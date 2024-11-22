import React from "react";
import { PSAAuthButton } from "./authbutton";

const meta = {
  title: "Inputs/AuthButton",
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

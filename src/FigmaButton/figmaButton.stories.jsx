import React from "react";
import { PSAFigmaButton } from "./figmaButton";
import { Button, Typography } from "@mui/material";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import PersonIcon from "@mui/icons-material/Person";
import LocalFloristIcon from "@mui/icons-material/LocalFlorist";

const meta = {
  component: PSAFigmaButton,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
  },
  argTypes: {
    variant: {
      control: "select",
      options: ["standard", "color", "text"],
    },
  },
};

export default meta;

export const StandardButton = {
  args: {
    variant: "standard",
    text: "12345",
    icon: <ArrowForwardIcon />,
    rightIcon: true,
    leftIcon: true,
  },
};

export const ColorButton = {
  args: {
    variant: "color",
    text: "LOGIN",
    icon: <PersonIcon />,
    rightIcon: true,
    leftIcon: false,
  },
};

export const TextButton = {
  args: {
    variant: "text",
    text: "Text Button",
    icon: <LocalFloristIcon />,
    rightIcon: true,
    leftIcon: false,
  },
};

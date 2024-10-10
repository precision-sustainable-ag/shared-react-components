import React from "react";
import { PSAFigmaButton } from "./figmaButton";
import { Button, Typography } from "@mui/material";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";

const meta = {
  component: PSAFigmaButton,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
  },
};

export default meta;

export const DefaultFigmaButton = {
  args: {
    text: "12345",
    icon: <ArrowForwardIcon />,
    rightIcon: true,
    leftIcon: true,
  },
};

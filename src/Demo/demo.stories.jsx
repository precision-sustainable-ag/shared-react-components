import React from "react";
import { PSADemo } from "./demo"; 
import { Button, Typography } from "@mui/material";

const meta = {
  component: PSADemo,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
  },
};

export default meta;

export const DefaultDemo = { 
  args: {
    message: "This is an alert component!",
  },
};
import React from "react";
import { PSAHeader } from "./header"; 
import { Button, Typography } from "@mui/material";

const meta = {
  component: PSAHeader,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
  },
};

export default meta;

export const DefaultHeader = { 
  args: {
    message: "This is an alert component!",
  },
};
import React from "react";
import { PSAHeader } from "./header";
import { Button, Typography } from "@mui/material";

const meta = {
  component: PSAHeader,
  tags: ["autodocs"],
  parameters: {
    layout: "fullscreen",
  },
};

export default meta;

export const DefaultHeader = {
  args: {
    title: "Seeding Rate Calculator",
    subtitle: "A PSI Extension Calculator",
    county: "",
  },
};

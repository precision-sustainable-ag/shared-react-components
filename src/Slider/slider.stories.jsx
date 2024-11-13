import React from "react";
import { PSASlider } from "./slider";

const meta = {
  component: PSASlider,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
  },
};

export default meta;

export const DefaultSlider = {
  args: {
    min: 0,
    max: 100,
    step: 1,
    width: "300px",
    valueLabelDisplay: "auto",
    value: 30,
  },
};

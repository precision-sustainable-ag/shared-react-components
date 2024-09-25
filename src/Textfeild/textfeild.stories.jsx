import React from "react";
import { PSATextField } from "./textfeild";

const meta = {
  component: PSATextField,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
  },
};

export default meta;

export const DefaultTextField = {
  args: {
    style: {},
    placeholder: "Enter text here...",
    multiline: false,
    variant: "outlined",
    fullWidth: true,
    minRows: 1,
    onChange: (e) => console.log(e.target.value), // Example onChange function
    autoFocus: false,
    error: false,
    value: "",
    InputProps: {},
    color: "primary",
    label: "Sample Label",
    onChangeCapture: (e) => console.log("Change captured:", e.target.value),
  },
};

export const MultilineTextField = {
  args: {
    style: {},
    placeholder: "Enter multiline text...",
    multiline: true,
    variant: "outlined",
    fullWidth: true,
    minRows: 3,
    onChange: (e) => console.log(e.target.value),
    autoFocus: false,
    error: false,
    value: "",
    InputProps: {},
    color: "primary",
    label: "Multiline Label",
    onChangeCapture: (e) => console.log("Change captured:", e.target.value),
  },
};

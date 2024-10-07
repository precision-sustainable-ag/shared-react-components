import React from "react";
import { PSATextField } from "./textfield";

const meta = {
  component: PSATextField,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component: `This is a custom TextField component based on MUI's \`TextField\`. 
        It Inherits all [MUI TextField props](https://mui.com/material-ui/api/text-field/) 
        and can be styled as needed.`,
      },
    },
  },
};

export default meta;

export const DefaultTextField = {
  render: () => (
    <PSATextField
      placeholder="Enter text here..."
      variant="outlined"
      fullWidth
      minRows={1}
      onChange={(e) => console.log(e.target.value)}
      value=""
      color="primary"
      label="Sample Label"
      onChangeCapture={(e) => console.log("Change captured=", e.target.value)}
    />
  ),
};

export const MultilineTextField = {
  render: () => (
    <PSATextField
      placeholder="Enter multiline text..."
      multiline
      variant="outlined"
      fullWidth
      minRows={3}
      onChange={(e) => console.log(e.target.value)}
      autoFocus
      value=""
      color="primary"
      label="Multiline Label"
      onChangeCapture={(e) => console.log("Change captured:", e.target.value)}
    />
  ),
};

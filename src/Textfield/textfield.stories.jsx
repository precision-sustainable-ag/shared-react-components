import React, { useState } from "react";
import { PSATextField } from "./textfield";

const meta = {
  title: "Inputs/TextField",
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

const Template = (args) => {
  const [text, setText] = useState("");

  return (
    <PSATextField
      placeholder="Enter text here..."
      variant="outlined"
      fullWidth
      minRows={1}
      onChange={(e) => setText(e.target.value)}
      value={text}
      label="Sample Label"
      {...args}
    />
  );
};

export const DisabledTextField = Template.bind({});
DisabledTextField.args = {
  value: 'Disabled text',
  disabled: true,
};

export const DefaultTextField = Template.bind({});

export const ErrorTextField = Template.bind({});
ErrorTextField.args = {
  error: true,
};

export const FocusedTextField = Template.bind({});
FocusedTextField.args = {
  autoFocus: true,
  value: "1.1",
  label: "Focus",
};

export const MultilineTextField = Template.bind({});
MultilineTextField.args = {
  multiline: true,
  minRows: 3,
  label: "Resizable Multiline",
  placeholder: "Enter text here...",
  variant: "outlined",
  fullWidth: true,
  sx: {
    "& .MuiOutlinedInput-input": {
      resize: "both",
      overflow: "auto",
    },
  },
};

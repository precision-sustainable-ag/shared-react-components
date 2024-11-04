import React, { useState } from "react";
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

export const DefaultTextField = Template.bind({});

export const DisabledTextField = Template.bind({});
DisabledTextField.args = {
  disabled: true,
};

export const ErrorTextField = Template.bind({});
ErrorTextField.args = {
  error: true,
};

export const MultilineTextField = Template.bind({});
MultilineTextField.args = {
  multiline: true,
  minRows: 3,
};

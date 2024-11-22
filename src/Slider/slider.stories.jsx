import React, { useState } from "react";
import { PSASlider } from "./slider";
import { Box } from "@mui/material";

const meta = {
  title: "Inputs/Slider",
  component: PSASlider,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component: `This is a custom Slider component based on MUI's \`Slider\`. 
        It inherits all [MUI Slider props](https://mui.com/material-ui/api/slider/) 
        and can be customized as needed.`,
      },
    },
  },
};

export default meta;

const Template = (args) => {
  const [value, setValue] = useState(args.value || 50);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <Box width={300}>
      <PSASlider
        {...args}
        value={value}
        onChange={handleChange}
        aria-label="PSA Slider"
      />
    </Box>
  );
};

export const DefaultSlider = Template.bind({});
DefaultSlider.args = {
  min: 0,
  max: 100,
  step: 1,
  value: 50,
  valueLabelDisplay: "auto",
};

export const DisabledSlider = Template.bind({});
DisabledSlider.args = {
  disabled: true,
  value: 50,
};

export const SmallStepSlider = Template.bind({});
SmallStepSlider.args = {
  step: 0.1,
  min: 0,
  max: 10,
  value: 5,
  valueLabelDisplay: "auto",
};

export const LargeRangeSlider = Template.bind({});
LargeRangeSlider.args = {
  min: 0,
  max: 1000,
  step: 10,
  value: 500,
  valueLabelDisplay: "on",
};

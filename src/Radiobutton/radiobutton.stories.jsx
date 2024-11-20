import React, { useState } from 'react';
import { PSARadiobutton } from './radiobutton';

const meta = {
  title: "PSARadiobutton",
  component: PSARadiobutton,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component: `This is a custom RadioGroup component based on MUI's RadioGroup component. It supports dynamic options and handles selection state.`,
      },
    },
  },
};

export default meta;

export const RadioButtonColumn = () => {
  const [selectedValue, setSelectedValue] = useState("lb/ac");

  const options = [
    { label: "lb/ac", value: "lb/ac" },
    { label: "kg/ha", value: "kg/ha" },
  ];

  const handleChange = (value) => {
    setSelectedValue(value);
  };

  return (
    <PSARadiobutton
      options={options}
      selectedValue={selectedValue}
      onChange={handleChange}
      row={false}
      aria-label="unit selection"
      name="unit"
    />
  );
};

export const RadioButtonRow = () => {
  const [selectedValue, setSelectedValue] = useState("lb/ac");

  const options = [
    { label: "lb/ac", value: "lb/ac" },
    { label: "kg/ha", value: "kg/ha" },
  ];

  const handleChange = (value) => {
    setSelectedValue(value);
  };

  return (
    <PSARadiobutton
      options={options}
      selectedValue={selectedValue}
      sx={{ marginLeft: '1em', display: 'inline-block' }}
      onChange={handleChange}
      row
      aria-label="unit selection"
      name="unit"
    />
  );
};

import React, { useState } from "react";
import { PSARadioButton } from "./radiobutton";

const meta = {
  title: "Inputs/RadioButton",
  component: PSARadioButton,
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

export const SmallRadioButtonColumn = () => {
  const [selectedValue, setSelectedValue] = useState("lb/ac");

  const options = [
    { label: "lb/ac", value: "lb/ac" },
    { label: "kg/ha", value: "kg/ha" },
  ];

  const handleChange = (value) => {
    setSelectedValue(value);
  };

  return (
    <PSARadioButton
      options={options}
      selectedValue={selectedValue}
      onChange={handleChange}
      row={false}
      aria-label="unit selection"
      name="unit"
    />
  );
};

export const SmallRadioButtonRow = () => {
  const [selectedValue, setSelectedValue] = useState("lb/ac");

  const options = [
    { label: "lb/ac", value: "lb/ac" },
    { label: "kg/ha", value: "kg/ha" },
  ];

  const handleChange = (value) => {
    setSelectedValue(value);
  };

  return (
    <PSARadioButton
      options={options}
      selectedValue={selectedValue}
      sx={{ marginLeft: "1em", display: "inline-block" }}
      onChange={handleChange}
      row
      aria-label="unit selection"
      name="unit"
    />
  );
};

export const LargeRadioButtonColumn = () => {
  const [selectedValue, setSelectedValue] = useState("lb/ac");

  const options = [
    { label: "lb/ac", value: "lb/ac" },
    { label: "kg/ha", value: "kg/ha" },
  ];

  const handleChange = (value) => {
    setSelectedValue(value);
  };

  return (
    <div style={{ width: "500px" }}>
      <PSARadioButton
        options={options}
        selectedValue={selectedValue}
        onChange={handleChange}
        row={false}
        aria-label="unit selection"
        name="unit"
        size="medium"
      />
    </div>
  );
};

export const LargeRadioButtonRow = () => {
  const [selectedValue, setSelectedValue] = useState("lb/ac");

  const options = [
    { label: "lb/ac", value: "lb/ac" },
    { label: "kg/ha", value: "kg/ha" },
  ];

  const handleChange = (value) => {
    setSelectedValue(value);
  };

  return (
    <div style={{ width: "600px" }}>
      <PSARadioButton
        options={options}
        selectedValue={selectedValue}
        onChange={handleChange}
        row={true}
        aria-label="unit selection"
        name="unit"
        size="medium"
      />
    </div>
  );
};

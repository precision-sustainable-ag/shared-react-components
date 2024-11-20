import React, { useState } from "react";
import { PSARadiobutton } from "./radiobutton";

const meta = {
  title: "PSARadiobutton",
  component: PSARadiobutton,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component: `This is a custom Radio button component based on MUI's Radio component.`,
      },
    },
  },
};

export default meta;

export const RadiobuttonGroup = () => {
  const [selectedValue, setSelectedValue] = useState("");

  const options = [
    { label: "Option A", value: "optionA" },
    { label: "Option B", value: "optionB" },
    { label: "Option C", value: "optionC" },
  ];

  const handleChange = (value) => {
    setSelectedValue(value);
  };

  return (
    <div>
      {options.map((option) => (
        <div
          key={option.value}
          style={{
            display: "flex",
            alignItems: "center",
            marginBottom: "8px",
          }}
        >
          <PSARadiobutton
            checked={selectedValue === option.value}
            name="psa-radiobutton-group"
            color="primary"
            style={{ marginRight: "8px" }}
            onChange={() => handleChange(option.value)}
          />
          <label htmlFor={option.label}>{option.label}</label>
        </div>
      ))}
    </div>
  );
};

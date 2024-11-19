import React, { useState } from "react";
import { PSACheckbox } from "./PSACheckbox";

const meta = {
  title: "PSACheckbox",
  component: PSACheckbox,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component: `This is a custom Checkbox component based on MUI's checkbox`,
      },
    },
  },
};

export default meta;

export const CheckboxGroup = () => {
  const [comparisonKeys, setComparisonKeys] = useState([]);

  const handleUpdateComparisonKeys = (updatedKeys) => {
    setComparisonKeys(updatedKeys);
  };

  const options = [
    { label: "Option 1", value: "option1" },
    { label: "Option 2", value: "option2" },
    { label: "Option 3", value: "option3" },
  ];

  return (
    <div>
      {options.map((option) => (
        <div key={option.value} style={{ display: "flex", alignItems: "center", marginBottom: "8px" }}>
          <PSACheckbox
            checked={comparisonKeys.includes(option.value)}
            name={option.label}
            color="primary"
            style={{ marginRight: "8px" }}
            dataTest={`${option.value}-checkbox`}
            comparisonKeys={comparisonKeys}
            valueKey={option.value}
            dispatchRedux={(action) => handleUpdateComparisonKeys(action)}
            updateAction={(updatedKeys) => updatedKeys}
          />
          <label htmlFor={option.label}>{option.label}</label>
        </div>
      ))}
    </div>
  );
};

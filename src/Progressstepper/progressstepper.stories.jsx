import React from "react";
import { MemoryRouter } from 'react-router-dom';
import { PSAProgressstepper } from "./progressstepper";

const meta = {
  component: PSAProgressstepper,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
  },
};

export default meta;

const Template = (args) => {
  const onStepClick = (step, index) => {
    alert(`Step ${index + 1}: ${step.label} clicked`);
  };

  return (
    <MemoryRouter>
      <PSAProgressstepper {...args} onStepClick={onStepClick} />
    </MemoryRouter>
  );
};

export const Default = Template.bind({});

Default.args = {
    steps: [
      { label: "Home" },
      { label: "Location" },
      { label: "Soil" },
      { label: "Cover Crop" },
      { label: "Cash Crop" },
      { label: "Output" },
    ],
    activeStep: 1,
    boxProps: {
      sx: { backgroundColor: '#F5F5F5', opacity: 0.9, width: '100%' }
    },
    stepperProps: {},
    stepProps: {},
    stepButtonProps: {},
    typographyProps: {},
  };

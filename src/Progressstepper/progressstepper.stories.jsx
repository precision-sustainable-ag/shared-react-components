import React from "react";
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
  return (
    <PSAProgressstepper {...args}/>
  );
};

export const NCalc = Template.bind({});

NCalc.args = {
    steps: [
      'Home', 'Location', 'Soil', 'Cover Crop', 'Cash Crop', 'Output'
    ],
    stepperProps: {
      activeStep: 0
    },
    boxProps: {
      sx: { backgroundColor: '#F5F5F5', opacity: 0.9, width: '100%' }
    },
  };

export const SeedCalc = Template.bind({});

SeedCalc.args = {
  maxAvailableStep: 2,
    steps: [
      'Home', 'Location', 'Soil', 'Cover Crop', 'Cash Crop', 'Output'
    ],
    stepperProps: {
      activeStep: 0
    },
    boxProps: {
      sx: { backgroundColor: '#F5F5F5', opacity: 0.9, width: '100%' }
    },
  };

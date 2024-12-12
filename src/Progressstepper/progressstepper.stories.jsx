import React from "react";
import { PSAStepper } from "./progressstepper";

const meta = {
  title: "Functional/Stepper",
  component: PSAStepper,
  tags: ["autodocs"],
  parameters: {
    layout: "fullScreen",
  },
};

export default meta;

const Template = (args) => {
  return (
    <PSAStepper {...args} />
  );
};

export const NCalc = Template.bind({});

NCalc.args = {
  onStepClick: (tab, index) => {
    alert(`Navigating to ${tab} (Step: ${index + 1})`);
  },
  steps: [
    'Home', 'Location', 'Soil', 'Cover Crop', 'Cash Crop', 'Output'
  ],
  tabs: [
    'home', 'location', 'soil', 'covercrop', 'cashcrop', 'output'
  ],
  stepperProps: {
    activeStep: 0
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
};

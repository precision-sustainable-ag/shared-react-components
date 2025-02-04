import React from "react";
import { PSAStepper } from "./progressstepper";

const meta = {
  title: "Functional/Stepper",
  component: PSAStepper,
  tags: ["autodocs"],
  parameters: {
    layout: "fullscreen",
  },
};

export default meta;

const Template = (args) => {
  return <PSAStepper {...args} />;
};

export const NCalc = Template.bind({});

NCalc.args = {
  steps: ["Home", "Location", "Soil", "Cover Crop", "Cash Crop", "Output"],
  stepperProps: {
    activeStep: 0,
  },
};

export const SeedCalc = Template.bind({});

SeedCalc.args = {
  maxAvailableStep: 2,
  strokeColor: "white",
  steps: ["Home", "Location", "Soil", "Cover Crop", "Cash Crop", "Output"],
  stepperProps: {
    activeStep: 0,
  },
};

export const Mobile = Template.bind({});

Mobile.args = {
  strokeColor: "white",
  steps: ["Home", "Location", "Soil", "Cover Crop", "Cash Crop", "Output"],
  stepperProps: {
    activeStep: 0,
  },
  mobile: true,
};

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

export const Default = Template.bind({});

Default.args = {
    steps: [
      'Home', 'Location', 'Soil', 'Cover Crop', 'Cash Crop', 'Output'
    ],
    boxProps: {
      sx: { backgroundColor: '#F5F5F5', opacity: 0.9, width: '100%' }
    },
  };

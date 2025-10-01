import React from "react";
import { PSAWizard } from "./wizard";

export default {
  title: "Functional/Wizard Application",
  component: PSAWizard,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component: `This is a wizard application component.`,
      },
    },
  },
};

const Template = (args) => (
  <div
    style={{
      height: "800px",
      overflow: "auto",
      boxSizing: "border-box",
    }}
  >
    <PSAWizard {...args} />
  </div>
);

// Default story
export const DefaultWizard = Template.bind({});
DefaultWizard.args = {}
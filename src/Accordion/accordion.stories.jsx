import React from "react";
import { PSAAccordion } from "./accordion"; 

const meta = {
  component: PSAAccordion,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
  },
};

export default meta;


const Template = (args) => <PSAAccordion {...args} />;

export const DefaultAccordion = Template.bind({}); 
DefaultAccordion.args = {
    accordionType: "SheetReference",
};
// };// export const DefaultAccordion = { 
//   args: {
//     accordionType: "",
//   },
// };
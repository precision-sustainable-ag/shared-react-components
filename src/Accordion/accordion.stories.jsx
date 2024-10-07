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
    accordionType: "",
    summaryContent: <div>Summary Content</div>,
    summaryExpandIcon: <span> ^ </span>, 
    detailsContent: <div>Details Content</div>, 
    divider: null,
};




export const SheetReferenceAccordion = Template.bind({}); 
SheetReferenceAccordion.args = {
    accordionType: "SheetReferences",
    summaryContent: <div>Summary Content</div>,
    summaryExpandIcon: <span> ^ </span>, 
    detailsContent: <div>Details Content</div>, 
    divider: null,
    
};


export const NRCSAAccordion = Template.bind({}); 
NRCSAAccordion.args = {
    summaryType: "NRCSAccordionSummary",
    detailsType: "NRCSAccordionDetails",
    summaryContent: <div>Summary Content</div>,
    summaryExpandIcon: <span> ^ </span>, 
    detailsContent: <div>Details Content</div>, 
    divider: null,
};

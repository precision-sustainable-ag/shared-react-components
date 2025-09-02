import React from "react";
import { PSAButton } from "./button";
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

const meta = {
  title: "Inputs/Button",
  component: PSAButton,
  tags: ["autodocs"],
};

export default meta;

const Template = (args) => <PSAButton {...args} />;

export const LightButton = Template.bind({});
LightButton.args = {
  title: "Light Button",
  buttonType: "LightButton",
};

export const PillButton = Template.bind({});
PillButton.args = {
  title: "Pill Button",
  buttonType: "PillButton",
  selected: true,
};

export const ValuesChanged = Template.bind({});
ValuesChanged.args = {
  title: "Values Changed",
  buttonType: "ValuesChanged",
};

export const ModalLink = Template.bind({});
ModalLink.args = {
  title: "Modal Link",
  buttonType: "ModalLink",
};

export const ToggleOptions = Template.bind({});
ToggleOptions.args = {
  title: "Toggle Options",
  buttonType: "ToggleOptions",
  selected: true,
};

export const Yes = Template.bind({});
Yes.args = {
  title: "Yes",
  buttonType: "Yes",
  startIcon: <CheckCircleIcon />,
  selected: true,
};

export const No = Template.bind({});
No.args = {
  title: "No",
  buttonType: "No",
  startIcon: <CancelIcon />,
  selected: true,
};

export const Back = Template.bind({});
Back.args = {
  title: "Back",
  buttonType: "Back",
  startIcon: <ArrowBackIcon/>,
};

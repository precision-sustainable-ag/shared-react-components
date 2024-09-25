import React from 'react';
import { PSAButton } from './button';


const meta = {
    component: PSAButton,
    tags: ["autodocs"],
  };
  
export default meta;

const Template = (args) => <PSAButton {...args} />;

export const LightButton = Template.bind({});
LightButton.args = {
  title: 'Light Button',
  buttonType: 'LightButton',
};

export const PillButton = Template.bind({});
PillButton.args = {
  title: 'Pill Button',
  buttonType: 'PillButton',
  selected: true,
};

export const ValuesChanged = Template.bind({});
ValuesChanged.args = {
  title: 'Values Changed',
  buttonType: 'ValuesChanged',
};

export const ModalLink = Template.bind({});
ModalLink.args = {
  title: 'Modal Link',
  buttonType: 'ModalLink',
};

export const ToggleOptions = Template.bind({});
ToggleOptions.args = {
  title: 'Toggle Options',
  buttonType: 'ToggleOptions',
  selected: true,
};

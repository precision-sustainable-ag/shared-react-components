import React from 'react';
import { PSALogoDisplayer } from './PSACoverCropCouncil';

const meta = {
  title: 'PSALogoDisplayer',
  component: PSALogoDisplayer,
  tags: ['autodocs'],
  argTypes: {
    council: {
      control: 'select',
      options: ['NECCC', 'SCCC', 'MCCC', 'PSA'], // Dropdown for the councilShorthandRedux
    },
  },
};

export default meta;

const Template = (args) => <PSALogoDisplayer {...args} />;

// Default Story
export const DefaultLogo = Template.bind({});
DefaultLogo.args = {
  council: 'PSA',
  alt: 'PSA Logo',
  style: {
    maxWidth: '100%',
    height: 'auto',
  },
};

// NECCC Logo
export const NECCCLogo = Template.bind({});
NECCCLogo.args = {
  council: 'NECCC',
  alt: 'NECCC Logo',
  style: {
    maxWidth: '100%',
    height: 'auto',
  },
};

// SCCC Logo
export const SCCCLogo = Template.bind({});
SCCCLogo.args = {
  council: 'SCCC',
  alt: 'SCCC Logo',
  style: {
    maxWidth: '100%',
    height: 'auto',
  },
};

// MCCC Logo
export const MCCCLogo = Template.bind({});
MCCCLogo.args = {
  council: 'MCCC',
  alt: 'MCCC Logo',
  style: {
    maxWidth: '100%',
    height: 'auto',
  },
};

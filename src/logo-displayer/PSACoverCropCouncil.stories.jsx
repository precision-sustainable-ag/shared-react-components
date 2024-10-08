import React from 'react';
import PSACoverCropCouncil from './PSACoverCropCouncil';

const meta = {
  title: 'PSACoverCropCouncil',
  component: PSACoverCropCouncil,
  tags: ['autodocs'],
  argTypes: {
    councilShorthandRedux: {
      control: 'select',
      options: ['NECCC', 'SCCC', 'MCCC', 'PSA'], // Dropdown for the councilShorthandRedux
    },
  },
};

export default meta;

const Template = (args) => <PSACoverCropCouncil {...args} />;

// Default Story
export const DefaultLogo = Template.bind({});
DefaultLogo.args = {
  councilShorthandRedux: 'PSA',
  alt: 'PSA Logo',
  style: {
    maxWidth: '100%',
    height: 'auto',
  },
};

// NECCC Logo
export const NECCCLogo = Template.bind({});
NECCCLogo.args = {
  councilShorthandRedux: 'NECCC',
  alt: 'NECCC Logo',
  style: {
    maxWidth: '100%',
    height: 'auto',
  },
};

// SCCC Logo
export const SCCCLogo = Template.bind({});
SCCCLogo.args = {
  councilShorthandRedux: 'SCCC',
  alt: 'SCCC Logo',
  style: {
    maxWidth: '100%',
    height: 'auto',
  },
};

// MCCC Logo
export const MCCCLogo = Template.bind({});
MCCCLogo.args = {
  councilShorthandRedux: 'MCCC',
  alt: 'MCCC Logo',
  style: {
    maxWidth: '100%',
    height: 'auto',
  },
};

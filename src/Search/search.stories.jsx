import React from 'react';
import { PSASearch } from './search';

const meta = {
  title: 'Inputs/Search',
  component: PSASearch,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
  },
};

export default meta;

const Template = (args) => <PSASearch {...args} />;

export const DefaultSearch = Template.bind({});
DefaultSearch.args = {
  boxType: '',
  label: 'label',
  value: '',
};

export const PaperSearch = Template.bind({});
PaperSearch.args = {
  boxType: 'Paper',
  label: 'label',
  value: '',
};

import React, { useState } from 'react';
import { PSADropdown } from './PSADropdown'; // Assuming PSADropdown is the component you are working on

export default {
  title: 'PSADropdown',
  component: PSADropdown,
  tags: ['autodocs'],
  argTypes: {
    id: {
      description: 'The unique identifier for the dropdown element.',
      control: { type: 'text' },
      table: {
        type: { summary: 'string' },
        defaultValue: { summary: 'undefined' },
      },
    },
    labelId: {
      description: 'The identifier for the label element associated with the dropdown.',
      control: { type: 'text' },
      table: {
        type: { summary: 'string' },
        defaultValue: { summary: 'undefined' },
      },
    },
    label: {
      description: 'The text label for the dropdown.',
      control: { type: 'text' },
      table: {
        type: { summary: 'string' },
        defaultValue: { summary: 'undefined' },
      },
    },
    items: {
      description: 'An array of options for the dropdown menu.',
      control: { type: 'object' },
      table: {
        type: { summary: 'Array<{ label: string, value: string }>' },
        defaultValue: { summary: '[]' },
      },
    },
    formSx: {
      description: 'Style object for the form control element.',
      control: { type: 'object' },
      table: {
        type: { summary: 'object' },
        defaultValue: { summary: '{}' },
      },
    },
    inputSx: {
      description: 'Style object for the input element inside the dropdown.',
      control: { type: 'object' },
      table: {
        type: { summary: 'object' },
        defaultValue: { summary: '{}' },
      },
    },
    selectSx: {
      description: 'Style object for the select element inside the dropdown.',
      control: { type: 'object' },
      table: {
        type: { summary: 'object' },
        defaultValue: { summary: '{}' },
      },
    },
  },
};

const Template = (args) => {
  const [selectedValue, setSelectedValue] = useState('');

  return (
    <PSADropdown
      {...args}
      value={selectedValue}
      onChange={(e) => setSelectedValue(e.target.value)}
    />
  );
};

// Default story
export const DefaultDropdown = Template.bind({});
DefaultDropdown.args = {
  id: 'default-dropdown',
  labelId: 'default-dropdown-label',
  label: 'Default',
  items: [
    { label: 'Option 1', value: 'option1' },
    { label: 'Option 2', value: 'option2' },
    { label: 'Option 3', value: 'option3' },
  ],
  formSx: { minWidth: 120 },
  inputS: {
    color: '#598445',
    '&.Mui-focused': {
      color: '#598445',
      fontWeight: 'medium',
    },
  },
  selectSx: {
    minWidth: 100,
    '& .MuiOutlinedInput-notchedOutline': {
      borderColor: '#598445',
      borderWidth: '1px',
      borderRadius: '4px',
    },
    '&:hover .MuiOutlinedInput-notchedOutline': {
      borderColor: '#598445',
      borderWidth: '2px',
    },
    '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
      borderColor: '#598445',
      borderWidth: '2.5px',
    },
  }
};

// Dropdown with custom styles
export const StyledDropdown = Template.bind({});
StyledDropdown.args = {
  id: 'styled-dropdown',
  labelId: 'styled-dropdown-label',
  label: 'Style',
  variant: 'filled',
  items: [
    { label: 'Option 1', value: 'option1' },
    { label: 'Option 2', value: 'option2' },
    { label: 'Option 3', value: 'option3' },
  ],
  style: { backgroundColor: 'lightblue' },
  sx: { color: 'green' },
  MenuProps: {
    PaperProps: {
      style: {
        backgroundColor: 'lightgray',
        color: 'black',
      },
    },
  },
  formSx: { minWidth: 120 },
  inputSx: {
    color: '#598445',
    '&.Mui-focused': {
      color: '#598445',
      fontWeight: 'medium',
    },
  },
  selectSx: {
    minWidth: 100,
    '& .MuiOutlinedInput-notchedOutline': {
      borderColor: '#598445',
      borderWidth: '1px',
      borderRadius: '4px',
    },
    '&:hover .MuiOutlinedInput-notchedOutline': {
      borderColor: '#598445',
      borderWidth: '2px',
    },
    '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
      borderColor: '#598445',
      borderWidth: '2.5px',
    },
  }
};

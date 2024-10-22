import React, { useState } from 'react';
import { PSADropdown } from './PSADropdown'; // Assuming PSADropdown is the component you are working on

export default {
  title: 'PSADropdown',
  component: PSADropdown,
  tags: ['autodocs'],
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component: `This is a custom Dropdown component based on MUI's \`FormControl, InputLabel, MenuItem, Select,\`. 
        It Inherits all required props (https://mui.com/material-ui/react-select/) 
        and can be styled as needed.`,
      },
    },
  },
};

const Template = (args) => {
  const [selectedValue, setSelectedValue] = useState('');

  return (
    <PSADropdown
      {...args}
      SelectProps={{
        value: selectedValue,
        onChange: (e) => setSelectedValue(e.target.value),
        ...args.SelectProps, // Pass down SelectProps from args
      }}
    />
  );
};

// Default story
export const DefaultDropdown = Template.bind({});
DefaultDropdown.args = {
  label: 'Default',
  items: [
    { label: 'Option 1', value: 'option1' },
    { label: 'Option 2', value: 'option2' },
    { label: 'Option 3', value: 'option3' },
  ],
  formSx: { minWidth: 120 },
  inputSx: {
    color: '#598445',
    '&.Mui-focused': {
      color: '#598445',
      fontWeight: 'medium',
    },
  },
  SelectProps: {
    sx: {
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
    },
  },
};

// Dropdown with custom styles
export const StyledDropdown = Template.bind({});
StyledDropdown.args = {
  label: 'Style',
  items: [
    { label: 'Option 1', value: 'option1' },
    { label: 'Option 2', value: 'option2' },
    { label: 'Option 3', value: 'option3' },
  ],
  formSx: { minWidth: 120 },
  inputSx: {
    color: '#598445',
    '&.Mui-focused': {
      color: '#598445',
      fontWeight: 'medium',
    },
  },
  SelectProps: {
    variant: 'filled',
    style: { backgroundColor: 'lightblue' },
    sx: {
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
    },
    MenuProps: {
      PaperProps: {
        style: {
          backgroundColor: 'lightgray',
          color: 'black',
        },
      },
    },
    error: false,
  },
};
  
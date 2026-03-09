import AddIcon from '@mui/icons-material/Add';
import React from 'react';
import { PSADataPoint } from './dataPoint';

const meta = {
  title: 'Functional/DataPoint',
  component: PSADataPoint,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
  },
};

export default meta;

export const DefaultDataPoint = {
  args: {
    title: 'Data Point',
    value: '7000',
    icon: <AddIcon sx={{ color: 'main.accent2' }} />,
    unit: 'lbs per acre',
    boxSx: {},
  },
};

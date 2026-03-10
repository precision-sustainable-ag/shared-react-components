import { Avatar } from '@mui/material';
import { PSATagItem } from './tagitem';

const sampleGoal = {
  label: 'Cover Crop',
  description: 'Helps suppress weeds and protect soil moisture.',
};

const commonArgs = {
  chipId: 1,
  tooltipText: sampleGoal.description,
  label: sampleGoal.label,
  disabled: false,
  color: 'primary',
  onClick: () => {},
};

export default {
  title: 'Inputs/TagItem',
  component: PSATagItem,
  tags: ['autodocs'],
  parameters: { layout: 'centered' },
};

export const Default = {
  args: {
    ...commonArgs,
  },
};

export const Numbered = {
  args: {
    ...commonArgs,
    avatar: <Avatar>1</Avatar>,
  },
};

export const Disabled = {
  args: {
    ...commonArgs,
    disabled: true,
  },
};

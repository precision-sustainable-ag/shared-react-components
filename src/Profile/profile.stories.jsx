import { PSAProfile } from './profile';

const meta = {
  title: 'Layout/Profile',
  component: PSAProfile,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
  },
};

export default meta;

export const DefaultProfile = {
  args: {
    styles: {
      backgroundColor: 'grey',
    },
  },
};

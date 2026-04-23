import ChatBubbleOutlineOutlinedIcon from '@mui/icons-material/ChatBubbleOutlineOutlined';
// import { fn } from '@storybook/test';
import PSAAuthButton from '../Authbutton';
import PSADropdown from '../Dropdown';
import { PSAHeader } from './header';

const meta = {
  title: 'Functional/Header',
  component: PSAHeader,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
  },
  argTypes: {
    council: {
      control: 'select',
      options: ['NECCC', 'SCCC', 'MCCC', 'PSA'],
    },
  },
};

export default meta;

const navContent = [
  {
    type: 'button',
    variant: 'text',
    text: 'Release Notes',
    icon: <ChatBubbleOutlineOutlinedIcon />,
    rightIcon: true,
    // onClick: fn(),
    style: { fontSize: '1rem' },
  },
  {
    type: 'button',
    variant: 'text',
    text: 'About',
    icon: <ChatBubbleOutlineOutlinedIcon />,
    rightIcon: true,
    // onClick: fn(),
  },
  {
    type: 'button',
    variant: 'text',
    text: 'Feedback',
    icon: <ChatBubbleOutlineOutlinedIcon />,
    rightIcon: true,
    // onClick: fn(),
  },
];

const customNavComponent = [
  {
    type: 'component',
    component: (
      <PSADropdown
        SelectProps={{
          value: '',
        }}
        items={[
          { label: 'Option 1', value: 'option1' },
          { label: 'Option 2', value: 'option2' },
          { label: 'Option 3', value: 'option3' },
        ]}
      />
    ),
  },
  {
    type: 'component',
    component: <PSAAuthButton />,
  },
];

export const DefaultHeader = {
  args: {
    title: 'Seeding Rate Calculator',
    subtitle: '',
    council: '',
    // onLogoClick: fn(),
    logoTitle: 'Reset and back to home page',
    navContent: navContent,
  },
};

export const HeaderWithCustomNavComponent = {
  args: {
    title: 'Seeding Rate Calculator',
    subtitle: '',
    council: '',
    // onLogoClick: fn(),
    logoTitle: 'Reset and back to home page',
    navContent: [...navContent, ...customNavComponent],
  },
};

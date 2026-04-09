import { PSAWizard2 } from './wizard2';

export default {
  title: 'Functional/Wizard',
  component: PSAWizard2,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: `This is a wizard application component.`,
      },
    },
  },
};

const Template = (args) => <PSAWizard2 {...args} />;

// Default story
export const DefaultWizard2 = Template.bind({});
DefaultWizard2.args = {};

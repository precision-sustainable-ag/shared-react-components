import { PSAWizard } from './wizard';

export default {
  title: 'Functional/Wizard Application',
  component: PSAWizard,
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

const Template = (args) => <PSAWizard {...args} />;

// Default story
export const DefaultWizard = Template.bind({});
DefaultWizard.args = {};

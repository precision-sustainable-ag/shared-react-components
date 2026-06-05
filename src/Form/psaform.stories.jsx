import { PSAForm } from './psaform';

export default {
  title: 'Inputs/Form',
  component: PSAForm,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: `This is a custom Form component based on MUI's \`Grid, Typography, Snackbar, Checkbox, FormGroup,\` 
        that allows for capturing user input, validating required fields, and providing feedback.`,
      },
    },
  },
};

const allStates = [
  { shorthand: 'AL', label: 'Alabama' },
  { shorthand: 'AK', label: 'Alaska' },
  { shorthand: 'AZ', label: 'Arizona' },
];

const menuProps = {
  PaperProps: {
    style: {
      maxHeight: 224,
      marginTop: '5px',
    },
    sx: {
      '.MuiMenuItem-root': {
        '&.Mui-selected': {
          backgroundColor: '#598445',
          color: 'white',
        },
        '&:hover': {
          backgroundColor: 'rgba(176, 236, 130, 0.3)',
          color: 'black',
        },
      },
    },
  },
};

// Template for stories
const Template = (args) => <PSAForm {...args} />;

// Default story
export const DefaultForm = Template.bind({});
DefaultForm.args = {
  apiUrl: 'https://developfeedback.covercrop-data.org/v1/issues',
  submitMessage: 'Feedback submitted successfully',
  headerTitle: 'Cover Crop Species Selector Feedback',
  repository: 'dst-feedback',
  fields: [
    {
      type: 'text',
      label: 'Title',
      description: 'Give your feedback a short descriptive title.',
      props: {
        placeholder: 'Enter Your Title',
        variant: 'outlined',
        'data-test': 'feedback_title',
      },
      name: 'title',
      required: true,
    },
    {
      type: 'text',
      label: 'Message',
      description:
        'Explain your feedback as thoroughly as you can. Your feedback will help us improve the experience.',
      props: {
        placeholder: 'Enter Your Feedback',
        multiline: true,
        variant: 'outlined',
        fullWidth: true,
        minRows: 3,
        'data-test': 'feedback_message',
      },
      name: 'comments',
      required: true,
    },
    {
      type: 'checkbox',
      label: 'Feedback Type',
      description: 'Select the type of feedback you are providing.',
      options: [
        {
          label: 'About the Cover Crop Data',
          props: {
            name: 'About the Cover Crop Data',
            'data-test': 'feedback_data',
          },
        },
        {
          label: 'About the Website',
          props: {
            name: 'About the Website',
            'data-test': 'feedback_website',
          },
        },
        {
          label: 'Other',
          props: {
            name: 'Other',
            'data-test': 'feedback_other',
          },
        },
      ],
      required: true,
    },
    {
      type: 'text',
      label: 'Name',
      props: {
        placeholder: 'Enter Name',
        variant: 'outlined',
        'data-test': 'feedback_name',
      },
      name: 'name',
    },
    {
      type: 'text',
      label: 'Email',
      props: {
        placeholder: 'Enter Email',
        variant: 'outlined',
        'data-test': 'feedback_email',
      },
      name: 'email',
    },
    {
      name: 'state',
      label: 'State',
      type: 'dropdown',
      required: false,
      description: 'Select your state',
      items: allStates.map((state) => ({
        value: state.shorthand,
        label: state.label.toUpperCase(),
      })),
      props: {
        label: 'STATE',
        value: allStates[1].shorthand,
        formSx: { minWidth: 120 },
        inputSx: {
          color: '#598445',
          '&.Mui-focused': {
            color: '#598445',
            fontWeight: 'medium',
          },
        },
        SelectProps: {
          variant: 'outlined',
          MenuProps: menuProps,
          sx: {
            '& .MuiOutlinedInput-notchedOutline': {
              borderColor: '#598445',
              borderWidth: '1px',
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
      },
    },
    {
      name: 'county',
      label: 'County',
      type: 'dropdown',
      required: false,
      description: 'Select your county',
      items: allStates.map((state) => ({
        value: state.shorthand,
        label: state.label.toUpperCase(),
      })),
      props: {
        label: 'COUNTY',
        value: allStates[1].shorthand,
        formSx: { minWidth: 120 },
        inputSx: {
          color: '#598445',
          '&.Mui-focused': {
            color: '#598445',
            fontWeight: 'medium',
          },
        },
        SelectProps: {
          variant: 'outlined',
          MenuProps: menuProps,
          sx: {
            '& .MuiOutlinedInput-notchedOutline': {
              borderColor: '#598445',
              borderWidth: '1px',
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
      },
    },
  ],
  buttons: [
    {
      props: {
        title: 'Submit',
        variant: 'contained',
        color: 'primary',
        children: 'Submit',
      },
      action: 'submit',
    },
  ],
  consentRedux: true,
  pirschAnalytics: (action, options) => console.log(`Analytics action: ${action}`, options),
};

// Dark Mode Form Example
export const DarkTheme = Template.bind({});
DarkTheme.args = {
  apiUrl: 'https://developfeedback.covercrop-data.org/v1/issues',
  submitMessage: 'Feedback submitted successfully',
  headerTitle: 'Craft Dashboard Feedback',
  repository: 'dst-feedback',
  isDarkMode: true,
  fields: [
    {
      type: 'text',
      label: 'Title',
      description: 'Give your feedback a short descriptive title.',
      props: {
        placeholder: 'Enter Your Title',
        variant: 'outlined',
        'data-test': 'feedback_title',
      },
      name: 'title',
      required: true,
    },
    {
      type: 'text',
      label: 'Message',
      description:
        'Explain your feedback as thoroughly as you can. Your feedback will help us improve the experience.',
      props: {
        placeholder: 'Enter Your Feedback',
        multiline: true,
        variant: 'outlined',
        fullWidth: true,
        minRows: 3,
        'data-test': 'feedback_message',
      },
      name: 'comments',
      required: true,
    },
    {
      type: 'checkbox',
      label: 'Feedback Type',
      description: 'Select the type of feedback you are providing.',
      options: [
        {
          label: 'About the Website',
          props: {
            name: 'About the Website',
            'data-test': 'feedback_website',
          },
        },
        {
          label: 'Other',
          props: {
            name: 'Other',
            'data-test': 'feedback_other',
          },
        },
      ],
      required: true,
    },
    {
      type: 'text',
      label: 'Name',
      props: {
        placeholder: 'Enter Name',
        variant: 'outlined',
        'data-test': 'feedback_name',
      },
      name: 'name',
    },
    {
      type: 'text',
      label: 'Email',
      props: {
        placeholder: 'Enter Email',
        variant: 'outlined',
        'data-test': 'feedback_email',
      },
      name: 'email',
    },
  ],
  buttons: [
    {
      props: {
        title: 'Submit',
        variant: 'contained',
        color: 'primary',
        children: 'Submit',
      },
      action: 'submit',
    },
  ],
  consentRedux: true,
  pirschAnalytics: (action, options) => console.log(`Analytics action: ${action}`, options),
};

// Custom Form Example
export const CustomForm = Template.bind({});
CustomForm.args = {
  headerTitle: 'Introduction Form',
  fields: [
    {
      type: 'text',
      label: 'Name',
      props: {
        placeholder: 'Enter Name',
        variant: 'outlined',
      },
      name: 'intro_name',
      required: true,
    },
    {
      type: 'text',
      label: 'Email',
      props: {
        placeholder: 'Enter Email',
        variant: 'outlined',
      },
      name: 'intro_email',
      required: true,
    },
    {
      type: 'text',
      label: 'Message',
      description: 'Provide your feedback to help us improve.',
      props: {
        placeholder: 'Enter Your Feedback',
        multiline: true,
        variant: 'outlined',
        fullWidth: true,
        minRows: 3,
        'data-test': 'feedback_message',
      },
      name: 'feedback_message',
      required: true,
    },
    {
      type: 'checkbox',
      label: 'Hobbies',
      description: 'Select your hobbies.',
      options: [
        {
          label: 'Hobby1',
          props: {
            name: 'hobby_data',
          },
        },
        {
          label: 'Hobby2',
          props: {
            name: 'hobby_data2',
          },
        },
        {
          label: 'Other',
          props: {
            name: 'hobby_other',
          },
        },
      ],
      required: true,
    },
  ],
  buttons: [
    {
      props: {
        title: 'Submit',
        variant: 'contained',
        color: 'primary',
        children: 'Submit',
      },
      action: 'submit',
    },
  ],
  consentRedux: true,
  pirschAnalytics: (action, options) => console.log(`Analytics action: ${action}`, options),
};

// Horizontal Dropdowns Form Example
export const HorizontalDropdownsForm = Template.bind({});
HorizontalDropdownsForm.args = {
  apiUrl: 'https://developfeedback.covercrop-data.org/v1/issues',
  submitMessage: 'Feedback submitted successfully',
  headerTitle: 'Cover Crop Species Selector Feedback',
  repository: 'dst-feedback',
  fields: [
    {
      type: 'text',
      label: 'Title',
      description: 'Give your feedback a short descriptive title.',
      props: {
        placeholder: 'Enter Your Title',
        variant: 'outlined',
        'data-test': 'feedback_title',
      },
      name: 'title',
      required: true,
    },
    {
      type: 'text',
      label: 'Message',
      description:
        'Explain your feedback as thoroughly as you can. Your feedback will help us improve the experience.',
      props: {
        placeholder: 'Enter Your Feedback',
        multiline: true,
        variant: 'outlined',
        fullWidth: true,
        minRows: 3,
        'data-test': 'feedback_message',
      },
      name: 'comments',
      required: true,
    },
    {
      type: 'checkbox',
      label: 'Feedback Type',
      description: 'Select the type of feedback you are providing.',
      options: [
        {
          label: 'About the Cover Crop Data',
          props: {
            name: 'About the Cover Crop Data',
            'data-test': 'feedback_data',
          },
        },
        {
          label: 'About the Website',
          props: {
            name: 'About the Website',
            'data-test': 'feedback_website',
          },
        },
        {
          label: 'Other',
          props: {
            name: 'Other',
            'data-test': 'feedback_other',
          },
        },
      ],
      required: true,
    },
    {
      type: 'text',
      label: 'Name',
      props: {
        placeholder: 'Enter Name',
        variant: 'outlined',
        'data-test': 'feedback_name',
      },
      name: 'name',
    },
    {
      type: 'text',
      label: 'Email',
      props: {
        placeholder: 'Enter Email',
        variant: 'outlined',
        'data-test': 'feedback_email',
      },
      name: 'email',
    },
    {
      name: 'state',
      label: 'For Western states please enter your state and county if you would like',
      type: 'dropdown',
      orientation: 'horizontal',
      required: false,
      description: 'Select your state',
      items: allStates.map((state) => ({
        value: state.shorthand,
        label: state.label.toUpperCase(),
      })),
      props: {
        label: 'STATE',
        value: allStates[1].shorthand,
        formSx: { minWidth: 120 },
        inputSx: {
          color: '#598445',
          '&.Mui-focused': {
            color: '#598445',
            fontWeight: 'medium',
          },
        },
        SelectProps: {
          variant: 'outlined',
          MenuProps: menuProps,
          sx: {
            '& .MuiOutlinedInput-notchedOutline': {
              borderColor: '#598445',
              borderWidth: '1px',
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
      },
    },
    {
      name: 'county',
      label: 'County',
      type: 'dropdown',
      required: false,
      orientation: 'horizontal',
      description: 'Select your county',
      items: allStates.map((state) => ({
        value: state.shorthand,
        label: state.label.toUpperCase(),
      })),
      props: {
        label: 'COUNTY',
        value: allStates[1].shorthand,
        formSx: { minWidth: 120 },
        inputSx: {
          color: '#598445',
          '&.Mui-focused': {
            color: '#598445',
            fontWeight: 'medium',
          },
        },
        SelectProps: {
          variant: 'outlined',
          MenuProps: menuProps,
          sx: {
            '& .MuiOutlinedInput-notchedOutline': {
              borderColor: '#598445',
              borderWidth: '1px',
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
      },
    },
  ],
  buttons: [
    {
      props: {
        title: 'Submit',
        variant: 'contained',
        color: 'primary',
        children: 'Submit',
      },
      action: 'submit',
    },
  ],
  consentRedux: true,
  pirschAnalytics: (action, options) => console.log(`Analytics action: ${action}`, options),
};

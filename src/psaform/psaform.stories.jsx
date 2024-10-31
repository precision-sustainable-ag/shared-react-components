import React from "react";
import { PSAForm } from "./psaform"; // Ensure the correct path to PSAForm component

export default {
  title: "PSAForm",
  component: PSAForm,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component: `This is a custom Form component based on MUI's \`Grid, Typography, Snackbar, Checkbox, FormGroup,\` 
        that allows for capturing user input, validating required fields, and providing feedback.`,
      },
    },
  },
};

// Template for stories
const Template = (args) => <PSAForm {...args} />;

// Default story
export const DefaultForm = Template.bind({});
DefaultForm.args = {
  apiUrl: "https://developfeedback.covercrop-data.org/v1/issues",
  submitMessage: "Feedback submitted successfully",
  headerTitle: "Cover Crop Species Selector Feedback",
  textFields: [
    {
      label: "Title",
      description: "Give your feedback a short descriptive title.",
      props: {
        placeholder: "Enter Your Title",
        variant: "outlined",
        "data-test": "feedback_title",
      },
      name: "feedback_title",
      required: true,
    },
    {
      label: "Message",
      description: "Explain your feedback as thoroughly as you can. Your feedback will help us improve the experience.",
      props: {
        placeholder: "Enter Your Feedback",
        multiline: true,
        variant: "outlined",
        fullWidth: true,
        minRows: 3,
        "data-test": "feedback_message",
      },
      name: "feedback_message",
      required: true,
    },
    {
      label: "Name",
      props: {
        placeholder: "Enter Name",
        variant: "outlined",
        "data-test": "feedback_name",
      },
      name: "feedback_name",
    },
    {
      label: "Email",
      props: {
        placeholder: "Enter Email",
        variant: "outlined",
        "data-test": "feedback_email",
      },
      name: "feedback_email",
    },
  ],
  checkboxes: [
    {
      title: "Feedback Type",
      required: true,
      options: [
        {
          label: "About the Cover Crop Data",
          props: {
            name: "feedback_data",
            "data-test": "feedback_data",
          },
        },
        {
          label: "About the Website",
          props: {
            name: "feedback_website",
            "data-test": "feedback_website",
          },
        },
        {
          label: "Other",
          props: {
            name: "feedback_other",
            "data-test": "feedback_other",
          },
        },
      ],
    },
  ],
  buttons: [
    {
      props: {
        title: "Submit",
        variant: "contained",
        color: "primary",
        children: "Submit",
      },
      action: "submit",
    },
  ],
  consentRedux: true,
  pirschAnalytics: (action, options) => console.log(`Analytics action: ${action}`, options),
};

// Custom Form Example
export const CustomForm = Template.bind({});
CustomForm.args = {
  headerTitle: "Introduction Form",
  textFields: [
    {
      label: "Name",
      props: {
        placeholder: "Enter Name",
        variant: "outlined",
      },
      name: "intro_name",
      required: true,
    },
    {
      label: "Email",
      props: {
        placeholder: "Enter Email",
        variant: "outlined",
      },
      name: "intro_email",
      required: true,
    },
    {
      label: "Message",
      description: "Explain your feedback as thoroughly as you can. Your feedback will help us improve the experience.",
      props: {
        placeholder: "Enter Your Feedback",
        multiline: true,
        variant: "outlined",
        fullWidth: true,
        minRows: 3,
        "data-test": "feedback_message",
      },
      name: "feedback_message",
      required: true,
    },
  ],
  checkboxes: [
    {
      title: "Hobbies",
      required: true,
      options: [
        {
          label: "Hobby1",
          props: {
            name: "hobby_data",
          },
        },
        {
          label: "Hobby2",
          props: {
            name: "hobby_data2",
          },
        },
        {
          label: "Other",
          props: {
            name: "hobby_other",
          },
        },
      ],
    },
  ],
  buttons: [
    {
      props: {
        title: "Submit",
        variant: "contained",
        color: "primary",
        children: "Submit",
      },
      action: "submit",
    },
  ],
  consentRedux: true,
  pirschAnalytics: (action, options) => console.log(`Analytics action: ${action}`, options),
};

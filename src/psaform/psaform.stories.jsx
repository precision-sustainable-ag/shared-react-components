import React from "react";
import { PSAForm } from "./psaform"; // Ensure correct path to PSAForm component

export default {
  title: "PSAForm",
  component: PSAForm,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component: `This is a custom Form component based on MUI's \`Grid, Typography, Snackbar, Checkbox, FormGroup,\`.
        It allows for capturing user input, validating required fields, and providing feedback.`,
      },
    },
  },
};

const Template = (args) => <PSAForm {...args} />;

// Default story
export const DefaultForm = Template.bind({});
DefaultForm.args = {
  headerTitle: "Feedback Form",
  title: "Title",
  titleDescription: "Give your feedback a short descriptive title.",
  titleTextFieldProps: {
    placeholder: "Enter Your Title",
    variant: "outlined",
    "data-test": "feedback_title",
  },
  messageTitle: "Message",
  messageDescription:
    "Explain your feedback as thoroughly as you can. Your feedback will help us improve the experience.",
  messageTextFieldProps: {
    placeholder: "Enter Your Feedback",
    multiline: true,
    variant: "outlined",
    fullWidth: true,
    minRows: 3,
    "data-test": "feedback_message",
  },
  topicTitle: "Topic",
  topicDescription: "What is this feedback about?",
  checkBoxLabel1: "About the Cover Crop Data",
  topicCheckbox1: {
    name: "feedback_data",
    "data-test": "feedback_data",
  },
  checkBoxLabel2: "About the Website",
  topicCheckbox2: {
    name: "feedback_website",
    "data-test": "feedback_website",
  },
  checkBoxLabel3: "Other",
  topicCheckbox3: {
    name: "feedback_other",
    "data-test": "feedback_other",
  },
  nameTitle: "Name",
  nameTextFieldProps: {
    placeholder: "Enter Name",
    variant: "outlined",
    "data-test": "feedback_name",
  },
  emailTitle: "Email",
  emailTextFieldProps: {
    placeholder: "Enter Email",
    variant: "outlined",
    "data-test": "feedback_email",
  },
  consentRedux: true,
  pirschAnalytics: (action, options) => console.log(`Analytics action: ${action}`, options),
};

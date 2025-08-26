import React from "react";
import { PSAWizard } from "./wizard";
import { ThemeProvider, CssBaseline, createTheme } from '@mui/material';
import { deepmerge } from '@mui/utils';
import PSATheme from '../Theme';

const theme = createTheme(
  deepmerge(PSATheme,
    {
      palette: {
        primary: {
          main: '#598444',
          second: '#466734',
        },
        secondary: {
          main: '#1976d2',
          second: '#115293',
        },
        red: {
          main: '#d32f2f',
          second: '#b71c1c',
        },
        grey: {
          main: '#bdbdbd',
        },
        white: {
          main: '#ffffff',
        },
        black: {
          main: '#000000',
        },
        transparent: {
          main: '#00000000',
        },
      },
      typography: {
        fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
      },
    }));

export default {
  title: "Functional/Wizard Application",
  component: PSAWizard,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component: `This is a wizard application component.`,
      },
    },
  },
};

// Template for stories
const Template = (args) => (
  <ThemeProvider theme={theme}>
    <CssBaseline />
    <PSAWizard {...args} />
  </ThemeProvider>
);

// Default story
export const DefaultWizard = Template.bind({});
DefaultWizard.args = {}
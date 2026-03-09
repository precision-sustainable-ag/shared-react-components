/** @type { import('@storybook/react-vite').Preview } */

import { ThemeProvider } from '@mui/material';
import React from 'react';
import theme from '../src/theme';
import '@fontsource/ibm-plex-sans'; // Defaults to weight 400

export const decorators = [
  (Story) => (
    <ThemeProvider theme={theme}>
      <Story />
    </ThemeProvider>
  ),
];
const preview = {
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
  },
};

export default preview;

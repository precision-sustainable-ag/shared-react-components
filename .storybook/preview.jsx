/** @type { import('@storybook/react').Preview } */

import React from "react";
import { ThemeProvider } from "@mui/material";
import theme from "../src/theme";

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

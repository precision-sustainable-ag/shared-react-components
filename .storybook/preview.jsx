/** @type { import('@storybook/react-vite').Preview } */

import { ThemeProvider } from '@mui/material';
import mapboxgl from 'mapbox-gl';
import MapboxWorker from 'mapbox-gl/dist/mapbox-gl-csp-worker?worker';
import { MemoryRouter } from 'react-router-dom';

mapboxgl.workerClass = MapboxWorker;

// import React from 'react';
import theme from '../src/Theme';
import '@fontsource/ibm-plex-sans'; // Defaults to weight 400

export const decorators = [
  (Story) => (
    <MemoryRouter>
      <ThemeProvider theme={theme}>{Story()}</ThemeProvider>
    </MemoryRouter>
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

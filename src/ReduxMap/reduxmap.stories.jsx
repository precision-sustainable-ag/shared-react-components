import { configureStore } from '@reduxjs/toolkit';
import { fn } from '@storybook/test';
import { Provider } from 'react-redux';
import initRasterObject from './data/sample-raster-data-response.json';
import ReduxMap from './reduxmap';

const mockStore = configureStore({
  reducer: () => ({
    map: {
      features: [],
      address: {},
      properties: {},
    },
  }),
});

const meta = {
  title: 'Functional/ReduxMap',
  component: ReduxMap,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
  },
  decorators: [
    (Story) => (
      <Provider store={mockStore}>
        <Story />
      </Provider>
    ),
  ],
};

const mapboxToken = import.meta.env.VITE_MAPBOX_TOKEN || import.meta.env.VITE_MAPBOX_API_KEY;

export default meta;

export const PlainMapWithoutFeatures = {
  args: {
    setProperties: fn(),
    setFeatures: fn(),
    initWidth: '900px',
    initHeight: '400px',
    initLat: 41,
    initLon: -90,
    initStartZoom: 12,
    mapboxToken: mapboxToken,
  },
};

export const MapWithMarker = {
  args: {
    setProperties: fn(),
    setFeatures: fn(),
    initWidth: '900px',
    initHeight: '400px',
    initLat: 41,
    initLon: -90,
    initStartZoom: 12,
    hasMarker: true,
    hasMarkerPopup: true,
    hasMarkerMovable: true,
    hasCoordBar: true,
    mapboxToken: mapboxToken,
  },
};

export const MapWithGeocoder = {
  args: {
    setProperties: fn(),
    setFeatures: fn(),
    initWidth: '900px',
    initHeight: '400px',
    initLat: 41,
    initLon: -90,
    initStartZoom: 12,
    hasSearchBar: true,
    hasClear: true,
    hasMarker: true,
    hasMarkerPopup: true,
    hasMarkerMovable: true,
    hasCoordBar: true,
    mapboxToken: mapboxToken,
  },
};

export const MapWithDraw = {
  args: {
    setProperties: fn(),
    setFeatures: fn(),
    initWidth: '900px',
    initHeight: '400px',
    initLat: 41,
    initLon: -90,
    initStartZoom: 12,
    hasCoordBar: true,
    hasDrawing: true,
    hasFreehand: true,
    hasImport: true,
    fitBounds: true,
    mapboxToken: mapboxToken,
  },
};

export const MapWithAllFeatures = {
  args: {
    setProperties: fn(),
    setFeatures: fn(),
    initWidth: '900px',
    initHeight: '400px',
    initLat: 41,
    initLon: -90,
    initStartZoom: 12,
    showZoom: true,
    hasSearchBar: true,
    hasClear: true,
    autoFocus: true,
    hasMarker: true,
    hasMarkerPopup: true,
    hasMarkerMovable: true,
    hasNavigation: true,
    hasFullScreen: true,
    hasGeolocate: true,
    hasCoordBar: true,
    showCursorCoords: true,
    hasDrawing: true,
    hasFreehand: true,
    hasImport: true,
    hasElevation: true,
    hasFindField: true,
    hasHelp: true,
    fitBounds: true,
    mapboxToken: mapboxToken,
  },
};

export const MapWithRasterLayer = {
  args: {
    setProperties: fn(),
    setFeatures: fn(),
    initWidth: '900px',
    initHeight: '400px',
    initLat: 39.023,
    initLon: -76.913,
    initStartZoom: 14,
    hasMarker: true,
    hasMarkerPopup: true,
    hasMarkerMovable: true,
    hasFullScreen: true,
    fitBounds: true,
    mapboxToken: mapboxToken,
    initRasterObject: initRasterObject,
    rasterColors: ['red', 'white', 'green'],
    unit: 'kg/ha',
    material: 'biomass',
    color_steps: 5,
  },
};

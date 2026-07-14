import { configureStore } from '@reduxjs/toolkit';
// import { fn } from '@storybook/test';
import { Provider } from 'react-redux';
import initRasterObject from './data/sample-prescription.json';
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
    // setProperties: fn(),
    // setFeatures: fn(),
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
    // setProperties: fn(),
    // setFeatures: fn(),
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
    // setProperties: fn(),
    // setFeatures: fn(),
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
    // setProperties: fn(),
    // setFeatures: fn(),
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
    // setProperties: fn(),
    // setFeatures: fn(),
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
    initWidth: '900px',
    initHeight: '400px',
    initLat: 35.5220,
    initLon: -82.7055,
    initStartZoom: 16,
    hasFullScreen: true,
    fitBounds: true,
    mapboxToken: mapboxToken,
    initRasterObject: initRasterObject,
    valueKey: 'biomass_average',
    rasterColors: ['red', 'white', 'green'],
    unit: 'kg/ha',
    material: 'biomass',
    color_steps: 5,
  },
};

// Simulated as-applied spray points (GreenStar monitor style) on a field near the Chesapeake.
// A grid of points whose application rate varies, so the gradient is visible.
const sprayPointsRaster = {
  type: 'FeatureCollection',
  features: Array.from({ length: 40 }, (_, i) => ({
    type: 'Feature',
    properties: {
      Field: 70,
      Product: 'Sidedress',
      'Rt Apd Liq(gal(US)/ac)': 20 + (i % 10) * 5 + (i % 3),
    },
    geometry: {
      type: 'Point',
      // GeoJSON order: [longitude, latitude]
      coordinates: [-75.9639 + (i % 8) * 0.0006, 39.3028 + Math.floor(i / 8) * 0.0005],
    },
  })),
};

export const MapWithRasterPoints = {
  args: {
    initWidth: '900px',
    initHeight: '400px',
    initLat: 39.3038,
    initLon: -75.9618,
    initStartZoom: 16,
    hasFullScreen: true,
    mapboxToken: mapboxToken,
    initRasterObject: sprayPointsRaster,
    valueKey: 'Rt Apd Liq(gal(US)/ac)',
    rasterColors: ['red', 'yellow', 'green'],
    unit: 'gal(US)/ac',
    material: 'Rt Apd Liq',
    color_steps: 5,
  },
};

// Display-only Point features passed through initFeatures,
// colored from the rasterColors gradient by their properties.value
const gradientPointFeatures = Array.from({ length: 12 }, (_, i) => ({
  type: 'Feature',
  properties: { value: (i + 1) * 10 },
  geometry: {
    type: 'Point',
    coordinates: [-90 + (i % 4) * 0.005, 41 + Math.floor(i / 4) * 0.004],
  },
}));

export const MapWithPointFeatures = {
  args: {
    initWidth: '900px',
    initHeight: '400px',
    initLat: 41.004,
    initLon: -89.9925,
    initStartZoom: 14,
    hasCoordBar: true,
    fitBounds: true,
    mapboxToken: mapboxToken,
    initFeatures: gradientPointFeatures,
    rasterColors: ['red', 'yellow', 'green'],
    pointStyles: { 'circle-radius': 8 },
  },
};

  export const MapWithRasterLayerDiscrete = {
  args: {
    initWidth: '900px',
    initHeight: '400px',
    initLat: 35.5220,
    initLon: -82.7055,
    initStartZoom: 16,
    hasFullScreen: true,
    fitBounds: true,
    mapboxToken: mapboxToken,
    initRasterObject: initRasterObject,
    valueKey: 'category',
    material: 'treatment',
    color_steps: 5,
    discreteLabels: {
      1: 'Control',
      2: 'Full',
      3: 'Average',
      4: 'Cap',
      _colors: {
        1: 'red', 2: 'yellow', 3: 'blue', 4: 'green',
      },
    }
  },
};

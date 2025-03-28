import React from "react";
import { fn } from "@storybook/test";
import { RegionSelectorMap } from "./region-selector-map";
import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";

// Mock Redux store
const mockStore = configureStore({
  reducer: () => ({
    map: {
      features: [],
      address: {},
      properties: {},
    },
  }),
});

// Storybook metadata
const meta = {
  title: "Functional/ReduxRegionSelectorMap",
  component: RegionSelectorMap,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
  },
  decorators: [
    (Story) => (
      <Provider store={mockStore}>
        <Story />
      </Provider>
    ),
  ],
};

const mapboxToken = import.meta.env.VITE_MAPBOX_TOKEN;

export default meta;

const availableStates = [
  "Alabama",
  "Alaska",
  "Arizona",
  "Arkansas",
  "California",
  "Colorado",
  "Connecticut",
  "Delaware",
  "Florida",
  "Georgia",
  "Hawaii",
  "Idaho",
  "Illinois",
  "Indiana",
  "Iowa",
  "Kansas",
  "Kentucky",
  "Louisiana",
  "Maine",
  "Maryland",
  "Massachusetts",
  "Michigan",
  "Minnesota",
  "Mississippi",
  "Missouri",
  "Montana",
  "Nebraska",
  "Nevada",
  "New Hampshire",
  "New Jersey",
  "New Mexico",
  "New York",
  "North Carolina",
  "North Dakota",
  "Ohio",
  "Oklahoma",
  "Ontario",
  "Oregon",
  "Pennsylvania",
  "Rhode Island",
  "South Carolina",
  "South Dakota",
  "Tennessee",
  "Texas",
  "Utah",
  "Vermont",
  "Virginia",
  "Washington",
  "West Virginia",
  "Wisconsin",
  "Wyoming",
];

// Default RegionSelectorMap
export const MapWithAllStates = {
  args: {
    selectorFunction: fn(),
    availableStates: availableStates,
    initWidth: "900px",
    initHeight: "400px",
    initLat: 41,
    initLon: -90,
    initStartZoom: 2.8,
    mapboxToken: mapboxToken,
  },
};

// RegionSelectorMap with Features
export const MapWithInitState = {
  args: {
    initWidth: "900px",
    initHeight: "400px",
    availableStates: availableStates,
    selectedState: "North Carolina",
    initLat: 41,
    initLon: -90,
    initStartZoom: 2.8,
    mapboxToken: mapboxToken,
  },
};

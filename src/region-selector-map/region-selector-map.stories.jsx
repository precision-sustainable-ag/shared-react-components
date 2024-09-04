import { RegionSelectorMap } from "./region-selector-map";

const meta = {
  component: RegionSelectorMap,
};

const mapboxToken = import.meta.env.VITE_MAPBOX_TOKEN;

export default meta;

export const Default = {
  args: {
    selectorFunction: () => {},
    selectedState: "North Carolina",
    availableStates: [
      "Alabama",
      "Arkansas",
      "Connecticut",
      "Delaware",
      "Florida",
      "Georgia",
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
      "Nebraska",
      "New Hampshire",
      "New Jersey",
      "New York",
      "North Carolina",
      "North Dakota",
      "Ohio",
      "Oklahoma",
      "Ontario",
      "Pennsylvania",
      "Rhode Island",
      "South Carolina",
      "South Dakota",
      "Tennessee",
      "Texas",
      "Vermont",
      "Virginia",
      "West Virginia",
      "Wisconsin",
    ],
    initWidth: "100%",
    initHeight: "360px",
    initLon: -95,
    initLat: 40,
    initStartZoom: 2,
    mapBoxToken: mapboxToken,
  },
};

import React from "react";
import { RegionSelectorMap } from "./region-selector-map";

export const BasicRegionSelectorMap = () => (
  <RegionSelectorMap
    selectorFunction={() => {}}
    selectedState=""
    availableStates={[
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
    "Wisconsin"
    ]}
    initWidth="700px"
    initHeight="300px"
    initLon={-95}
    initLat={40}
    initStartZoom={2}
  />
);


export const WithInitRegionMap = () => (
  <RegionSelectorMap
    selectorFunction={() => {}}
    selectedState="Texas"
    availableStates={[
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
    "Wisconsin"
    ]}
    initWidth="700px"
    initHeight="300px"
    initLon={-95}
    initLat={40}
    initStartZoom={2}
  />
);

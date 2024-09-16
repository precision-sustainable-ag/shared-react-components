import React from "react";
import { NcalcMap } from "./ncalc-map";
import initRasterObject from "./sample-response.json";

const meta = {
  component: NcalcMap,
  tags: ["autodocs"],
};

const mapboxToken = import.meta.env.VITE_MAPBOX_TOKEN;

export default meta;

const initLon = -76.913;
const initLat = 39.022;
const initHeight = "450px";
const initWidth = "400px";
// const initLon = -101.2906
// const initLat = 40.9417

var featuresSample = [
  {
    type: "Feature",
    geometry: {
      coordinates: [
        [
          [-80.12590347289976, 37.782425773494836],
          [-80.09037246704036, 37.790022979308205],
          [-80.06067214965797, 37.74062718302841],
          [-80.09569107055624, 37.74117017324208],
          [-80.12727676391549, 37.75311495017202],
          [-80.12590347289976, 37.782425773494836],
        ],
      ],
      type: "Polygon",
    },
  },
  {
    type: "Feature",
    geometry: {
      coordinates: [
        [
          [-80.2452403254797, 37.77489071424286],
          [-80.24785644332641, 37.75586412843647],
          [-80.23111328910737, 37.74593527108064],
          [-80.19187152140672, 37.73393612436084],
          [-80.18193027358929, 37.76082805750093],
          [-80.18088382645068, 37.800114071409865],
          [-80.2452403254797, 37.77489071424286],
        ],
      ],
      type: "Polygon",
    },
  },
];

export const PlainMapWithoutFeatures = {
  args: {
    initRasterObject: initRasterObject,
    initWidth: initWidth,
    initHeight: initHeight,
    initLon: initLon,
    initLat: initLat,
    rasterColors: ["cyan", "green", "white"],
    initStartZoom: 10,
    mapboxToken: mapboxToken,
  },
};

export const MapWithMarker = {
  args: {
    initRasterObject: initRasterObject,
    initWidth: initWidth,
    initHeight: initHeight,
    initLon: initLon,
    initLat: initLat,
    rasterColors: ["cyan", "green", "white"],
    initStartZoom: 11,
    hasMarker: true,
    hasMarkerPopup: true,
    hasMarkerMovable: true,
    mapboxToken: mapboxToken,
  },
};

export const MapWithGeocoder = {
  args: {
    initRasterObject: initRasterObject,
    initWidth: initWidth,
    initHeight: initHeight,
    initLon: initLon,
    initLat: initLat,
    rasterColors: ["cyan", "green", "white"],
    initStartZoom: 13,
    hasSearchBar: true,
    mapboxToken: mapboxToken,
  },
};

export const MapWithAllFeatures = {
  args: {
    initRasterObject: initRasterObject,
    initFeatures: featuresSample,
    initWidth: initWidth,
    initHeight: initHeight,
    initLon: initLon,
    initLat: initLat,
    rasterColors: ["cyan", "green", "white"],
    initStartZoom: 11,
    hasSearchBar: true,
    hasMarker: true,
    hasNavigation: true,
    hasCoordBar: true,
    hasDrawing: true,
    hasGeolocate: true,
    hasFullScreen: true,
    hasMarkerPopup: true,
    hasMarkerMovable: true,
    mapboxToken: mapboxToken,
  },
};

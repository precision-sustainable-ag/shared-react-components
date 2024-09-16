import { fn } from "@storybook/test";
import { Map } from "./map";

const meta = {
  component: Map,
  tags: ["autodocs"],
  argTypes: {
    mapboxToken: {
      table: { disable: true },
    },
  },
};

const mapboxToken = import.meta.env.VITE_MAPBOX_TOKEN;

export default meta;

const featuresSample = [
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

const singlePolygonFeatures = [
  {
    type: "Feature",
    geometry: {
      type: "Polygon",
      coordinates: [
        [
          [-78.79385987583387, 35.80028988840564],
          [-78.76806746757245, 35.801754219806],
          [-78.7636827581682, 35.769323421139845],
          [-78.77890027904223, 35.769741967319945],
          [-78.8013396742299, 35.77183466518218],
          [-78.80881947262552, 35.78125112407582],
          [-78.80778777629504, 35.79234018982805],
          [-78.80959324487357, 35.792130976492615],
          [-78.79385987583387, 35.80028988840564],
        ],
      ],
    },
  },
];

export const PlainMapWithoutFeatures = {
  args: {
    setAddress: fn(),
    setFeatures: fn(),
    initWidth: "400px",
    initHeight: "300px",
    initLon: -80.16,
    initLat: 37.75,
    initStartZoom: 10,
    initMinZoom: 5,
    initMaxZoom: 16,
    hasSearchBar: false,
    hasMarker: false,
    hasNavigation: false,
    hasCoordBar: false,
    hasDrawing: false,
    hasGeolocate: false,
    hasFullScreen: false,
    hasMarkerPopup: false,
    hasMarkerMovable: false,
    scrollZoom: true,
    dragRotate: true,
    dragPan: true,
    keyboard: true,
    doubleClickZoom: false,
    touchZoomRotate: true,
    mapboxToken: mapboxToken,
  },
};

export const MapWithMarker = {
  args: {
    setAddress: fn(),
    setFeatures: fn(),
    setZoom: fn(),
    initWidth: "400px",
    initHeight: "300px",
    initLon: -80.16,
    initLat: 37.75,
    initStartZoom: 10,
    initMinZoom: 5,
    initMaxZoom: 16,
    hasSearchBar: false,
    hasMarker: true,
    hasNavigation: false,
    hasCoordBar: false,
    hasDrawing: false,
    hasGeolocate: false,
    hasFullScreen: false,
    hasMarkerPopup: true,
    hasMarkerMovable: true,
    scrollZoom: true,
    dragRotate: true,
    dragPan: true,
    keyboard: true,
    doubleClickZoom: false,
    touchZoomRotate: true,
    mapboxToken: mapboxToken,
  },
};

export const MapWithGeocoder = {
  args: {
    setAddress: fn(),
    setFeatures: fn(),
    setZoom: fn(),
    initWidth: "400px",
    initHeight: "300px",
    initLon: -80.16,
    initLat: 37.75,
    initStartZoom: 10,
    initMinZoom: 5,
    initMaxZoom: 16,
    hasSearchBar: true,
    hasMarker: false,
    hasNavigation: false,
    hasCoordBar: false,
    hasDrawing: false,
    hasGeolocate: false,
    hasFullScreen: false,
    hasMarkerPopup: true,
    hasMarkerMovable: true,
    scrollZoom: true,
    dragRotate: true,
    dragPan: true,
    keyboard: true,
    doubleClickZoom: false,
    touchZoomRotate: true,
    mapboxToken: mapboxToken,
  },
};

export const MapWithInitFeatures = {
  args: {
    setAddress: fn(),
    setFeatures: fn(),
    setZoom: fn(),
    initFeatures: singlePolygonFeatures,
    initWidth: "400px",
    initHeight: "300px",
    initStartZoom: 10,
    initMinZoom: 5,
    initMaxZoom: 16,
    hasSearchBar: true,
    hasMarker: true,
    hasNavigation: true,
    hasCoordBar: true,
    hasDrawing: true,
    hasGeolocate: true,
    hasFullScreen: true,
    hasMarkerPopup: true,
    hasMarkerMovable: true,
    scrollZoom: true,
    dragRotate: true,
    dragPan: true,
    keyboard: true,
    doubleClickZoom: false,
    touchZoomRotate: true,
    mapboxToken: mapboxToken,
  },
};

export const MapWithAllFeatures = {
  args: {
    setAddress: fn(),
    setFeatures: fn(),
    setZoom: fn(),
    initFeatures: featuresSample,
    initWidth: "400px",
    initHeight: "300px",
    initStartZoom: 10,
    initMinZoom: 5,
    initMaxZoom: 16,
    hasSearchBar: true,
    hasMarker: true,
    hasNavigation: true,
    hasCoordBar: true,
    hasDrawing: true,
    hasGeolocate: true,
    hasFullScreen: true,
    hasMarkerPopup: true,
    hasMarkerMovable: true,
    scrollZoom: true,
    dragRotate: true,
    dragPan: true,
    keyboard: true,
    doubleClickZoom: false,
    touchZoomRotate: true,
    mapboxToken: mapboxToken,
  },
};

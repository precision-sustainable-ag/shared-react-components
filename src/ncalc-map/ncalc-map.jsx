/* eslint-disable */
import React, { useRef, useEffect, useState } from "react";
import mapboxgl from "mapbox-gl"; // eslint-disable-line import/no-webpack-loader-syntax
import MapboxDraw from "@mapbox/mapbox-gl-draw";
import MapboxGeocoder from "@mapbox/mapbox-gl-geocoder";
import area from "@turf/area";
import centroid from "@turf/centroid";
import turf from "turf";
import chroma from "chroma-js";
import PropTypes, { string } from "prop-types";

import { geocodeReverse, coordinatesGeocoder } from "./helpers";
import RasterTools from "./raster-tools";
import InfoBox from "./info-box";

import styles from "./map.module.scss";
import "./mapbox-gl.css";
import "./mapbox-gl-draw.css";
import "./mapbox-gl-geocoder.css";

const NR_COLOR_STEPS = 7;

const transpose = (m) => m[0].map((x, i) => m.map((x) => x[i]));

let polygons = turf.featureCollection([]);
// let bbox, biomassData;

const acreDiv = 4046.856422;
const fastFly = {
  bearing: 0,
  speed: 4, // Make the flying slow/fast.
  curve: 5, // Change the speed at which it zooms out.
  easing: (t) => t ** 2,
};

const NcalcMap = ({
  setAddress = () => {},
  setFeatures = () => {},
  setZoom = () => {},
  setMap = () => {},
  onDraw = () => {},
  initRasterObject = {},
  rasterColors = ["red", "green"],
  initFeatures = [],
  initWidth = "400px",
  initHeight = "400px",
  unit = "kg/ha",
  material = "biomass",
  initAddress = "",
  initLon = -75,
  initLat = 40,
  initStartZoom = 12,
  initMinZoom = 5,
  initMaxZoom = 16,
  hasSearchBar = false,
  hasMarker = false,
  hasNavigation = false,
  hasCoordBar = false,
  hasDrawing = false,
  hasGeolocate = false,
  hasFullScreen = false,
  hasMarkerPopup = false,
  hasMarkerMovable = false,
  scrollZoom = true,
  dragRotate = true,
  dragPan = true,
  keyboard = true,
  doubleClickZoom = false,
  touchZoomRotate = true,
  mapboxToken,
}) => {
  // eslint-disable-next-line no-unused-vars
  const [lastZoom, setLastZoom] = useState(initStartZoom);
  const [viewport, setViewport] = useState({
    initWidth,
    initHeight,
    initLon,
    initLat,
    lastZoom,
    initMinZoom,
    initMaxZoom,
  });
  const [marker, setMarker] = useState({
    longitude: initLon,
    latitude: initLat,
  });
  const [cursorLoc, setCursorLoc] = useState({
    longitude: undefined,
    latitude: undefined,
  });
  const [featuresInitialized, setFeaturesInitialized] = useState(false);
  const [polygonArea, setPolygonArea] = useState(0);
  const [isDrawActive, setIsDrawActive] = useState(false);
  const [geocodeResult, setGeocodeResult] = useState(undefined);
  // const [popupOpen, setPopupOpen] = useState(true);
  const [rasterColorSteps, setRasterColorSteps] = useState([]);
  const [flyToOptions, setFlyToOptions] = useState({});
  const [biomassData, setBiomassData] = useState(null);
  const [bbox, setBbox] = useState(null);

  const map = useRef();
  const mapContainer = useRef();
  const drawerRef = useRef();
  const markerRef = useRef();
  const popupRef = useRef();
  const geocoderRef = useRef();

  //// GEOCODER CONTROL
  const Geocoder = new MapboxGeocoder({
    placeholder: initAddress || "Search Your Address ...",
    localGeocoder: coordinatesGeocoder,
    marker: false,
    accessToken: mapboxToken,
    container: map.current,
    proximity: "ip",
    trackProximity: true,
    countries: "us",
  });
  geocoderRef.current = Geocoder;

  useEffect(() => {
    mapboxgl.accessToken = mapboxToken;
  }, []);

  useEffect(() => {
    if (
      initRasterObject &&
      initRasterObject.data_array &&
      initRasterObject.data_array.length > 0 &&
      !biomassData
    ) {
      setBiomassData(transpose(initRasterObject.data_array));
      setBbox(initRasterObject.bbox);
    }
  }, [initRasterObject, biomassData, bbox]);

  useEffect(() => {
    // // resetting pixel polygons in mapbox source
    // polygons = turf.featureCollection([]);
    // map.current && map.current.getSource(`${material}Polygons`) && map.current.getSource(`${material}Polygons`).setData(polygons);

    if (biomassData && biomassData.length > 0) {
      // resetting pixel polygons in mapbox source
      polygons = turf.featureCollection([]);
      map.current &&
        map.current.getSource(`${material}Polygons`) &&
        map.current.getSource(`${material}Polygons`).setData(polygons);

      /// setting up color legend
      let flattenedBiomass = [];
      if (initRasterObject && initRasterObject.data_array) {
        flattenedBiomass = biomassData.flat(1).filter((el) => el !== 0);
      }
      var colorValues = [];
      const f = unit === "lb/ac" ? 0.892179 : 1;
      const biomassMax = f * Math.max(...flattenedBiomass);
      const biomassMin = f * Math.min(...flattenedBiomass);
      const range = biomassMax - biomassMin;

      /// setting up pixel polygons
      let scale = chroma.scale(rasterColors);
      const w = biomassData.length;
      const h = biomassData[0].length;
      const lon = bbox[0];
      const lat = bbox[1];
      const dLon = (bbox[2] - bbox[0]) / w;
      const dLat = (bbox[1] - bbox[3]) / h;
      for (let i = 0; i < w; i++) {
        for (let j = 0; j < h; j++) {
          const topLeftCorner = { lon: lon + i * dLon, lat: lat - j * dLat };
          let biomassVal =
            f * biomassData[i][j] !== -9999 ? f * biomassData[i][j] : null;
          const normalizedBiomassVal = range
            ? (biomassVal - biomassMin) / range
            : null;
          biomassVal &&
            biomassVal > -9998 &&
            polygons.features.push(
              turf.polygon(
                [
                  [
                    [topLeftCorner.lon, topLeftCorner.lat],
                    [topLeftCorner.lon + dLon, topLeftCorner.lat],
                    [topLeftCorner.lon + dLon, topLeftCorner.lat - dLat],
                    [topLeftCorner.lon, topLeftCorner.lat - dLat],
                    [topLeftCorner.lon, topLeftCorner.lat],
                  ],
                ],
                {
                  value: biomassVal,
                  color: range ? scale(normalizedBiomassVal).hex() : null,
                }
              )
            );
        }
      }

      /// setting up color legend
      const step = (biomassMax - biomassMin) / (NR_COLOR_STEPS - 1);
      for (var i = biomassMin; i <= biomassMax; i = i + step) {
        colorValues.push(Math.round(i / 10, 0) * 10);
      }
      var rasterColorsVals = colorValues.map(function (e, i) {
        const normalizedBiomassVal = range ? (e - biomassMin) / range : null;
        const colorV = range ? scale(normalizedBiomassVal).hex() : null;
        return [e, colorV];
      });
      setRasterColorSteps(rasterColorsVals);

      // storing pixel polygons in mapbox source
      map.current &&
        map.current.getSource(`${material}Polygons`) &&
        map.current.getSource(`${material}Polygons`).setData(polygons);
    }
  }, [initRasterObject, biomassData, unit]);

  // handle empty initFeature
  useEffect(() => {
    if (hasDrawing && drawerRef.current && initFeatures.length) {
      drawerRef.current.add({
        type: "FeatureCollection",
        features: initFeatures,
      });
    }
  }, [initFeatures]);

  // delete all shapes after geocode search
  useEffect(() => {
    if (hasDrawing && drawerRef.current) drawerRef.current.deleteAll();
  }, [geocodeResult]);

  // upon marker move, find the address of this new location and set the state
  useEffect(() => {
    geocodeReverse({
      apiKey: mapboxToken,
      setterFunc: (address) => {
        if (document.querySelector(".mapboxgl-ctrl-geocoder--input")) {
          document.querySelector(".mapboxgl-ctrl-geocoder--input").placeholder =
            address().fullAddress;
        }
        // Geocoder.setPlaceholder(address().fullAddress);
        setAddress(address);
      },
      longitude: marker.longitude,
      latitude: marker.latitude,
    });

    setAddress((addr) => ({
      ...addr,
      longitude: marker.longitude,
      latitude: marker.latitude,
    }));
    if (markerRef.current) {
      const lngLat = [marker.longitude, marker.latitude];
      popupRef.current.setHTML(
        `<span> click and drag </span>
      <br />
      <span>${marker.longitude.toFixed(4)}  ${marker.latitude.toFixed(
        4
      )}</span>`
      );
      markerRef.current.setLngLat(lngLat).setPopup(popupRef.current);
      map.current.flyTo({
        center: lngLat,
        ...flyToOptions,
      });
    }
  }, [marker.longitude, marker.latitude]);

  useEffect(() => {
    //// MAP CREATE
    if (map.current) return; // initialize map only once
    var Map = new mapboxgl.Map({
      container: mapContainer.current,
      style: "mapbox://styles/mapbox/satellite-streets-v12",
      center: [initLon, initLat],
      zoom: initStartZoom,
    });
    map.current = Map;

    //// MARKER POPUP
    // const popup = new mapboxgl.Popup({ offset: 25 }).setText(
    //   'drag marker or double click anywhere'
    // );
    const Popup = new mapboxgl.Popup({ offset: 25 }).setHTML(
      `<span> click and drag </span>
      <br />
      <span>${marker.longitude.toFixed(4)}  ${marker.latitude.toFixed(
        4
      )}</span>`
    );
    popupRef.current = Popup;

    // Create a popup, but don't add it to the map yet.
    const overlayPopup = new mapboxgl.Popup({
      closeButton: false,
      closeOnClick: true,
    });

    //// MARKER CONTROL
    const Marker = new mapboxgl.Marker({
      draggable: hasMarkerMovable,
      color: "#e63946",
      scale: 1,
    })
      .setLngLat([marker.longitude, marker.latitude])
      .setPopup(Popup);
    markerRef.current = Marker;
    Marker.className = styles.marker;

    const simpleSelect = MapboxDraw.modes.simple_select;
    const directSelect = MapboxDraw.modes.direct_select;

    simpleSelect.dragMove = () => {};
    directSelect.dragFeature = () => {};

    // DRAWER CONTROL
    const Draw = new MapboxDraw({
      displayControlsDefault: false,
      controls: { polygon: true, trash: true },
      modes: {
        ...MapboxDraw.modes,
        simple_select: simpleSelect,
        direct_select: directSelect,
      },
    });
    drawerRef.current = Draw;

    //// GEOLOCATE CONTROL
    const Geolocate = new mapboxgl.GeolocateControl({ container: map.current });
    Geolocate._updateCamera = () => {};

    //// NAVIGATION CONTROL
    const Navigation = new mapboxgl.NavigationControl({
      container: map.current,
    });

    //// FULLSCREEN CONTROL
    const Fullscreen = new mapboxgl.FullscreenControl({
      container: map.current,
    });

    //// ADD CONTROLS
    if (hasFullScreen) map.current.addControl(Fullscreen, "top-right");
    if (hasNavigation) map.current.addControl(Navigation, "top-right");
    if (hasGeolocate) map.current.addControl(Geolocate, "top-right");
    if (hasDrawing) map.current.addControl(Draw, "top-left");
    if (hasSearchBar) map.current.addControl(Geocoder, "top-left");
    if (hasMarker && !isDrawActive) Marker.addTo(map.current);

    // if (!initAddress) {
    //   Geocoder.setPlaceholder('Search Your Address ...');
    // }

    //// FUNCTIONS
    function onDragEnd(e) {
      const lngLat = e.target.getLngLat();
      // map.current.flyTo({
      //   center: lngLat,
      // });
      setMarker((prev) => ({
        ...prev,
        longitude: lngLat.lng,
        latitude: lngLat.lat,
      }));
    }
    const handleGeolocate = (e) => {
      const lngLat = e.target._userLocationDotMarker._lngLat;
      setFlyToOptions(fastFly);

      setMarker((prev) => ({
        ...prev,
        longitude: lngLat.lng,
        latitude: lngLat.lat,
      }));
      setFlyToOptions({});

      // clear all shapes after geolocating to user's location
      if (hasDrawing && drawerRef.current) {
        drawerRef.current.deleteAll();
        setPolygonArea(0);
      }
    };

    const handlePolyCentCalc = (geom) => {
      if (geom) {
        if (geom.features.length > 0) {
          const coords = centroid(geom.features[0]).geometry.coordinates;

          setMarker((prev) => ({
            ...prev,
            longitude: coords[0],
            latitude: coords[1],
          }));
          setViewport((prev) => ({
            ...prev,
            longitude: coords[0],
            latitude: coords[1],
          }));
        }
      }
    };

    const handlePolyAreaCalc = (e) => {
      if (e.features.length > 0) {
        const a = area(e.features[0]) / acreDiv;
        setPolygonArea(a);
        setFeatures(e.features);
        handlePolyCentCalc(e);
      } else {
        setPolygonArea(0);
      }
    };

    const handleDrawCreate = (e) => {
      onDraw({ mode: "add", e: e });
    };
    const handleDrawDelete = (e) => {
      setIsDrawActive(false);
      onDraw({ mode: "delete", e: e });
    };
    const handleDrawUpdate = (e) => {
      onDraw({ mode: "update", e: e });
      handlePolyAreaCalc(e);
    };
    const handleDrawSelection = (e) => {
      onDraw({ mode: "select", e: e });
      handlePolyAreaCalc(e);
    };

    //// EVENTS
    Geolocate.on("geolocate", handleGeolocate);
    Geocoder.on("result", (e) => {
      var streetNum;
      var zipCode;
      if (e && e.result) {
        setGeocodeResult(e.result);
        var fullAddress = e.result.place_name;
        if (fullAddress.includes("Lat") && fullAddress.includes("Lng")) {
          let longitude = e.result.geometry.coordinates[0];
          let latitude = e.result.geometry.coordinates[1];
          geocodeReverse({
            apiKey: mapboxToken,
            setterFunc: (address) => {
              document.querySelector(
                ".mapboxgl-ctrl-geocoder--input"
              ).placeholder = address().fullAddress;
              // Geocoder.setPlaceholder(address().fullAddress);
              setAddress(address);
            },
            longitude: longitude,
            latitude: latitude,
          });
        } else {
          const splitted = fullAddress.split(", ");
          streetNum = splitted[0];
          const stateZip = splitted[splitted.length - 2].split(" ");
          zipCode = stateZip[stateZip.length - 1];
        }
        if (fullAddress) {
          setViewport((prev) => ({
            ...prev,
            address: streetNum,
            zipCode,
            fullAddress,
          }));
          setFlyToOptions(fastFly);

          setMarker((prev) => ({
            ...prev,
            longitude: e.result.center[0],
            latitude: e.result.center[1],
          }));
          setFlyToOptions({});
        }
      }
    });
    if (hasMarkerMovable) {
      map.current.on("dblclick", (e) => {
        setMarker((prev) => ({
          ...prev,
          longitude: e.lngLat.lng,
          latitude: e.lngLat.lat,
        }));
      });
    }
    map.current.on("mousemove", (e) => {
      const lnglat = e.lngLat.wrap();
      setCursorLoc({
        longitude: lnglat.lng.toFixed(4),
        latitude: lnglat.lat.toFixed(4),
      });
    });

    map.current.on("load", (e) => {
      map.current.addSource(`${material}Polygons`, {
        type: "geojson",
        data: {
          type: "FeatureCollection",
          features: [],
        },
      });
      map.current.getSource(`${material}Polygons`).setData(polygons);
      // add a layer that displays the data
      if (map.current.getLayer(`${material}Polygons`)) {
        map.removeLayer(`${material}Polygons`);
      }
      map.current.addLayer({
        id: `${material}Polygons`,
        type: "fill",
        source: `${material}Polygons`,
        paint: {
          "fill-opacity": 0.5,
          "fill-color": {
            type: "identity",
            property: "color",
          },
          // "fill-color": {
          //   property: "color",
          //   stops: stops,
          // },
        },
      });

      if (!scrollZoom) map.current.scrollZoom.disable();
      if (!dragRotate) map.current.dragRotate.disable();
      if (!dragPan) map.current.dragPan.disable();
      if (!keyboard) map.current.keyboard.disable();
      if (!doubleClickZoom) map.current.doubleClickZoom.disable();
      if (!touchZoomRotate) map.current.touchZoomRotate.disable();
      // if (hasMarkerPopup) {
      //   markerRef.current.togglePopup();
      //   setTimeout(() => markerRef.current.togglePopup(), 2000);
      // }
      if (
        drawerRef.current &&
        hasDrawing &&
        initFeatures.length > 0 &&
        !featuresInitialized
      ) {
        drawerRef.current.add({
          type: "FeatureCollection",
          features: initFeatures,
        });
        setFeaturesInitialized(true);
      }

      map.current.addPolygon = function (id, polygon, options = {}) {
        const lineId = `${id}-line`;

        const polygonStyle = {
          "fill-color": options["fill-color"] ?? "#000",
          "fill-opacity": options["fill-opacity"] ?? 1,
        };

        const lineStyle = {
          "line-color": options["line-color"] ?? "#000",
          "line-opacity": options["line-opacity"] ?? 1,
          "line-width": options["line-width"] ?? 1,
        };

        if (map.current.getLayer(id)) {
          map.current.removeLayer(id);
        }

        if (map.current.getLayer(lineId)) {
          map.current.removeLayer(lineId);
        }

        if (map.current.getSource(id)) {
          map.current.removeSource(id);
        }

        map.current.addSource(id, {
          type: "geojson",
          data: {
            type: "Feature",
            geometry: {
              type: "Polygon",
              coordinates: polygon,
            },
          },
        });

        map.current.addLayer({
          id,
          type: "fill",
          source: id,
          paint: polygonStyle,
        });

        map.current.addLayer({
          id: lineId,
          type: "line",
          source: id,
          paint: lineStyle,
        });

        map.current.on("mouseenter", id, () => {
          map.current.setPaintProperty(lineId, "line-width", 2);
          map.current.setPaintProperty(lineId, "line-color", "#aaa");

          ["fill-color", "fill-opacity"].forEach((prop) => {
            if (options.hover?.[prop]) {
              map.current.setPaintProperty(id, prop, options.hover[prop]);
            }
          });

          ["line-width", "line-color", "line-opacity"].forEach((prop) => {
            if (options.hover?.[prop]) {
              map.current.setPaintProperty(lineId, prop, options.hover[prop]);
            }
          });
        });

        map.current.on("mouseleave", id, () => {
          Object.entries(polygonStyle).forEach(([property, value]) => {
            map.current.setPaintProperty(id, property, value);
          });

          Object.entries(lineStyle).forEach(([property, value]) => {
            map.current.setPaintProperty(lineId, property, value);
          });
        });
      };

      setMap(map.current);
    });

    map.current.on("draw.create", handleDrawCreate);
    map.current.on("draw.delete", handleDrawDelete);
    map.current.on("draw.update", handleDrawUpdate);
    map.current.on("draw.selectionchange", handleDrawSelection);
    Marker.on("dragend", onDragEnd);

    // Biomass layer listeners
    map.current.on("click", `${material}Polygons`, (e) => {
      e.preventDefault();
      // // Map overlay (Biomass) popup
      map.current.getCanvas().style.cursor = "pointer";
      // Copy coordinates array.
      const coordinates = e.features[0].geometry.coordinates.slice();
      const description = `<div>${material} value: ${Math.round(e.features[0].properties.value, 0)} ${unit}</div>`;

      // Ensure that if the map is zoomed out such that multiple
      // copies of the feature are visible, the popup appears
      // over the copy being pointed to.
      while (Math.abs(e.lngLat.lng - coordinates[0]) > 180) {
        coordinates[0] += e.lngLat.lng > coordinates[0] ? 360 : -360;
      }
      // Populate the popup and set its coordinates
      // based on the feature found.
      overlayPopup
        .setLngLat([
          (coordinates[0][0][0] + coordinates[0][2][0]) / 2,
          (coordinates[0][0][1] + coordinates[0][2][1]) / 2,
        ])
        .setHTML(description)
        .addTo(map.current);
    });

    // map.current.on("mouseleave", "biomassPolygonsData", (e) => {
    //   map.current.getCanvas().style.cursor = '';
    //   overlayPopup.remove();
    // })
  }, [map, rasterColorSteps, unit]);

  useEffect(() => {
    map.current.on("zoom", () => {
      const currentZoom = map.current.getZoom();
      setLastZoom(currentZoom);
      setZoom(currentZoom);
    });
  }, []);

  return (
    <div className={styles.wrapper}>
      <div
        id="map"
        ref={mapContainer}
        className={styles.map}
        style={{ width: initWidth, height: initHeight }}
      />
      {hasCoordBar && cursorLoc.longitude && (
        <InfoBox cursorLoc={cursorLoc} polygonArea={polygonArea} />
      )}
      {polygons && polygons.features.length > 0 && (
        <RasterTools map={map} colorStops={rasterColorSteps} unit={unit} />
      )}
    </div>
  );
};

export { NcalcMap };

NcalcMap.propTypes = {
  /**
   * callback function to set the marker address text as its value
   */
  setAddress: PropTypes.func,
  /**
   * callback function to set the drawn geometry as its value
   */
  setFeatures: PropTypes.func,
  /**
   * callback function to set the map zoom level
   */
  setZoom: PropTypes.func,
  /**
   * callback function to handle draw events. Ex: {mode: 'delete', e: event}
   */
  onDraw: PropTypes.func,
  /**
   * initial raster object to draw on the map
   */
  initRasterObject: PropTypes.object,
  /**
   * initial features or polygons to draw on the map in geojson format
   */
  initFeatures: PropTypes.arrayOf(string),
  /**
   * map width in css format string
   */
  initWidth: PropTypes.string,
  /**
   * map height in css format string
   */
  initHeight: PropTypes.string,
  /**
   * map initial address string shown in searchbar
   */
  initAddress: PropTypes.string,
  /**
   * initial longitude of window center at the time of loading
   */
  initLon: PropTypes.number,
  /**
   * initial latitude of window center at the time of loading
   */
  initLat: PropTypes.number,
  /**
   * initial zoom level at the time of loading. higher values are zoomed in and vise versa
   */
  initStartZoom: PropTypes.number,
  /**
   * minimum zoom level allowed (the most zoomed out)
   */
  initMinZoom: PropTypes.number,
  /**
   * maximum zoom level allowed (the most zoomed in)
   */
  initMaxZoom: PropTypes.number,
  /**
   * if address search bar is enabled
   */
  hasSearchBar: PropTypes.bool,
  /**
   * if marker is enabled and is included
   */
  hasMarker: PropTypes.bool,
  /**
   * if navigation panel is enabled
   */
  hasNavigation: PropTypes.bool,
  /**
   * if cursor coordinates panel in lat/lon is enabled
   */
  hasCoordBar: PropTypes.bool,
  /**
   * if geometry drawer panel is enabled
   */
  hasDrawing: PropTypes.bool,
  /**
   * if geolocation button is enabled
   */
  hasGeolocate: PropTypes.bool,
  /**
   * if fullscreen button is enabled
   */
  hasFullScreen: PropTypes.bool,
  /**
   * if marker popup window is enabled
   */
  hasMarkerPopup: PropTypes.bool,
  /**
   * if marker can be dragged across the map by user
   */
  hasMarkerMovable: PropTypes.bool,
  /**
   * if scroll zooming of the map is enabled
   */
  scrollZoom: PropTypes.bool,
  /**
   * if drag rotation of the map is enabled
   */
  dragRotate: PropTypes.bool,
  /**
   * if panning via drag is enabled on the map
   */
  dragPan: PropTypes.bool,
  /**
   * if keyboard shortcuts is enabled
   */
  keyboard: PropTypes.bool,
  /**
   * if double click as zoom is enabled
   */
  doubleClickZoom: PropTypes.bool,
  /**
   * if map can be rotated via touch on mobile
   */
  touchZoomRotate: PropTypes.bool,
  /**
   * mapbox token
   */
  mapboxToken: PropTypes.string,
};

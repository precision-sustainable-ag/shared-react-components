import React, { useRef, useEffect, useState } from "react";
import mapboxgl from "mapbox-gl"; // eslint-disable-line import/no-webpack-loader-syntax
import MapboxDraw from "@mapbox/mapbox-gl-draw";
import MapboxGeocoder from "@mapbox/mapbox-gl-geocoder";
import area from "@turf/area";
import centroid from "@turf/centroid";
import PropTypes, { object } from "prop-types";

import { geocodeReverse, coordinatesGeocoder } from "./helpers";

import styles from "./map.module.scss";
import "./mapbox-gl.css";
import "./mapbox-gl-draw.css";
import "./mapbox-gl-geocoder.css";

const acreDiv = 4046.856422;
const fastFly = {
  bearing: 0,
  speed: 4, // Make the flying slow/fast.
  curve: 5, // Change the speed at which it zooms out.
  easing: (t) => t ** 2,
};

const Map = ({
  setAddress = () => {},
  setFeatures = () => {},
  setZoom = () => {},
  onDraw = () => {},
  initFeatures = [],
  initWidth = "400px",
  initHeight = "400px",
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
  const [popupOpen, setPopupOpen] = useState(true);
  const [flyToOptions, setFlyToOptions] = useState({});

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

  const handlePointFocus = (coords) => {
    if (coords) {
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
  };

  const handlePolyCentCalc = (geom) => {
    if (geom) {
      if (geom.features.length > 0) {
        const coords = centroid(geom.features[0]).geometry.coordinates;

        handlePointFocus(coords);
      }
    }
  };

  const handlePolyAreaCalc = (e) => {
    if (e?.features?.length > 0) {
      const a = area(e.features[0]) / acreDiv;
      setPolygonArea(a);
      handlePolyCentCalc(e);
    } else {
      setPolygonArea(0);
    }
  };

  const handlePolyChange = (e) => {
    if (e.features.length > 0) {
      drawerRef.current.add({
        type: "FeatureCollection",
        features: e.features,
      });
      setFeatures(drawerRef.current.getAll());
      handlePolyAreaCalc(e);
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
    handlePolyChange(e);
  };
  const handleDrawSelection = (e) => {
    onDraw({ mode: "select", e: e });
    handlePolyChange(e);
  };

  useEffect(() => {
    mapboxgl.accessToken = mapboxToken;
  }, []);

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
              if (hasSearchBar) {
                document.querySelector(
                  ".mapboxgl-ctrl-geocoder--input"
                ).placeholder = address().fullAddress;
              }
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
      if (!scrollZoom) map.current.scrollZoom.disable();
      if (!dragRotate) map.current.dragRotate.disable();
      if (!dragPan) map.current.dragPan.disable();
      if (!keyboard) map.current.keyboard.disable();
      if (!doubleClickZoom) map.current.doubleClickZoom.disable();
      if (!touchZoomRotate) map.current.touchZoomRotate.disable();
      if (hasMarkerPopup) {
        markerRef.current.togglePopup();
        setTimeout(() => markerRef.current.togglePopup(), 2000);
      }
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
    });

    map.current.on("draw.create", handleDrawCreate);
    map.current.on("draw.delete", handleDrawDelete);
    map.current.on("draw.update", handleDrawUpdate);
    map.current.on("draw.selectionchange", handleDrawSelection);
    Marker.on("dragend", onDragEnd);
  }, [map]);

  // handle empty initFeature
  useEffect(() => {
    if (hasDrawing && drawerRef.current && initFeatures.length) {
      drawerRef.current.deleteAll();
      drawerRef.current.add({
        type: "FeatureCollection",
        features: initFeatures,
      });

      if (initFeatures.length === 1) {
        if (initFeatures[0]?.geometry?.type === "Polygon") {
          handlePolyAreaCalc({ features: initFeatures });
        } else if (initFeatures[0]?.geometry?.type === "Point") {
          handlePointFocus(initFeatures[0]?.geometry?.coordinates);
        }
      }
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
        // console.log(address())
        if (hasSearchBar) {
          document.querySelector(".mapboxgl-ctrl-geocoder--input").placeholder =
            address().fullAddress;
        }
        // not sure why setPlaceholder doen't work
        // Geocoder.setPlaceholder(address().fullAddress);
        setAddress(address);
      },
      longitude: marker.longitude,
      latitude: marker.latitude,
    });

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
        <div className={styles.infobar}>
          <ul>
            <li>{`Longitude:${cursorLoc.longitude}`}</li>
            <li>{`Latitude:${cursorLoc.latitude}`}</li>
            {polygonArea > 0 && (
              <li>{`Area ${polygonArea.toFixed(2)} acres`}</li>
            )}
          </ul>
        </div>
      )}
    </div>
  );
};

export { Map };

Map.propTypes = {
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
   * initial features or polygons to draw on the map in geojson format
   */
  initFeatures: PropTypes.arrayOf(object),
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
   *
   * **This prop only applies when the component initially mounts,
   * any subsequent updates will not update the component.**
   */
  initAddress: PropTypes.string,
  /**
   * initial longitude of window center at the time of loading
   *
   * **This prop only applies when the component initially mounts,
   * any subsequent updates will not update the component.**
   */
  initLon: PropTypes.number,
  /**
   * initial latitude of window center at the time of loading
   *
   * **This prop only applies when the component initially mounts,
   * any subsequent updates will not update the component.**
   */
  initLat: PropTypes.number,
  /**
   * initial zoom level at the time of loading. higher values are zoomed in and vise versa
   *
   * **This prop only applies when the component initially mounts,
   * any subsequent updates will not update the component.**
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
   *
   * **==All the boolean props== only applies when the component initially mounts,
   * any subsequent updates will not update the component.**
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

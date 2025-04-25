/* eslint-disable react/prop-types */

import React, { useRef, useEffect, useState } from 'react';
import PropTypes from "prop-types";
import mapboxgl from 'mapbox-gl';
import MapboxDraw from '@mapbox/mapbox-gl-draw';

import area from '@turf/area';
import bbox from '@turf/bbox';
import union from '@turf/union';
import centroid from '@turf/centroid';
import { polygon, featureCollection } from '@turf/helpers';

import { addPolygonToMap, calcArea, findState, fitMapToFeatures } from './utils/helpers';
import useSafeSelector from "./hooks/useSafeSelector";

import useMapMarker from "./hooks/useMapMarker";
import useMapGeocoder from "./hooks/useMapGeocoder";
import useElevation from "./hooks/useElevation";
import useMapGeolocate from "./hooks/useMapGeolocate";

import { CustomControl } from './components/map-controls/CustomControl';
import { ImportShapeControl } from './components/map-controls/ImportShapeControl';
import { FreehandDrawControl } from './components/map-controls/FreehandDrawControl';
import HelpModal from "./components/HelpModal";
import CoordBar from "./components/CoordBar";

import helpIcon from './assets/icons/help.png';

import styles from './assets/styles/map.module.scss';
import './assets/styles/mapbox-gl.css';
import './assets/styles/mapbox-gl-draw.css';
import './assets/styles/mapbox-gl-geocoder.css';
import './assets/styles/psa-mapbox.scss';

const turf = {
  area,
  polygon,
  bbox,
  union,
  featureCollection,
  centroid,
};

const CONUS_BOUNDS = [
  [-124.731422, 24.743319], // Southwest coordinates
  [-66.969849, 49.345786], // Northeast coordinates
];

const DEFAULT_ZOOM = 15;
const DEFAULT_PADDING = 20;
const SEARCH_BAR_PADDING = 50;

/**
 * A configurable Mapbox GL React component
 */
const ReduxMap = ({
  getter,
  setter,
  setMap = () => {},
  setProperties = () => {},
  initWidth,
  initHeight,
  initLat = 0,
  initLon = 0,
  initStartZoom,
  initFeatures = null,
  initBounds,
  initAddress = 'Search for your address ...',
  layer = 'mapbox://styles/mapbox/satellite-streets-v12',
  projection,
  mapStyles,
  defaultZoom = DEFAULT_ZOOM,
  showZoom = false,
  hasSearchBar = false,
  hasClear = false,
  autoFocus = false,
  hasMarker = false,
  hasMarkerPopup = false,
  hasMarkerMovable = false,
  markerOptions = {},
  popupContent,
  hasNavigation = false,
  hasFullScreen = false,
  hasGeolocate = false,
  hasCoordBar = false,
  showCursorCoords = false,
  hasDrawing = false,
  hasFreehand = false,
  hasSinglePolygon = false,
  hasImport = false,
  hasElevation = false,
  hasHelp = false,
  otherHelp,
  scrollZoom = true,
  dragRotate = true,
  dragPan = true,
  keyboard = true,
  doubleClickZoom = false,
  touchZoomRotate = true,
  fitMapToPolygons = false,
  fitBounds = false,
  mapboxToken,
}) => {
  const MAPBOX_TOKEN =
    (typeof process !== "undefined"
      ? // eslint-disable-next-line no-undef
        process.env.REACT_APP_MAPBOX_API_KEY
      : import.meta.env.VITE_MAPBOX_API_KEY) || mapboxToken;

  const boundsPadding = hasSearchBar ? SEARCH_BAR_PADDING : DEFAULT_PADDING;

  const getBounds = (bounds) => {
    if (bounds === 'conus') return CONUS_BOUNDS ;
    return bounds;
  };

  const [lat, setLat] = useSafeSelector(initLat, 'lat', getter, setter);
  const [lon, setLon] = useSafeSelector(initLon, 'lon', getter, setter);
  const [polygonArea, setPolygonArea] = useSafeSelector(0, 'area', getter, setter);
  const [elevation, setElevation] = useSafeSelector(0, 'elevation', getter, setter);
  const [address, setAddress] = useSafeSelector(null, 'address', getter, setter);
  const [features, setFeatures] = useSafeSelector(initFeatures, 'features', getter, setter);
  const [zoom, setZoom] = useSafeSelector(initStartZoom ?? defaultZoom, 'zoom', getter, setter);
  const [bounds, setBounds] = useSafeSelector(initBounds, 'bounds', getter, setter);

  const [cursorLoc, setCursorLoc] = useState({ longitude: undefined, latitude: undefined });
  const [isDrawActive, setIsDrawActive] = useState(false);
  const [searchBox, setSearchBox] = useState();
  const [dragging, setDragging] = useState(false);
  const [newPolygon, setNewPolygon] = useState(false);

  const map = useRef();
  const mapContainer = useRef();
  const drawerRef = useRef();
  const cursorRef = useRef();

  const elevations = {};

  /**
   * Updates features on the map and in state variables.
   * Collects all GeoJSON polygon features from the map sources.
   *
   * @param {number} newLat - Optional new latitude to set
   * @param {number} newLon - Optional new longitude to set
   */
  const updateFeatures = (newLat, newLon) => {
    let newFeatures = [];
    const { sources } = map.current.getStyle();
    drawerRef?.current?.deleteAll?.();

    Object.keys(sources).forEach((sourceName) => {
      const source = map.current.getSource(sourceName);
      if (source.type === "geojson") {
        const data = { ...source._data };
        const f = data.features || [data];
        newFeatures.push(
          ...f.filter((feature) => /Polygon/.test(feature.geometry.type))
        );
      }
    });

    if (hasSinglePolygon) {
      if (newFeatures?.length > 1) newFeatures = [newFeatures[newFeatures.length - 1]];
    }

    setFeatures(newFeatures);
    setPolygonArea(calcArea(newFeatures));

    if (newLat) {
      setLat(newLat);
      setLon(newLon);
    }
  };

  // Update parent component with current map state
  useEffect(() => {
    setProperties({
      lat,
      lon,
      elevation,
      zoom,
      area: polygonArea,
      bounds,
      address: address ?? {},
      features,
      state: findState(lon, lat),
    });
  }, [lat, lon, elevation, zoom, polygonArea, bounds, address, features]);

  useEffect(() => {
    if (searchBox && autoFocus) {
      searchBox.focus();
    }
  }, [searchBox, autoFocus]);

  // Sync features with drawing tool
  useEffect(() => {
    if (drawerRef.current && features?.length) {
      try {
        drawerRef.current?.deleteAll?.();

        if (Array.isArray(features[0])) {
          features.forEach((f) => {
            drawerRef.current.add({
              type: "FeatureCollection",
              f,
            });
          });
        } else {
          features.forEach((feature) => {
            drawerRef.current.add(feature);
          });
        }

        setPolygonArea(calcArea(features));
      } catch {
        // Silently handle failures (happens when importing shapefile without setter)
      }
    }
  }, [features, drawerRef.current]);

  useEffect(() => {
    if (
      initFeatures &&
      JSON.stringify(initFeatures) !== JSON.stringify(features)
    ) {
      setFeatures(initFeatures);
    }
  }, [initFeatures]);

  useEffect(() => {
    if (initLat && initLon && initLat !==0 && initLon !== 0) {
      setLat(initLat);
      setLon(initLon);
    }
  }, [initLat, initLon]);

  // Handle bounds changes
  useEffect(() => {
    if (bounds && map.current) {
      map.current.fitBounds(getBounds(bounds), {
        duration: 0,
        padding: boundsPadding,
      });
    }
  }, [bounds, map.current]);

  // Initialize map
  useEffect(() => {
    if (!map.current) {
      const Map = new mapboxgl.Map({
        accessToken: MAPBOX_TOKEN,
        container: mapContainer.current,
        style: layer,
        center: [lon, lat],
        zoom,
        projection: projection,
      });
      map.current = Map;
      setMap(Map);

      // Disable dragging and moving polygons and points
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

      // NAVIGATION CONTROL
      const Navigation = new mapboxgl.NavigationControl({
        container: map.current,
      });

      // FULLSCREEN CONTROL
      const Fullscreen = new mapboxgl.FullscreenControl();

      // ADD CONTROLS
      if (hasFullScreen) map.current.addControl(Fullscreen, "top-right");
      if (hasNavigation) map.current.addControl(Navigation, "top-right"); // causes warning
      if (hasDrawing) map.current.addControl(Draw, "top-right");

      // CUSTOM CONTROLS
      if (hasFreehand)
        map.current.addControl(
          new FreehandDrawControl(map, drawerRef, hasDrawing, updateFeatures), 'top-right'
        );
      if (hasImport)
        map.current.addControl(
          new ImportShapeControl(
            turf,
            setFeatures,
            setBounds,
            setPolygonArea,
            setLat,
            setLon
          ),
          "top-right"
        );
      if (hasHelp)
        map.current.addControl(
          new CustomControl(
            () => {
              document.querySelector("#MapHelp").showModal();
            },
            "Help",
            helpIcon
          )
        );
    }
  }, [map.current]);

  // Use effect for map configuration and map resize
  useEffect(() => {
    map.current.on("load", () => {
      const mc = mapContainer.current;
      if (!mc) return;

      setSearchBox(mc.querySelector(".mapboxgl-ctrl-geocoder--input"));

      // Disable map interactions
      if (!scrollZoom) map.current.scrollZoom.disable();
      if (!dragRotate) map.current.dragRotate.disable();
      if (!dragPan) map.current.dragPan.disable();
      if (!keyboard) map.current.keyboard.disable();
      if (!doubleClickZoom) map.current.doubleClickZoom.disable();
      if (!touchZoomRotate) map.current.touchZoomRotate.disable();
    });
    
    // Attach polygon utility method
    map.current.addPolygon = addPolygonToMap(map, boundsPadding);

    // Fit map to existing features
    fitMapToFeatures(
      map.current,
      features,
      fitMapToPolygons,
      fitBounds,
      boundsPadding,
      initWidth,
      initHeight
    );
  }, [map.current, features]);

  // Use effect for setting map event handlers
  useEffect(() => {
    if (!map.current) return;

    // EVENT HANDLER FUNCTIONS
    const handleDrawCreate = (geom) => {
      updateFeatures();

      if (geom.features.length > 0) {
        const coords = turf.centroid(geom.features[0]).geometry.coordinates;
        setLat(coords[1]);
        setLon(coords[0]);
      }
      setNewPolygon(true);
      setTimeout(() => {
        setNewPolygon(false);
      }, 100);
    };

    const handleDrawDelete = () => {
      setIsDrawActive(false);
      setTimeout(updateFeatures, 10);
      document.querySelector(".mapbox-gl-draw_trash").style.display = "none";
    };

    const showHideTrashcan = (e) => {
      const trashButton = document.querySelector(".mapbox-gl-draw_trash");
      if (e.features.length > 0) {
        trashButton.style.display = "block";
      } else {
        trashButton.style.display = "none";
      }
    };

    const handleDragEnd = () => {
      setDragging(false);
      setCursorLoc({
        latitude: null,
        longitude: null,
      });
    };

    const handleMouseMove = (e) => {
      const lnglat = e.lngLat.wrap();
      setCursorLoc({
        latitude: lnglat.lat.toFixed(4),
        longitude: lnglat.lng.toFixed(4),
      });

      if (cursorRef.current) {
        cursorRef.current.style.left = `${e.originalEvent.pageX - 58}px`;
        cursorRef.current.style.top = `${e.originalEvent.pageY - 25}px`;
      }
    };

    const handleZoom = (event) => {
      if (!event.originalEvent) return;
      setZoom(map.current.getZoom());
      setBounds(false);
    };

    const handleDoubleClick = (e) => {
      if (!hasMarker || newPolygon) return;
      setLat(e.lngLat.lat);
      setLon(e.lngLat.lng);
      setZoom(defaultZoom);
      map.current.setZoom(defaultZoom);
      setBounds(false);
      e.preventDefault();
    };

    const handleClick = (e) => {
      if (lat === 0) handleDoubleClick(e);
    };

    // EVENT HANDLERS
    map.current.on("dragstart", () => setDragging(true));
    map.current.on("dragend", handleDragEnd);
    map.current.on("mousemove", handleMouseMove);
    map.current.on("draw.create", handleDrawCreate);
    map.current.on("draw.delete", handleDrawDelete);
    map.current.on("draw.selectionchange", showHideTrashcan);
    map.current.on("zoom", handleZoom);
    map.current.on("dblclick", handleDoubleClick);
    map.current.on("click", handleClick);

    return () => {
      if (map.current) {
        map.current.off("dragstart");
        map.current.off("dragend", handleDragEnd);
        map.current.off("mousemove", handleMouseMove);
        map.current.off("draw.create", handleDrawCreate);
        map.current.off("draw.delete", handleDrawDelete);
        map.current.off("draw.selectionchange", showHideTrashcan);
        map.current.off("zoom", handleZoom);
        map.current.off("dblclick", handleDoubleClick);
        map.current.off("click", handleClick);
      }
    };
  }, [map.current, lat, newPolygon]);

  // Use custom hooks
  useMapMarker({
    map,
    lon,
    lat,
    setLon,
    setLat,
    setZoom,
    setBounds,
    defaultZoom,
    hasMarker,
    hasMarkerPopup,
    hasMarkerMovable,
    isDrawActive,
    markerOptions,
    popupContent,
  });

  useMapGeocoder({
    map,
    MAPBOX_TOKEN,
    initLon,
    initLat,
    initAddress,
    defaultZoom,
    hasSearchBar,
    hasClear,
    hasDrawing,
    setLon,
    setLat,
    setZoom,
    setBounds,
    setAddress,
    setFeatures,
    setPolygonArea,
    drawerRef,
  });

  useMapGeolocate({
    map,
    hasGeolocate,
    hasDrawing,
    setLon,
    setLat,
    setZoom,
    setBounds,
    setFeatures,
    setPolygonArea,
    drawerRef,
  });

  useElevation({
    MAPBOX_TOKEN,
    lon,
    lat,
    setAddress,
    hasElevation,
    elevations,
    setElevation,
  });

  return (
    <div
      className={`mapbox ${styles.wrapper} ${hasClear ? "hasclear" : ""}`}
      style={{ width: initWidth || "100%", height: initHeight || "100%" }}
    >
      {hasHelp ? (
        <HelpModal
          hasMarkerMovable={hasMarkerMovable}
          hasFullscreen={hasFullScreen}
          hasFreehand={hasFreehand}
          hasImport={hasImport}
          otherHelp={otherHelp}
        />
      ) : null}
      <div
        id="psa-map"
        ref={mapContainer}
        className={styles.map}
        style={{
          width: initWidth || "100%",
          height: initHeight || "100%",
          ...mapStyles,
        }}
      />
      {showCursorCoords && (
        <div className="cursor" ref={cursorRef}>
          {cursorLoc.latitude && !dragging
            ? `${cursorLoc.latitude},${cursorLoc.longitude}`
            : null}
        </div>
      )}
      {hasCoordBar && (
        <CoordBar
          lat={lat}
          lon={lon}
          elevation={elevation}
          polygonArea={polygonArea}
          showZoom={showZoom}
          zoom={zoom}
        />
      )}
    </div>
  );
};

export default ReduxMap;

/**
 * A configurable Mapbox GL React component.
 */
ReduxMap.propTypes = {
  /**
   * Redux getter function for state management.
   */
  getter: PropTypes.func,
  /**
   * Redux setter function for state management.
   */
  setter: PropTypes.func,
  /**
   * Callback to set map instance in parent component.
   */
  setMap: PropTypes.func,
  /**
   * Callback to update map properties in parent component.
   */
  setProperties: PropTypes.func,
  /**
   * Initial map container width.
   */
  initWidth: PropTypes.string,
  /**
   * Initial map container height.
   */
  initHeight: PropTypes.string,
  /**
   * Initial latitude for map center.
   */
  initLat: PropTypes.number,
  /**
   * Initial longitude for map center.
   */
  initLon: PropTypes.number,
  /**
   * Initial zoom level.
   */
  initStartZoom: PropTypes.number,
  /**
   * Initial GeoJSON features to load on map.
   */
  initFeatures: PropTypes.array,
  /**
   * Initial map bounds.
   */
  initBounds: PropTypes.array,
  /**
   * Initial search bar placeholder.
   */
  initAddress: PropTypes.string,
  /**
   * Mapbox layer style.
   */
  layer: PropTypes.string,
  /**
   * Map projection type.
   */
  projection: PropTypes.string,
  /**
   * Additional custom map styles.
   */
  mapStyles: PropTypes.object,
  /**
   * Default zoom level.
   */
  defaultZoom: PropTypes.number,
  /**
   * Whether to display current zoom level.
   */
  showZoom: PropTypes.bool,
  /**
   * Enable geocoder search bar.
   */
  hasSearchBar: PropTypes.bool,
  /**
   * Enable clear search functionality.
   */
  hasClear: PropTypes.bool,
  /**
   * Auto-focus on search bar.
   */
  autoFocus: PropTypes.bool,
  /**
   * Enable map marker.
   */
  hasMarker: PropTypes.bool,
  /**
   * Enable marker popup.
   */
  hasMarkerPopup: PropTypes.bool,
  /**
   * Allow marker to be moved.
   */
  hasMarkerMovable: PropTypes.bool,
  /**
   * Custom marker configuration.
   */
  markerOptions: PropTypes.object,
  /**
   * Custom HTML content for the popup.
   */
  popupContent: PropTypes.node,
  /**
   * Enable navigation controls.
   */
  hasNavigation: PropTypes.bool,
  /**
   * Enable fullscreen toggle.
   */
  hasFullScreen: PropTypes.bool,
  /**
   * Enable geolocate control.
   */
  hasGeolocate: PropTypes.bool,
  /**
   * Display coordinate information bar (lat, lon, elevation, zoom).
   */
  hasCoordBar: PropTypes.bool,
  /**
   * Display coordinates of the cursor on the map.
   */
  showCursorCoords: PropTypes.bool,
  /**
   * Enable polygon drawing.
   */
  hasDrawing: PropTypes.bool,
  /**
   * Enable freehand drawing.
   */
  hasFreehand: PropTypes.bool,
  /**
   * Enable drawing only one polygon.
   */
  hasSinglePolygon: PropTypes.bool,
  /**
   * Enable shapefile import.
   */
  hasImport: PropTypes.bool,
  /**
   * Enable elevation data.
   */
  hasElevation: PropTypes.bool,
  /**
   * Enable help modal.
   */
  hasHelp: PropTypes.bool,
  /**
   * Additional help content.
   */
  otherHelp: PropTypes.node,
  /**
   * Enable scroll zoom.
   */
  scrollZoom: PropTypes.bool,
  /**
   * Enable map rotation.
   */
  dragRotate: PropTypes.bool,
  /**
   * Enable map panning.
   */
  dragPan: PropTypes.bool,
  /**
   * Enable keyboard navigation.
   */
  keyboard: PropTypes.bool,
  /**
   * Enable double-click zoom.
   */
  doubleClickZoom: PropTypes.bool,
  /**
   * Enable touch zoom and rotate.
   */
  touchZoomRotate: PropTypes.bool,
  /**
   * Automatically fit map to drawn polygons.
   */
  fitMapToPolygons: PropTypes.bool,
  /**
   * Automatically fit map to bounds.
   */
  fitBounds: PropTypes.bool,
  /**
   * Mapbox API access token.
   */
  mapboxToken: PropTypes.string,
};

import React, { useRef, useEffect, useState } from "react";
import mapboxgl from "mapbox-gl"; // eslint-disable-line import/no-webpack-loader-syntax
import PropTypes, { string } from "prop-types";
import styles from "./map.module.scss";
import boundaries from "./us_states-ca_ab-ca_on.json";
import "./mapbox-gl.css";

// source of us-canada.geojson:
// https://cartographyvectors.com/map/793-combined-us-canada-with-states-provinces

let hoveredStateId = null;
let selectedStateId = null;
let boundaryData = null;
let availableData = null;

const RegionSelectorMap = ({
  selectorFunction = () => {},
  selectedState = "",
  availableStates = [],
  initWidth = "400px",
  initHeight = "400px",
  initLon = -95,
  initLat = 40,
  initStartZoom = 2,
  mapboxToken,
}) => {
  const [hoveredStateName, setHoveredStateName] = useState("");
  const [mapLoaded, setMapLoaded] = useState(false);
  const [dataLoaded, setDataLoaded] = useState(false);
  const [mapError, setMapError] = useState(false);
  const map = useRef();
  const mapContainer = useRef();

  useEffect(() => {
    mapboxgl.accessToken = mapboxToken;
  }, [mapboxToken]);

  useEffect(() => () => {
    hoveredStateId = null;
    selectedStateId = null;
    boundaryData = null;
    availableData = null;
  }, []);

  useEffect(() => {
    if (!boundaryData) {
      const json = boundaries;
      boundaryData = json;
      availableData = {
        ...json,
        features: json.features.filter(
          (data) => availableStates.indexOf(data.properties.STATE_NAME) !== -1
        ),
      };
      console.log("Boundary data loaded:", boundaryData);
      console.log("Available data:", availableData);
      setDataLoaded(true);
    } else {
      availableData = {
        ...boundaryData,
        features: boundaryData.features.filter(
          (data) => availableStates.indexOf(data.properties.STATE_NAME) !== -1
        ),
      };
      console.log("Updated available data:", availableData);
      if (map.current) {
        const source = map.current.getSource("states");
        if (source) source.setData(availableData);
      }
      setDataLoaded(true);
    }
  }, [availableStates]);

  useEffect(() => {
    if (mapLoaded && selectedState) {
      map.current.setFeatureState(
        { source: "states", id: selectedStateId },
        { click: false }
      );
      let selectedFeature = boundaryData.features.filter(
        (el) => el.properties.STATE_NAME === selectedState
      );
      if (selectedFeature.length > 0) {
        selectedStateId = selectedFeature[0].id;
        selectedFeature = selectedFeature[0];
        selectorFunction(selectedFeature);
      } else {
        selectedStateId = null;
        selectorFunction({});
      }
      map.current.setFeatureState(
        { source: "states", id: selectedStateId },
        { click: true }
      );
    }
  }, [selectedState, mapLoaded, selectorFunction]);

  useEffect(() => {
    if (dataLoaded) {
      console.log("Initializing map");
      var Map = new mapboxgl.Map({
        container: mapContainer.current,
        style: "mapbox://styles/mapbox/streets-v12",
        center: [initLon, initLat],
        zoom: initStartZoom,
        minZoom: 2,
        maxZoom: 5,
        projection: "albers",
      });
      map.current = Map;

      map.current.on("load", () => {
        console.log("Map loaded");
        map.current.addSource("states", {
          type: "geojson",
          data: availableData,
        });

        // Add state fills layer
        map.current.addLayer({
          id: "state-fills",
          type: "fill",
          source: "states",
          layout: {},
          paint: {
            "fill-color": [
              "case",
              ["boolean", ["feature-state", "click"], false],
              "#000",
              "#ccc",
            ],
            "fill-opacity": [
              "case",
              ["boolean", ["feature-state", "hover"], false],
              0.9,
              0.5,
            ],
          },
        });
        map.current.addLayer({
          id: "state-borders",
          type: "line",
          source: "states",
          layout: {},
          paint: {
            "line-color": "#000",
            "line-width": 1,
          },
        });

        // Add hover event listeners
        map.current.on("mousemove", "state-fills", (e) => {
          if (e.features.length > 0) {
            if (hoveredStateId !== null) {
              map.current.setFeatureState(
                { source: "states", id: hoveredStateId },
                { hover: false }
              );
            }
            hoveredStateId = e.features[0].id;
            setHoveredStateName(e.features[0].properties.STATE_NAME);
            map.current.setFeatureState(
              { source: "states", id: hoveredStateId },
              { hover: true }
            );
          }
        });

        map.current.on("mouseleave", "state-fills", () => {
          if (hoveredStateId !== null) {
            map.current.setFeatureState(
              { source: "states", id: hoveredStateId },
              { hover: false }
            );
          }
          hoveredStateId = null;
          setHoveredStateName("");
        });

        // Add click event listener
        map.current.on("click", "state-fills", (e) => {
          if (e.features.length > 0) {
            const clickedState = e.features[0];
            selectorFunction(clickedState);
            if (selectedStateId !== null) {
              map.current.setFeatureState(
                { source: "states", id: selectedStateId },
                { click: false }
              );
            }
            selectedStateId = clickedState.id;
            map.current.setFeatureState(
              { source: "states", id: selectedStateId },
              { click: true }
            );
          }
        });

        // Change cursor to pointer when hovering over states
        map.current.on("mouseenter", "state-fills", () => {
          map.current.getCanvas().style.cursor = "pointer";
        });

        map.current.on("mouseleave", "state-fills", () => {
          map.current.getCanvas().style.cursor = "";
        });

        if (!mapLoaded) setMapLoaded(true);
      });

      map.current.on("error", (e) => {
        console.error("Map load error:", e);
        setMapError(true);
        setMapLoaded(true);
      });

      const loadTimeout = setTimeout(() => {
        if (!mapLoaded) {
          console.warn("Map load timeout");
          setMapLoaded(true);
        }
      }, 5000);

      return () => clearTimeout(loadTimeout);
    }
  }, [dataLoaded, initLon, initLat, initStartZoom]);

  return (
    <>
      {!mapLoaded && !mapError && (
        <div className={styles.loadingContainer}>
          <div className={styles.loading}>Loading . . .</div>
        </div>
      )}
      {mapError && (
        <div className={styles.errorContainer}>
          <div className={styles.error}>Error loading map</div>
        </div>
      )}
      <div className={styles.wrapper}>
        <div className={styles.container}>
          <div
            id="map"
            ref={mapContainer}
            className={styles.map}
            style={{ width: initWidth, height: initHeight }}
          />
        </div>
        {hoveredStateId && (
          <div className={styles.infobar}>
            <ul>
              <li>{`${hoveredStateName}`}</li>
            </ul>
          </div>
        )}
      </div>
    </>
  );
};

RegionSelectorMap.propTypes = {
  /**
   * callback function to set the selected region's object as its value
   */
  selectorFunction: PropTypes.func,
  /**
   * initial selected state to highlight on the map
   */
  selectedState: PropTypes.string,
  /**
   * available states that will be rendered on map
   */
  availableStates: PropTypes.arrayOf(string),
  /**
   * map width in css format string
   */
  initWidth: PropTypes.string,
  /**
   * map height in css format string
   */
  initHeight: PropTypes.string,
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
   * mapbox token
   */
  mapboxToken: PropTypes.string,
};

export { RegionSelectorMap };

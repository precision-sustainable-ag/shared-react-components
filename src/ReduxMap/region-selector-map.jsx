/* eslint-disable react/prop-types */
import React, { useEffect, useState } from "react";
import styles from "./assets/styles/map.module.scss";
import boundaries from "./data/us_states-ca_ab-ca_on.json";
import "./assets/styles/mapbox-gl.css";
import ReduxMap from "./reduxmap";

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
  const [mapLayersLoaded, setMapLayersLoaded] = useState(false);
  const [mapInstance, setMapInstance] = useState(null);

  // Update availableData and update map source data when availableStates change
  useEffect(() => {
    boundaryData = boundaries;
    availableData = {
      ...boundaries,
      features: boundaryData.features.filter(
        (data) => availableStates.indexOf(data.properties.STATE_NAME) !== -1
      ),
    };
    setDataLoaded(true);

    if (mapInstance) {
      const source = mapInstance.getSource("states");
      if (source) source.setData(availableData);
    }
  }, [availableStates]);

  // Whenever the selectedState prop is changed, automatically select it on the map.
  useEffect(() => {
    if (!mapLayersLoaded || !dataLoaded || !boundaryData) return;

    // If there is a selected state, unselect it first
    if (selectedStateId) {
      mapInstance.setFeatureState(
        { source: "states", id: selectedStateId },
        { click: false }
      );
    }

    const selectedFeature = boundaryData.features.find(
      (el) => el.properties.STATE_NAME === selectedState
    );

    if (selectedFeature) {
      selectedStateId = selectedFeature.id;
      selectorFunction(selectedFeature);
    } else {
      selectedStateId = null;
      selectorFunction({});
    }

    // Highlight the selected state
    mapInstance.setFeatureState(
      { source: "states", id: selectedStateId },
      { click: true }
    );
  }, [selectedState, mapLayersLoaded, dataLoaded]);

  // Add map layers and event handlers
  useEffect(() => {
    if (!mapInstance || !mapLoaded || !dataLoaded) return;

    // Remove existing layers and sources if they exist
    if (mapInstance.getLayer("state-fills")) mapInstance.removeLayer("state-fills");
    if (mapInstance.getLayer("state-borders")) mapInstance.removeLayer("state-borders");
    if (mapInstance.getSource("states")) mapInstance.removeSource("states");

    // Add a data source containing GeoJSON data.
    mapInstance.addSource("states", {
      type: "geojson",
      data: availableData,
    });

    // The feature-state dependent fill-opacity expression will render the hover effect
    // when a feature's hover state is set to true.
    mapInstance.addLayer({
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

    mapInstance.addLayer({
      id: "state-borders",
      type: "line",
      source: "states",
      layout: {},
      paint: {
        "line-color": "#000",
        "line-width": 1,
      },
    });

    // When the user moves their mouse over the state-fill layer, we'll update the
    // feature state for the feature under the mouse.
    mapInstance.on("mousemove", "state-fills", (e) => {
      if (e.features.length > 0) {
        if (hoveredStateId !== null) {
          mapInstance.setFeatureState(
            { source: "states", id: hoveredStateId },
            { hover: false }
          );
        }
        hoveredStateId = e.features[0].id;
        setHoveredStateName(e.features[0].properties.STATE_NAME);
        mapInstance.setFeatureState(
          { source: "states", id: hoveredStateId },
          { hover: true }
        );
      }
    });

    mapInstance.on("mouseleave", "state-fills", () => {
      if (hoveredStateId !== null) {
        mapInstance.setFeatureState(
          { source: "states", id: hoveredStateId },
          { hover: false }
        );
      }
      hoveredStateId = null;
      setHoveredStateName("");
    });

    mapInstance.on("click", "state-fills", (e) => {
      mapInstance.setFeatureState(
        { source: "states", id: selectedStateId },
        { click: false }
      );
      selectedStateId = e.features[0].id;

      if (boundaryData && boundaryData.features) {
        let selectedFeature = boundaryData.features.filter(
          (el) => el.id === selectedStateId
        );
        if (selectedFeature.length > 0) {
          selectedFeature = selectedFeature[0];
          selectorFunction(selectedFeature);
        }
      }
      mapInstance.setFeatureState(
        { source: "states", id: selectedStateId },
        { click: true }
      );
    });

    // Change the cursor to a pointer when the mouse is over the places layer.
    mapInstance.on("mouseenter", "state-fills", () => {
      mapInstance.getCanvas().style.cursor = "pointer";
      mapInstance.style.cursor = "pointer";
    });

    // Change it back to a pointer when it leaves.
    mapInstance.on("mouseleave", "state-fills", () => {
      mapInstance.getCanvas().style.cursor = "";
    });

    // Set the mapLayersLoaded status as true when all the layers are added
    setMapLayersLoaded(true);
  }, [mapInstance, mapLoaded, dataLoaded]);

  // Set 'mapLoaded' as true when map and its styles are loaded
  useEffect(() => {
    if (!mapInstance) return;

    mapInstance.on("load", () => setMapLoaded(true));
  }, [mapInstance]);

  return (
    <div className={styles.mapWrapper}>
      <div className={styles.container}>
        {(!mapLoaded || !mapLayersLoaded) && (
          <div className={styles.loadingContainer}>
            <div className={styles.loading}>Loading . . .</div>
          </div>
        )}
        <ReduxMap
          setMap={(map) => {
            setMapInstance(map);
          }}
          initWidth={initWidth}
          initHeight={initHeight}
          initLat={initLat}
          initLon={initLon}
          initStartZoom={initStartZoom}
          padding="20px"
          layer="mapbox://styles/mapbox/streets-v12"
          projection="albers"
          fitBounds
          mapStyles={{ borderRadius: "5px" }}
          mapboxToken={mapboxToken}
        />
        {hoveredStateId && (
          <div className={`${styles.infobar} ${styles.stateinfobar}`}>
            <ul>
              <li>{`${hoveredStateName}`}</li>
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

export { RegionSelectorMap };

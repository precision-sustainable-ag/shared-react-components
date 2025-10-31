import { useEffect, useRef, useState } from "react";
import turf from "turf";
import chroma from "chroma-js";
import mapboxgl from "mapbox-gl";

/**
 * Custom hook to process raster data as a colored grid on a Mapbox map.
 *
 * @param {Object} params - Configuration options for the hook.
 * @param {React.RefObject} params.map - Reference to the Mapbox map instance.
 * @param {Object} params.initRasterObject - Initial raster object containing the geojson object.
 * @param {string[]} params.rasterColors - Color scale range used to map raster values to colors.
 * @param {string} params.unit - Unit of the raster values.
 * @param {string} params.material - Name of the raster material (used as the source/layer ID in Mapbox).
 * @param {Function} params.setRasterColorSteps - Setter function to update the raster color legend in the parent component.
 * @param {number} params.color_steps - Number of steps in the map legend.
 */
const useRasterData = ({
  map,
  initRasterObject = {},
  rasterColors = ["red", "green"],
  unit = "kg/ha",
  material = "biomass",
  setRasterColorSteps,
  color_steps = 7,
}) => {

  const polygonsRef = useRef(turf.featureCollection([]));
  const [geojsonData, setGeojsonData] = useState(null);
  const [isMapLoaded, setIsMapLoaded] = useState(false);

  useEffect(() => {
    if (initRasterObject && initRasterObject.features && initRasterObject.features.length > 0) {
      setGeojsonData(initRasterObject);
    }
  }, [initRasterObject]);

  // Use effect for checking if styles are loaded before adding raster layer on map
  useEffect(() => {
    if (!map.current) return;

    const handleMapLoad = () => {
      setIsMapLoaded(true);
    };

    // Check if map is already loaded
    if (map.current.isStyleLoaded()) {
      setIsMapLoaded(true);
    } else {
      map.current.on("load", handleMapLoad);
    }

    return () => {
      if (map.current) {
        map.current.off("load", handleMapLoad);
      }
    };
  }, [map.current]);

  useEffect(() => {
    if (!map.current || !geojsonData || !isMapLoaded) return;
    if (geojsonData.features && geojsonData.features.length > 0) {

      const f = unit === "lb/ac" ? 0.892179 : 1;
      let biomassMin, biomassMax;
      if (geojsonData.properties) {
        biomassMin = f * geojsonData.properties.biomass_min;
        biomassMax = f * geojsonData.properties.biomass_max;
      } else {
        // Calculate from features if not provided
        const values = geojsonData.features
          .map(feat => f * feat.properties.value)
          .filter(val => val > 0);
        biomassMin = Math.min(...values);
        biomassMax = Math.max(...values);
      }
      const range = biomassMax - biomassMin;

      let scale = chroma.scale(rasterColors);

      const featuresWithColors = geojsonData.features.map(feature => {
      const convertedValue = f * feature.properties.value;
      const normalizedValue = range > 0 
        ? (convertedValue - biomassMin) / range 
        : 0;
      
      return {
        ...feature,
        properties: {
          ...feature.properties,
          value: convertedValue,
          color: scale(normalizedValue).hex()
        }
      };
    });

    const processedGeojson = {
      type: "FeatureCollection",
      features: featuresWithColors
    };

    polygonsRef.current = processedGeojson;

      // Setting up the color legend
      var colorValues = [];
      const step = (biomassMax - biomassMin) / (color_steps - 1);

      // Determine appropriate decimal precision based on range
      const getDecimalPlaces = (range) => {
        if (range < 1) return 2;
        if (range < 10) return 1;
        if (range < 100) return 1;
        return 0;
      };

      const decimalPlaces = getDecimalPlaces(range);

      for (var i = biomassMin; i <= biomassMax; i = i + step) {
        colorValues.push(parseFloat(i.toFixed(decimalPlaces)));
      }
      var rasterColorsVals = colorValues.map(function (e, i) {
        const normalizedBiomassVal = range ? (e - biomassMin) / range : null;
        const colorV = range ? scale(normalizedBiomassVal).hex() : null;
        return [e, colorV];
      });

      // Update rasterColorSteps in parent component
      setRasterColorSteps(rasterColorsVals);

      // Update map source and layer with the pixel polygon
      if (!map.current.getSource(`${material}Polygons`)) {
        map.current.addSource(`${material}Polygons`, {
          type: "geojson",
          data: processedGeojson,
        });
        map.current.addLayer({
          id: `${material}Polygons`,
          type: "fill",
          source: `${material}Polygons`,
          paint: {
            "fill-opacity": 0.5,
            "fill-color": [
              "case",
              ["!=", ["get", "color"], null],
              ["get", "color"],
              "transparent",
            ],
          },
        });
      } else {
        map.current
          .getSource(`${material}Polygons`)
          .setData(processedGeojson);
      }

      const handleClick = (e) => {
        if (!e.features?.length) return;

        const coords = e.features[0].geometry.coordinates.slice();
        const val = Math.round(e.features[0].properties.value, 0);

        new mapboxgl.Popup({ closeButton: false, closeOnClick: true })
          .setLngLat([
            (coords[0][0][0] + coords[0][2][0]) / 2,
            (coords[0][0][1] + coords[0][2][1]) / 2,
          ])
          .setHTML(`<div>${material} value: ${val} ${unit}</div>`)
          .addTo(map.current);
      };

      map.current.on("click", `${material}Polygons`, handleClick);

      return () => {
        if (map.current.getLayer(`${material}Polygons`)) {
          map.current.off("click", `${material}Polygons`, handleClick);
        }
      };
    }
  }, [map.current, geojsonData, unit, material, isMapLoaded]);
};

export default useRasterData;

import { featureCollection } from '@turf/helpers';
import chroma from 'chroma-js';
import mapboxgl from 'mapbox-gl';
import { useEffect, useRef, useState } from 'react';

/**
 * Custom hook to process raster data as a colored grid on a Mapbox map.
 *
 * @param {Object} params - Configuration options for the hook.
 * @param {React.RefObject} params.map - Reference to the Mapbox map instance.
 * @param {Object} params.initRasterObject - Initial raster object containing the geojson object.
 * @param {string} params.valueKey - The feature property key to read the raster value from.
 * @param {string[]} params.rasterColors - Color scale range used to map raster values to colors.
 * @param {string} params.unit - Unit of the raster values.
 * @param {string} params.material - Name of the raster material (used as the source/layer ID in Mapbox).
 * @param {Function} params.setRasterColorSteps - Setter function to update the raster color legend in the parent component.
 * @param {number} params.color_steps - Number of steps in the map legend.
 * @param {Object} params.discreteLabels - Optional mapping of discrete raster values to human-readable labels, with an optional `_colors` key for pinned colors.
 * @param {string} params.secondaryUnit - Optional unit label for the multiplier-derived secondary value.
 * @param {number} params.secondaryUnitMultiplier - Factor applied to each value to show a secondary value in the popup.
 * @param {number} params.roundTo - Optional increment to round legend/popup values to (e.g. 0.01, 0.1, 1, 5, 10). Falls back to range-based precision when not set.
 */
const useRasterData = ({
  map,
  initRasterObject = {},
  valueKey = 'value',
  rasterColors = ['red', 'green'],
  unit = 'kg/ha',
  material = 'biomass',
  setRasterColorSteps,
  color_steps = 7,
  discreteLabels = null,
  secondaryUnit,
  secondaryUnitMultiplier,
  roundTo,
}) => {
  const polygonsRef = useRef(featureCollection([]));
  const [geojsonData, setGeojsonData] = useState(null);
  const [isMapLoaded, setIsMapLoaded] = useState(false);

  useEffect(() => {
    setGeojsonData(null);
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
      map.current.on('load', handleMapLoad);
    }

    return () => {
      if (map.current) {
        map.current.off('load', handleMapLoad);
      }
    };
  }, [map.current]);

  const removeLayerAndSource = (layerId) => {
    if (!map.current) return;
    if (map.current.getLayer(layerId)) {
      map.current.removeLayer(layerId);
    }
    if (map.current.getSource(layerId)) {
      map.current.removeSource(layerId);
    }
  };

  useEffect(() => {
    if (!map.current || !geojsonData || !isMapLoaded) return;
    if (!geojsonData.features || geojsonData.features.length === 0) return;

    const layerId = `${material}Polygons_${valueKey}`;

    if (discreteLabels) {
    const knownValues = Object.keys(discreteLabels)
      .filter((k) => k !== '_colors')
      .map(Number)
      .sort((a, b) => a - b);

    const pinnedColors = discreteLabels._colors || {};

    // Auto-assign colors from the rasterColors scale for values without a pinned color.
    const scale = chroma.scale(rasterColors).colors(knownValues.length);
    const valueColorMap = {};
    knownValues.forEach((val, idx) => {
      valueColorMap[val] = pinnedColors[val] || scale[idx];
    });

    const featuresWithColors = geojsonData.features.map((feature) => {
      const rawVal = feature.properties[valueKey];
      const discreteVal = Math.round(rawVal);
      const color = valueColorMap[discreteVal] || 'transparent';
      return {
        ...feature,
        properties: {
          ...feature.properties,
          value: discreteVal,
          color,
        },
      };
    });

    const processedGeojson = {
      type: 'FeatureCollection',
      features: featuresWithColors,
    };
    polygonsRef.current = processedGeojson;

    const rasterColorsVals = knownValues.map((val) => [val, valueColorMap[val], discreteLabels[val]]);
    setRasterColorSteps(rasterColorsVals);

    if (!map.current.getSource(layerId)) {
      map.current.addSource(layerId, {
        type: 'geojson',
        data: processedGeojson,
      });
      map.current.addLayer({
        id: layerId,
        type: 'fill',
        source: layerId,
        paint: {
          'fill-opacity': 0.5,
          'fill-color': ['case', ['!=', ['get', 'color'], null], ['get', 'color'], 'transparent'],
        },
      });
    } else {
      map.current.getSource(layerId).setData(processedGeojson);
    }

    const handleClick = (e) => {
      if (!e.features?.length) return;

      const val = e.features[0].properties[valueKey];
      const label = discreteLabels[val] ?? val;

      new mapboxgl.Popup({ closeButton: false, closeOnClick: true })
        .setLngLat(e.lngLat)
        .setHTML(`<div>${material}: ${label}</div>`)
        .addTo(map.current);
    };

    map.current.on('click', layerId, handleClick);

    return () => {
      if (map.current) {
        map.current.off('click', layerId, handleClick);
        removeLayerAndSource(layerId);
      }
    };
    } else {
      // const f = unit === "lb/ac" ? 0.892179 : 1;
      const f = 1;
      let biomassMin, biomassMax;
      if (geojsonData.properties) {
        biomassMin = f * geojsonData.properties.biomass_min;
        biomassMax = f * geojsonData.properties.biomass_max;
      } else {
        // Calculate from features if not provided
        const values = geojsonData.features
          .map((feat) => f * feat.properties[valueKey])
          .filter((val) => val > 0);
        biomassMin = Math.min(...values);
        biomassMax = Math.max(...values);
      }
      const range = biomassMax - biomassMin;

      const scale = chroma.scale(rasterColors);

      const featuresWithColors = geojsonData.features.map((feature) => {
        const convertedValue = f * feature.properties[valueKey];
        const normalizedValue = range > 0 ? (convertedValue - biomassMin) / range : 0;

        return {
          ...feature,
          properties: {
            ...feature.properties,
            value: convertedValue,
            color: scale(normalizedValue).hex(),
          },
        };
      });

      const processedGeojson = {
        type: 'FeatureCollection',
        features: featuresWithColors,
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

      // Number of decimals implied by an increment (0.01 -> 2, 5 -> 0, 10 -> 0).
      const decimalsForStep = (increment) => {
        const [, fraction = ''] = String(increment).split('.');
        return fraction.length;
      };

      // Rounds a value to the nearest `roundTo` increment when set otherwise falls back to the range-based decimal precision.
      const hasRoundTo = typeof roundTo === 'number' && Number.isFinite(roundTo) && roundTo > 0;
      const roundValue = (value) => {
        if (hasRoundTo) {
          const rounded = Math.round(value / roundTo) * roundTo;
          return parseFloat(rounded.toFixed(decimalsForStep(roundTo)));
        }
        return parseFloat(value.toFixed(decimalPlaces));
      };

      var rasterColorsVals;
      if (range > 0) {
        for (var i = biomassMin; i < biomassMax; i = i + step) {
          colorValues.push(roundValue(i));
        }
        colorValues[colorValues.length - 1] = roundValue(biomassMax);

        rasterColorsVals = colorValues.map((e) => {
          const normalizedBiomassVal = (e - biomassMin) / range;
          return [e, scale(normalizedBiomassVal).hex()];
        });
      } else {
        // Single uniform value (e.g. fixed target rate): render one legend entry
        rasterColorsVals = [[roundValue(biomassMax), scale(0).hex()]];
      }

      // Update rasterColorSteps in parent component
      setRasterColorSteps(rasterColorsVals);

      // Update map source and layer with the pixel polygon
      if (!map.current.getSource(layerId)) {
        map.current.addSource(layerId, {
          type: 'geojson',
          data: processedGeojson,
        });
        map.current.addLayer({
          id: layerId,
          type: 'fill',
          source: layerId,
          paint: {
            'fill-opacity': 0.5,
            'fill-color': ['case', ['!=', ['get', 'color'], null], ['get', 'color'], 'transparent'],
          },
        });
      } else {
        map.current.getSource(layerId).setData(processedGeojson);
      }

      const handleClick = (e) => {
        if (!e.features?.length) return;

        const val = roundValue(e.features[0].properties[valueKey]);

        let secondaryLine = '';
        if (typeof secondaryUnitMultiplier === 'number' && Number.isFinite(secondaryUnitMultiplier)) {
          const secondaryVal = parseFloat((val * secondaryUnitMultiplier).toFixed(0));
          secondaryLine = `<div>OR ${secondaryVal} ${secondaryUnit ?? ''}</div>`;
        }

        new mapboxgl.Popup({ closeButton: false, closeOnClick: true })
          .setLngLat(e.lngLat)
          .setHTML(`<div>${material} value: ${val} ${unit}</div>${secondaryLine}`)
          .addTo(map.current);
      };

      map.current.on('click', layerId, handleClick);

      return () => {
        if (map.current) {
          map.current.off('click', layerId, handleClick);
          removeLayerAndSource(layerId);
        }
      };
    }
  }, [map.current, geojsonData, unit, material, isMapLoaded, discreteLabels, valueKey, secondaryUnitMultiplier, secondaryUnit, roundTo]);
};

export default useRasterData;

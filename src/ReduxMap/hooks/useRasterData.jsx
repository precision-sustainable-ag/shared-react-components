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
 */
const useRasterData = ({
  map,
  initRasterObject = {},
  valueKey = 'value',
  scaleType = 'linear',
  rasterColors = ['red', 'green'],
  unit = 'kg/ha',
  material = 'biomass',
  setRasterColorSteps,
  color_steps = 7,
  discreteLabels = null,
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
    if (map.current.getLayer(`${layerId}-points`)) {
      map.current.removeLayer(`${layerId}-points`);
    }
    if (map.current.getLayer(layerId)) {
      map.current.removeLayer(layerId);
    }
    if (map.current.getSource(layerId)) {
      map.current.removeSource(layerId);
    }
  };

  // Adds a fill layer for polygon features and a circle layer for point features,
  // both colored by the per-feature `color` property computed from the gradient.
  const addRasterLayers = (layerId, processedGeojson) => {
    const colorExpression = [
      'case',
      ['!=', ['get', 'color'], null],
      ['get', 'color'],
      'transparent',
    ];

    if (!map.current.getSource(layerId)) {
      map.current.addSource(layerId, {
        type: 'geojson',
        data: processedGeojson,
      });
      map.current.addLayer({
        id: layerId,
        type: 'fill',
        source: layerId,
        filter: ['==', ['geometry-type'], 'Polygon'],
        paint: {
          'fill-opacity': 0.5,
          'fill-color': colorExpression,
        },
      });
      map.current.addLayer({
        id: `${layerId}-points`,
        type: 'circle',
        source: layerId,
        filter: ['==', ['geometry-type'], 'Point'],
        paint: {
          // Scale circles down as the map zooms out so dense point sets stay readable
          'circle-radius': ['interpolate', ['linear'], ['zoom'], 10, 1, 14, 2.5, 17, 6],
          'circle-color': colorExpression,
        },
      });
    } else {
      map.current.getSource(layerId).setData(processedGeojson);
    }
  };

  // Returns the popup anchor for a clicked feature (points vs. polygon cells)
  const getPopupLngLat = (feature) => {
    const coords = feature.geometry.coordinates.slice();
    if (feature.geometry.type === 'Point') return coords;
    return [(coords[0][0][0] + coords[0][2][0]) / 2, (coords[0][0][1] + coords[0][2][1]) / 2];
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

    addRasterLayers(layerId, processedGeojson);

    const handleClick = (e) => {
      if (!e.features?.length) return;

      const val = e.features[0].properties[valueKey];
      const label = discreteLabels[val] ?? val;

      new mapboxgl.Popup({ closeButton: false, closeOnClick: true })
        .setLngLat(getPopupLngLat(e.features[0]))
        .setHTML(`<div>${material}: ${label}</div>`)
        .addTo(map.current);
    };

    map.current.on('click', layerId, handleClick);
    map.current.on('click', `${layerId}-points`, handleClick);

    return () => {
      if (map.current) {
        map.current.off('click', layerId, handleClick);
        map.current.off('click', `${layerId}-points`, handleClick);
        removeLayerAndSource(layerId);
      }
    };
    } else {
      // const f = unit === "lb/ac" ? 0.892179 : 1;
      const f = 1;
      const sortedValues = geojsonData.features
        .map((feat) => f * feat.properties[valueKey])
        .filter((val) => val > 0)
        .sort((a, b) => a - b);

      let biomassMin, biomassMax;
      if (geojsonData.properties) {
        biomassMin = f * geojsonData.properties.biomass_min;
        biomassMax = f * geojsonData.properties.biomass_max;
      } else {
              biomassMin = sortedValues[0];
              biomassMax = sortedValues[sortedValues.length - 1];
      }
      const range = biomassMax - biomassMin;

      // No usable values for this valueKey
      if (!Number.isFinite(biomassMin) || !Number.isFinite(biomassMax)) return undefined;

      const scale = chroma.scale(rasterColors);

      // 'quantile' colors by the value's rank in the data so skewed distributions
      // and outliers still spread across the full ramp; 'linear' colors by value.
      const rankDenominator = Math.max(sortedValues.length - 1, 1);
      const firstIndexByValue = new Map();
      if (scaleType === 'quantile') {
        sortedValues.forEach((value, index) => {
          if (!firstIndexByValue.has(value)) firstIndexByValue.set(value, index);
        });
      }
      const normalize = (value) => {
        if (scaleType === 'quantile' && sortedValues.length) {
          if (firstIndexByValue.has(value)) return firstIndexByValue.get(value) / rankDenominator;
          return value <= sortedValues[0] ? 0 : 1;
        }
        return range > 0 ? (value - biomassMin) / range : 0;
      };

      const featuresWithColors = geojsonData.features.map((feature) => {
        const convertedValue = f * feature.properties[valueKey];
        return {
          ...feature,
          properties: {
            ...feature.properties,
            value: convertedValue,
            color: scale(normalize(convertedValue)).hex(),
          },
        };
      });

      const processedGeojson = {
        type: 'FeatureCollection',
        features: featuresWithColors,
      };

      polygonsRef.current = processedGeojson;

      // Determine appropriate decimal precision based on range
      const getDecimalPlaces = (range) => {
        if (range < 1) return 2;
        if (range < 10) return 1;
        if (range < 100) return 1;
        return 0;
      };
      const decimalPlaces = getDecimalPlaces(range);

      // Setting up the color legend
      let rasterColorsVals;
      if (scaleType === 'quantile' && sortedValues.length) {
        // Legend steps at evenly spaced ranks: colors are linear, values show the
        // actual (non-linear) quantiles of the data
        rasterColorsVals = [...Array(color_steps).keys()].map((idx) => {
          const q = idx / (color_steps - 1);
          const value = sortedValues[Math.round((sortedValues.length - 1) * q)];
          return [parseFloat(value.toFixed(decimalPlaces)), scale(q).hex()];
        });
      } else {
        const colorValues = [];
        const step = (biomassMax - biomassMin) / (color_steps - 1);
        for (let i = biomassMin; i < biomassMax; i += step) {
          colorValues.push(parseFloat(i.toFixed(decimalPlaces)));
        }
        colorValues[colorValues.length - 1] = parseFloat(biomassMax.toFixed(decimalPlaces));

        rasterColorsVals = colorValues.map((e) => {
          const normalizedBiomassVal = range ? (e - biomassMin) / range : null;
          const colorV = range ? scale(normalizedBiomassVal).hex() : null;
          return [e, colorV];
        });
      }

      // Update rasterColorSteps in parent component
      setRasterColorSteps(rasterColorsVals);

      // Update map source and layers with the pixel polygons and points
      addRasterLayers(layerId, processedGeojson);

      const handleClick = (e) => {
        if (!e.features?.length) return;

        const val = parseFloat(e.features[0].properties[valueKey].toFixed(decimalPlaces));

        new mapboxgl.Popup({ closeButton: false, closeOnClick: true })
          .setLngLat(getPopupLngLat(e.features[0]))
          .setHTML(`<div>${material} value: ${val} ${unit}</div>`)
          .addTo(map.current);
      };

      map.current.on('click', layerId, handleClick);
      map.current.on('click', `${layerId}-points`, handleClick);

      return () => {
        if (map.current) {
          map.current.off('click', layerId, handleClick);
          map.current.off('click', `${layerId}-points`, handleClick);
          removeLayerAndSource(layerId);
        }
      };
    }
  }, [map.current, geojsonData, unit, material, isMapLoaded, discreteLabels, valueKey, scaleType]);
};

export default useRasterData;

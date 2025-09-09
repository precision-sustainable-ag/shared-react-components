import { useEffect, useRef, useState } from "react";
import turf from "turf";
import chroma from "chroma-js";
import mapboxgl from "mapbox-gl";

const useRasterData = ({
  map,
  initRasterObject = {},
  rasterColors = ["red", "green"],
  unit = "kg/ha",
  material = "biomass",
  setRasterColorSteps,
}) => {
  const NR_COLOR_STEPS = 7;

  const polygonsRef = useRef(turf.featureCollection([]));

  const [biomassData, setBiomassData] = useState(null);
  const [bbox, setBbox] = useState(null);
  const [isMapLoaded, setIsMapLoaded] = useState(false);

  const transpose = (m) => m[0].map((x, i) => m.map((x) => x[i]));

  useEffect(() => {
    if (initRasterObject?.data_array?.length > 0 && !biomassData) {
      setBiomassData(transpose(initRasterObject.data_array));
      setBbox(initRasterObject.bbox);
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
    if (!map.current || !biomassData || !bbox || !isMapLoaded) return;

    if (biomassData && biomassData.length > 0) {
      polygonsRef.current = turf.featureCollection([]);

      let flattenedBiomass = biomassData.flat().filter((el) => el !== 0);
      const f = unit === "lb/ac" ? 0.892179 : 1;
      const biomassMax = f * Math.max(...flattenedBiomass);
      const biomassMin = f * Math.min(...flattenedBiomass);
      const range = biomassMax - biomassMin;

      // Setting up pixel polygons
      const w = biomassData.length;
      const h = biomassData[0].length;
      const lon = bbox[0];
      const lat = bbox[1];
      const dLon = (bbox[2] - bbox[0]) / w;
      const dLat = (bbox[1] - bbox[3]) / h;

      let scale = chroma.scale(rasterColors);

      // Build turf polygons based on grid size and bbox
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
            polygonsRef.current.features.push(
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
                  color: normalizedBiomassVal
                    ? scale(normalizedBiomassVal).hex()
                    : null,
                }
              )
            );
        }
      }

      // Setting up the color legend
      var colorValues = [];
      const step = (biomassMax - biomassMin) / (NR_COLOR_STEPS - 1);
      for (var i = biomassMin; i <= biomassMax; i = i + step) {
        colorValues.push(Math.round(i / 10, 0) * 10);
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
          data: polygonsRef.current,
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
          .setData(polygonsRef.current);
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
  }, [map.current, biomassData, bbox, unit, material, isMapLoaded]);
};

export default useRasterData;

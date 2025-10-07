import { useEffect, useRef, useState } from "react";
import mapboxgl from "mapbox-gl";

const useMGRSgrid = ({ map, layer }) => {
  const [isMapLoaded, setIsMapLoaded] = useState(false);

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

    if (!map.current || !isMapLoaded || !layer) return;

    console.log(layer);

    if (!map.current.getSource(`mgrsGrid`)) {
      // Add the GeoJSON source
      map.current.addSource("mgrsGrid", {
        type: "geojson",
        data: layer,
      });

      // Add a fill layer to show the grid cells
      map.current.addLayer({
        id: "mgrsGrid",
        type: "fill",
        source: "mgrsGrid",
        paint: {
            "fill-opacity": 0.5,
            "fill-color": [
              "case",
              ["!=", ["get", "color"], null],
              ["get", "color"],
              "transparent",
            ],          },
      });
    } else {
      map.current.getSource(`mgrsGrid`).setData(layer);
    }

    const handleClick = (e) => {
      if (!e.features?.length) return;
      const val = e.features[0].properties.value;
      const mgrs_coord = e.features[0].properties.mgrs;
      new mapboxgl.Popup()
        .setLngLat(e.lngLat)
        .setHTML(`<b>Oats avg:</b> ${val} <br/> <b>MGRS Coord:</b> ${mgrs_coord}`)
        .addTo(map.current);
    };

    map.current.on("click", `mgrsGrid`, handleClick);

    return () => {
      if (map.current.getLayer(`mgrsGrid`)) {
        map.current.off("click", `mgrsGrid`, handleClick);
      }
    };
  }, [map.current, isMapLoaded, layer]);
};

export default useMGRSgrid;

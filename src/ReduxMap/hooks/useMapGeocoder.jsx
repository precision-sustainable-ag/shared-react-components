import { useCallback, useEffect, useRef } from "react";
import MapboxGeocoder from "@mapbox/mapbox-gl-geocoder";
import { coordinatesGeocoder } from "../utils/helpers";

/**
 * Custom hook to setup and manage a Mapbox Geocoder with event handling
 *
 * @param {Object} options - Configuration options for the geocoder
 * @param {Object} options.map - The Mapbox map instance
 * @param {string} options.MAPBOX_TOKEN - Mapbox API access token
 *
 * @param {number} [options.initLon] - Initial longitude for geocoder positioning
 * @param {number} [options.initLat] - Initial latitude for geocoder positioning
 * @param {string} [options.initAddress - Placeholder text for the search input
 * @param {number} [options.defaultZoom] - Default zoom level to apply after a search
 *
 * @param {boolean} [options.hasSearchBar] - Whether to display the search bar
 * @param {boolean} [options.hasClear] - Whether to enable clearing the search via right side click
 * @param {boolean} [options.hasDrawing] - Whether drawing tools are enabled on the map
 *
 * @param {Function} options.setLon - State setter for longitude coordinate
 * @param {Function} options.setLat - State setter for latitude coordinate
 * @param {Function} options.setZoom - State setter for map zoom level
 * @param {Function} options.setBounds - State setter for map bounds
 * @param {Function} options.setAddress - State setter for address details object
 * @param {Function} options.setFeatures - State setter for map features
 * @param {Function} options.setPolygonArea - State setter for polygon area calculations
 *
 * @param {Object} options.drawerRef - Ref to map drawing tools instance
 */
const useMapGeocoder = ({
  map,
  MAPBOX_TOKEN,
  initLon,
  initLat,
  initAddress = "Search for your address ...",
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
}) => {
  const geocoderRef = useRef(null);

  const deleteFeatures = useCallback(
    (gresult) => {
      if (gresult && hasDrawing && drawerRef?.current) {
        drawerRef.current.deleteAll();
        setPolygonArea(0);
        setFeatures([]);
      }
    },
    [hasDrawing, drawerRef, setPolygonArea, setFeatures]
  );

  useEffect(() => {
    if (!map.current || !hasSearchBar) return;

    const Geocoder = new MapboxGeocoder({
      placeholder: initAddress,
      localGeocoder: coordinatesGeocoder,
      marker: false,
      accessToken: MAPBOX_TOKEN,
      container: map.current,
      proximity: "ip",
      trackProximity: true,
      countries: "us",
    });
    geocoderRef.current = Geocoder;

    if (map && !map.current.hasControl(Geocoder))
      map.current.addControl(Geocoder, "top-left");

    Geocoder.on("result", (e) => {
      if (e?.result?.place_name) {
        deleteFeatures(e.result);
        setLat(e.result.center[1]);
        setLon(e.result.center[0]);
        setZoom(defaultZoom);
        map.current.setZoom(defaultZoom);
        setBounds(false);
      }
    });

    return () => {
      if (map && Geocoder && map.current.hasControl(Geocoder)) {
        map.current.removeControl(Geocoder);
      }
    };
  }, [map.current]);

  /**
   * Handles click and mousemove events for the Mapbox Geocoder searchbox.
   *
   * This effect attaches event listeners to the Mapbox Geocoder container (`.mapboxgl-ctrl-geocoder`).
   * When a user clicks within the last 20 pixels of the container's width, it triggers a reset of various states
   * including latitude, longitude, polygon area, and address details. The mousemove event toggles a CSS class
   * if the cursor is hovering near the right edge of the container.
   *
   * @effect
   * Attaches the `click` and `mousemove` event listeners to the Geocoder container when the component mounts,
   * and removes them when the component unmounts or the `map` dependency changes.
   */
  useEffect(() => {
    if (!map || !hasSearchBar) return;

    const geocoderContainer = document.querySelector(".mapboxgl-ctrl-geocoder");
    if (!geocoderContainer) return;

    const handleClick = (event) => {
      const target = event.currentTarget;
      const rect = target.getBoundingClientRect();
      const clickX = event.clientX - rect.left;
      if (hasClear && rect.width - clickX <= 20) {
        setLat(initLat);
        setLon(initLon);
        setPolygonArea(0);
        setAddress({
          fullAddress: "",
          city: "",
          county: "",
          state: "",
          stateCode: "",
          zipCode: "",
        });
        setFeatures([]);
        setBounds("conus");
      }
    };

    const handleMouseMove = (event) => {
      const target = event.currentTarget;
      const rect = target.getBoundingClientRect();
      const clickX = event.clientX - rect.left;
      target.classList.toggle("clearHovered", rect.width - clickX <= 20);
    };

    geocoderContainer.addEventListener("click", handleClick);
    geocoderContainer.addEventListener("mousemove", handleMouseMove);

    return () => {
      geocoderContainer.removeEventListener("click", handleClick);
      geocoderContainer.removeEventListener("mousemove", handleMouseMove);
    };
  }, [map.current]);
};

export default useMapGeocoder;

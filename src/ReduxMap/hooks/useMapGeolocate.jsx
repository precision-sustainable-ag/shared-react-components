import { GeolocateControl } from 'mapbox-gl';
import { useEffect } from 'react';

/**
 * A custom React hook that adds and manages a geolocate control for a Mapbox map.
 *
 * @param {Object} params - The configuration parameters for the geolocate hook
 * @param {Object} params.map - React ref containing the Mapbox map instance
 * @param {boolean} params.hasGeolocate - Flag to enable/disable geolocate control
 * @param {boolean} params.hasDrawing - Flag to indicate if drawing is enabled
 * @param {Function} params.setLat - Setter function for latitude
 * @param {Function} params.setLon - Setter function for longitude
 * @param {Function} params.setZoom - Setter function for zoom level
 * @param {Function} params.setBounds - Setter function for map bounds
 * @param {Function} params.setFeatures - Setter function for map features
 * @param {Function} params.setPolygonArea - Setter function for polygon area
 * @param {Object} params.drawerRef - React ref for the map drawing tool
 */
const useMapGeolocate = ({
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
}) => {
  useEffect(() => {
    if (!map.current || !hasGeolocate) return;

    const Geolocate = new GeolocateControl({ container: map.current });

    if (map && !map.current.hasControl(Geolocate)) map.current.addControl(Geolocate, 'top-right');

    const handleGeolocate = (e) => {
      const lngLat = e.target._userLocationDotMarker._lngLat;

      setLat(lngLat.lat);
      setLon(lngLat.lng);
      setZoom(map.current.getZoom());
      setBounds(false);
      setPolygonArea(0);
      setFeatures([]);
      if (hasDrawing && drawerRef.current) {
        drawerRef?.current?.deleteAll();
      }
    };

    Geolocate.on('geolocate', handleGeolocate);

    Geolocate.on('error', (error) => {
      if (error.code === error.PERMISSION_DENIED) {
        alert('Geolocation access denied. Please enable location services.');
      }
    });

    return () => {
      if (map && hasGeolocate && map.current.hasControl(Geolocate)) {
        map.current.removeControl(Geolocate);
      }
    };
  }, [map.current]);
};

export default useMapGeolocate;

import { useEffect } from 'react';
import { geocodeReverse, getElevation } from '../utils/helpers';

/**
 * Custom hook to fetch and manage elevation & address data.
 *
 * @param {Object} params - Configuration options for the hook.
 * @param {string} params.MAPBOX_TOKEN - Mapbox API token.
 * @param {number} params.lon - Longitude of the location.
 * @param {number} params.lat - Latitude of the location.
 * @param {Function} params.setAddress - Function to update the address.
 * @param {boolean} params.hasElevation - Whether elevation data should be fetched.
 * @param {Array} params.elevations - Array to store elevation data.
 * @param {Function} params.setElevation - Function to update elevation.
 */
const useElevation = ({
  MAPBOX_TOKEN,
  lon,
  lat,
  setAddress,
  hasElevation,
  elevations,
  setElevation,
}) => {
  /**
   * Updates the address using reverse geocoding.
   */
  useEffect(() => {
    geocodeReverse({
      apiKey: MAPBOX_TOKEN,
      setterFunc: (addr) => {
        setAddress(addr());

        // Update search box place holder
        const searchBox = document.querySelector('.mapboxgl-ctrl-geocoder--input');
        if (searchBox) {
          searchBox.value = '';
          searchBox.placeholder = addr().fullAddress;
        }
      },
      longitude: lon,
      latitude: lat,
    });

    if (hasElevation) {
      getElevation(lat, lon, elevations, setElevation);
    }
  }, [lon, lat, hasElevation]);
};

export default useElevation;

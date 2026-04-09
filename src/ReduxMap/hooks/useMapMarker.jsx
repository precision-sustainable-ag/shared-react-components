import mapboxgl from 'mapbox-gl';
import { useEffect, useRef } from 'react';
import styles from '../assets/styles/map.module.scss';

/**
 * Custom hook to manage a Mapbox marker on a given map instance.
 *
 * @param {Object} params - Configuration options for the hook.
 * @param {React.RefObject} params.map - Reference to the Mapbox map instance.
 * @param {number} params.lon - Longitude of the marker.
 * @param {number} params.lat - Latitude of the marker.
 * @param {Function} params.setLon - Function to update longitude.
 * @param {Function} params.setLat - Function to update latitude.
 * @param {boolean} params.hasMarker - Whether the marker should be displayed.
 * @param {boolean} params.hasMarkerPopup - Whether the marker should have a popup on hover.
 * @param {boolean} params.hasMarkerMovable - Whether the marker is draggable.
 * @param {boolean} params.isDrawActive - Whether the drawing mode is active.
 * @param {Object} [params.markerOptions={}] - Additional Mapbox marker options.
 * @param {string|React.ReactNode} [params.popupContent] - Custom HTML content for the popup.
 */
const useMapMarker = ({
  map,
  lon,
  lat,
  setLon,
  setLat,
  hasMarker,
  hasMarkerPopup,
  hasMarkerMovable,
  isDrawActive,
  markerOptions,
  popupContent,
}) => {
  const markerRef = useRef(null);
  const popupRef = useRef(null);

  const generatePopupContent = (plat, plon) => `
    <div class="popup">
      <div>Click and drag</div>
      ${plat.toFixed(4)}, ${plon.toFixed(4)}
      ${popupContent ? popupContent : ''}
    </div>
  `;

  useEffect(() => {
    if (!hasMarkerMovable || !markerRef.current) return;

    const handleDrag = (event) => {
      const { lat, lng } = event.target.getLngLat();
      markerRef.current.getPopup()?.setHTML(generatePopupContent(lat, lng));
    };

    const handleDragEnd = (event) => {
      const lngLat = event.target.getLngLat();
      setLat(lngLat.lat);
      setLon(lngLat.lng);
    };

    markerRef.current.on('drag', handleDrag);
    markerRef.current.on('dragend', handleDragEnd);

    return () => {
      if (!markerRef.current) return;

      markerRef.current.off('drag', handleDrag);
      markerRef.current.off('dragend', handleDragEnd);
    };
  }, [markerRef.current, hasMarkerMovable, popupContent]);

  useEffect(() => {
    if (!hasMarkerPopup || !markerRef.current) return;

    const handleMarkerEnter = (event) => {
      if (event.buttons === 0) {
        markerRef.current.togglePopup();
      }
    };

    const handleMarkerLeave = (event) => {
      if (event.buttons === 0) {
        markerRef.current.getPopup()?.remove();
      }
    };

    const markerElement = markerRef.current.getElement();
    markerElement.addEventListener('mouseenter', handleMarkerEnter);
    markerElement.addEventListener('mouseleave', handleMarkerLeave);

    return () => {
      if (!markerRef.current) return;

      const element = markerRef.current.getElement();
      element?.removeEventListener('mouseenter', handleMarkerEnter);
      element?.removeEventListener('mouseleave', handleMarkerLeave);
    };
  }, [markerRef.current, hasMarkerPopup, popupContent]);

  useEffect(() => {
    if (markerRef.current) {
      const lngLat = [lon, lat];
      markerRef.current.setLngLat(lngLat).getPopup()?.setHTML(generatePopupContent(lat, lon));
      map.current.setCenter(lngLat);
    }
  }, [lon, lat, popupContent]);

  useEffect(() => {
    if (!map.current || !hasMarker || isDrawActive) return;

    const popup = new mapboxgl.Popup({
      offset: 25,
      closeButton: false,
    })?.setHTML(generatePopupContent(lat, lon));
    popupRef.current = popup;

    // MARKER CONTROL
    const marker = new mapboxgl.Marker({
      draggable: hasMarkerMovable,
      color: '#e63946',
      scale: 1,
      ...markerOptions,
    })
      .setLngLat([lon, lat])
      .addClassName(styles.marker)
      .addTo(map.current);

    markerRef.current = marker;

    if (hasMarkerPopup) {
      marker.setPopup(popup);
    }

    return () => {
      if (markerRef.current) {
        markerRef.current.remove();
      }
    };
  }, [
    map.current,
    lat,
    lon,
    hasMarker,
    hasMarkerMovable,
    hasMarkerPopup,
    isDrawActive,
    popupContent,
  ]);
};

export default useMapMarker;

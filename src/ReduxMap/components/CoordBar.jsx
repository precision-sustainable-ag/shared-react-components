/* eslint-disable react/prop-types */
import styles from '../assets/styles/map.module.scss';

/**
 * CoordBar component displays geographic and map-related information in the corner of the map
 *
 * @param {Object} props - The component properties
 * @param {number} props.lat - Latitude coordinate
 * @param {number} props.lon - Longitude coordinate
 * @param {number} props.elevation - Elevation in feet
 * @param {number} props.polygonArea - Area of the selected polygon in acres
 * @param {boolean} props.showZoom - Flag to display zoom level
 * @param {number} props.zoom - Current zoom level of the map
 */
const CoordBar = ({ lat, lon, elevation, polygonArea, showZoom, zoom }) => {
  return (
    (lat || lon || polygonArea || elevation || showZoom) && (
      <div className={`${styles.infobar} ${styles.coordinfobar}`}>
        <ul>
          {<li>{`Latitude:${lat.toFixed(4).padStart(10, '\u00A0')}`}</li>}
          {<li>{`Longitude:${lon.toFixed(4).padStart(9, '\u00A0')}`}</li>}
          {+polygonArea > 0 && <li>{`Area: ${(+polygonArea).toFixed(2)} acres`}</li>}
          {+elevation > 0 && <li>{`Elevation: ${elevation} feet`}</li>}
          {showZoom && <li>{`Zoom: ${zoom.toFixed(2)} `}</li>}
        </ul>
      </div>
    )
  );
};

export default CoordBar;

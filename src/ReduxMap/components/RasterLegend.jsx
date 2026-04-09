import styles from '../assets/styles/map.module.scss';
import { useState } from 'react';

/**
 * Displays a color legend and an opacity slider for raster data rendered on a Mapbox map.
 *
 * @component
 * @param {Object} props - The component properties
 * @param {Object} props.map - The Mapbox map instance
 * @param {Array<[number, string]>} props.colorStops - Array of value/color pairs for the raster legend.
 * @param {string} [props.unit] - Unit of the raster values displayed in the legend.
 * @param {string} [props.material] - Name of the raster material (used as the source/layer ID in Mapbox).
 */
const RasterLegend = ({ map, colorStops, unit = 'kg/ha', material = 'biomass' }) => {
  const [opacityValue, setOpacityValue] = useState(50);

  const handleOpacityChange = (event) => {
    const { value: val } = event.target;
    setOpacityValue(val);
    if (map && map.current) {
      map.current.setPaintProperty(`${material}Polygons`, 'fill-opacity', val / 100);
    }
  };

  return (
    colorStops &&
    colorStops.length && (
      <div>
        <div className={styles.opacityslider}>
          <input
            type="range"
            min="0"
            max="100"
            value={opacityValue}
            className={styles.slider}
            onChange={handleOpacityChange}
            id="myRange"
          />
        </div>
        <div className={styles.rasterlegend}>
          <span className={styles.rastertitle}>
            unit: &nbsp;
            {unit}
          </span>
          {colorStops.map((stop, i) => (
            <div key={i} className={styles.rasterlegenditem}>
              <div className={styles.rasterlegendcolor} style={{ backgroundColor: stop[1] }} />
              <div className={styles.rasterlegendvalue}>{stop[0]}</div>
            </div>
          ))}
        </div>
      </div>
    )
  );
};
export default RasterLegend;

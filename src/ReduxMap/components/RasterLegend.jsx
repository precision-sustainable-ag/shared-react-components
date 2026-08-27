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
 * @param {string} [props.secondaryUnit] - Optional unit label for the multiplier-derived second legend column.
 * @param {number} [props.secondaryUnitMultiplier] - Factor applied to each value to display a second column.
 */
const RasterLegend = ({
  map,
  colorStops,
  unit = 'kg/ha',
  material = 'biomass',
  secondaryUnit,
  secondaryUnitMultiplier,
}) => {
  const [opacityValue, setOpacityValue] = useState(50);

  /**
   * colorStops[0]: [value, color] for continuous legend
   * colorStops[0]: [value, color, label] for discrete legend
   */
  const isDiscrete = colorStops && colorStops.length > 0 && colorStops[0].length === 3;

  // Check if multiplier is valid which turns the continuous legend into two columns.
  const hasSecondary = typeof secondaryUnitMultiplier === 'number' && Number.isFinite(secondaryUnitMultiplier);

  const formatSecondary = (value) => {
    const converted = value * secondaryUnitMultiplier;
    const magnitude = Math.abs(converted);
    let decimalPlaces = 0;
    if (magnitude < 1) decimalPlaces = 1;
    return parseFloat(converted.toFixed(decimalPlaces));
  };

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
          {isDiscrete ? (
            <>
              <span className={styles.rasterlegendheader}>{material}</span>
              {colorStops.map(([value, color, label], i) => (
                <div key={i} className={styles.rasterlegenditem}>
                  <div className={styles.rasterlegendcolor} style={{ backgroundColor: color }} />
                  <div className={styles.rasterlegendvalue}>{label}</div>
                </div>
              ))}
            </>
          ) : (
            <>
              <div className={styles.rasterlegendheader}>
                unit: &nbsp;
                <div className={styles.rasterlegendvalue}>{unit}</div>
                {hasSecondary && <div className={styles.rasterlegendvalue}>{secondaryUnit}</div>}
              </div>
              {colorStops.map(([value, color], i) => (
                <div key={i} className={styles.rasterlegenditem}>
                  <div className={styles.rasterlegendcolor} style={{ backgroundColor: color }} />
                  <div className={styles.rasterlegendvalue}>{value}</div>
                  {hasSecondary && (
                    <div className={styles.rasterlegendvalue}>{formatSecondary(value)}</div>
                  )}
                </div>
              ))}
          </>
          )}
        </div>
      </div>
    )
  );
};
export default RasterLegend;

/** biome-ignore-all lint/suspicious/noArrayIndexKey: <ArrayIndexKey is needed to enforce uniqueness> */
import { useState } from 'react';
import styles from '../assets/styles/map.module.scss';

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
  const hasSecondary =
    typeof secondaryUnitMultiplier === 'number' && Number.isFinite(secondaryUnitMultiplier);

  const handleOpacityChange = (event) => {
    const { value: val } = event.target;
    setOpacityValue(val);
    if (map?.current) {
      map.current.setPaintProperty(`${material}Polygons`, 'fill-opacity', val / 100);
    }
  };

  return (
    colorStops?.length && (
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
            <div className={styles.rasterlegendgrid}>
              <div className={styles.rasterlegendheader}>
                <span className={styles.rasterlegendunitlabel} />
                <div className={styles.rasterlegendvalue}>{material}</div>
                {hasSecondary && <div className={styles.rasterlegendvalue}>{secondaryUnit}</div>}
              </div>
              {colorStops.map(([_value, color, label], i) => (
                <div key={`${material}-${color}-${i}`} className={styles.rasterlegenditem}>
                  <div className={styles.rasterlegendcolor} style={{ backgroundColor: color }} />
                  <div className={styles.rasterlegendvalue}>{label}</div>
                </div>
              ))}
            </div>
          ) : (
            <div
              className={`${styles.rasterlegendgrid} ${
                hasSecondary ? styles.rasterlegendgridsecondary : ''
              }`}
            >
              <div className={styles.rasterlegendheader}>
                <span className={styles.rasterlegendunitlabel}>unit:</span>
                <div className={styles.rasterlegendvalue}>{unit}</div>
                {hasSecondary && <div className={styles.rasterlegendvalue}>{secondaryUnit}</div>}
              </div>
              {colorStops.map(([value, color], i) => (
                <div key={`${material}-${color}-${i}`} className={styles.rasterlegenditem}>
                  <div className={styles.rasterlegendcolor} style={{ backgroundColor: color }} />
                  <div className={styles.rasterlegendvalue}>{value}</div>
                  {hasSecondary && (
                    <div className={styles.rasterlegendvalue}>
                      {parseFloat((value * secondaryUnitMultiplier).toFixed(0))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    )
  );
};
export default RasterLegend;

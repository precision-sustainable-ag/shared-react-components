import React from 'react';
import styles from './map.module.scss';

const RasterTools = ({ map, colorStops, unit }) => {
  const [opacityValue, setOpacityValue] = React.useState(50);

  const handleOpacityChange = (event) => {
    const { value: val } = event.target;
    setOpacityValue(val);
    if (map && map.current) {
      map.current.setPaintProperty('biomassPolygons', 'fill-opacity', val / 100);
    }
  };

  return (
    colorStops && colorStops.length
    && (
      <div>
        <div className={styles.opacityslider}>
          <input type="range" min="0" max="100" value={opacityValue} className={styles.slider} onChange={handleOpacityChange} id="myRange" />
        </div>
        <div className={styles.rasterlegend}>
          <span className={styles.rastertitle}>
            unit:
            &nbsp;
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
export default RasterTools;

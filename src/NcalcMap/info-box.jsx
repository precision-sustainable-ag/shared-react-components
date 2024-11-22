import React from 'react';
import styles from './map.module.scss';

const InfoBox = ({ cursorLoc, polygonArea }) => (
  <div className={styles.infobar}>
    <p>
      {cursorLoc.latitude}
      {', '}
      {cursorLoc.longitude}
      {polygonArea > 0 && (
        <>
          &nbsp;&nbsp;|&nbsp;
          Area (Acre):
          {polygonArea.toFixed(1)}
        </>
      )}
    </p>
  </div>
);
export default InfoBox;

import PropTypes from 'prop-types';
import React, { useEffect, useRef } from 'react';

export const PSALogoDisplayer = ({
  council,
  alt,
  style,
}) => {
  const logoRef = useRef(null);
  const faviconRef = useRef(document.getElementById('favicon'));

  // useEffect to update favicon
  useEffect(() => {
    if (faviconRef.current) {
      switch (council) {
        case 'NECCC':
          faviconRef.current.href = 'src/logo-displayer/assets/neccc-favicon.ico';
          break;
        case 'SCCC':
          faviconRef.current.href = 'src/logo-displayer/assets/sccc-favicon.ico';
          break;
        case 'MCCC':
          faviconRef.current.href = 'src/logo-displayer/assets/mccc-favicon.ico';
          break;
        default:
          faviconRef.current.href = 'src/logo-displayer/assets/psa-favicon.ico';
          break;
      }
    }
  }, [council]);

  // useEffect to update logo image
  useEffect(() => {
    if (logoRef.current) {
      switch (council) {
        case 'NECCC':
          logoRef.current.src = 'src/logo-displayer/assets/neccc_wide_logo_color_web.jpg';
          break;
        case 'SCCC':
          logoRef.current.src = 'src/logo-displayer/assets/sccc_logo.png';
          break;
        case 'MCCC':
          logoRef.current.src = 'src/logo-displayer/assets/mwccc_logo.png';
          break;
        default:
          logoRef.current.src = 'src/logo-displayer/assets/PSAlogo-text.png';
          break;
      }
    }
  }, [council]);

  return (
    <img
      ref={logoRef}
      alt={alt}
      style={style}
    />
  );
};

PSALogoDisplayer.propTypes = {
  council: PropTypes.string,
  alt: PropTypes.string,
  style: PropTypes.object
};

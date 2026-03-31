import PropTypes from 'prop-types';
import { useEffect, useMemo } from 'react';

import mccc from '../assets/images/mwccc_logo.png';
import mcccIcon from '../assets/favicons/mccc-favicon.ico';
import neccc from '../assets/images/neccc_logo.png';
import necccIcon from '../assets/favicons/neccc-favicon.ico';
import psa from '../assets/images/PSA_logo.png';
import psaIcon from '../assets/favicons/PSA-favicon.ico';
import sccc from '../assets/images/sccc_logo.png';
import scccIcon from '../assets/favicons/sccc-favicon.ico';
import usda from '../assets/images/usda_logo.png';
import usdaIcon from '../assets/favicons/usda-favicon.ico';
import wccc from '../assets/images/wccc_logo.png';
import wcccIcon from '../assets/favicons/wccc-favicon.ico';

export const PSALogoDisplayer = ({ council, alt, style }) => {
  const { logo, favicon } = useMemo(() => {
    switch (council) {
      case 'NECCC':
        return { logo: neccc, favicon: necccIcon };
      case 'SCCC':
        return { logo: sccc, favicon: scccIcon };
      case 'MCCC':
        return { logo: mccc, favicon: mcccIcon };
      case 'WCCC':
        return { logo: wccc, favicon: wcccIcon };
      case 'USDA':
        return { logo: usda, favicon: usdaIcon };
      default:
        return { logo: psa, favicon: psaIcon };
    }
  }, [council]);

  useEffect(() => {
    const faviconEl = document.getElementById('favicon');
    if (faviconEl) {
      faviconEl.href = favicon;
    }
  }, [favicon]);

  return <img src={logo} alt={alt} style={style} />;
};

PSALogoDisplayer.propTypes = {
  /**
   * Council name based on what the logo image will be displayed
   */
  council: PropTypes.string,

  /**
   * An alternative text which will be displayed if the logo image doesn't get loaded
   */
  alt: PropTypes.string,

  /**
   * A style object for the img component
   */
  style: PropTypes.object,
};

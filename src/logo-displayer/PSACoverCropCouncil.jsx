import PropTypes from "prop-types";
import React, { useEffect, useRef } from "react";

export const PSALogoDisplayer = ({ council, alt, style }) => {
  const logoRef = useRef(null);
  const faviconRef = useRef(document.getElementById("favicon"));

  // useEffect to update favicon
  useEffect(() => {
    if (faviconRef.current) {
      switch (council) {
        case "NECCC":
          faviconRef.current.href = "favicons/neccc-favicon.ico";
          break;
        case "SCCC":
          faviconRef.current.href = "favicons/sccc-favicon.ico";
          break;
        case "MCCC":
          faviconRef.current.href = "favicons/mccc-favicon.ico";
          break;
        default:
          faviconRef.current.href = "favicons/psa-favicon.ico";
          break;
      }
    }
  }, [council]);

  // useEffect to update logo image
  useEffect(() => {
    if (logoRef.current) {
      switch (council) {
        case "NECCC":
          logoRef.current.src = "images/neccc_logo.png";
          break;
        case "SCCC":
          logoRef.current.src = "images/sccc_logo.png";
          break;
        case "MCCC":
          logoRef.current.src = "images/mwccc_logo.png";
          break;
        default:
          logoRef.current.src = "images/PSA_logo.png";
          break;
      }
    }
  }, [council]);

  return <img ref={logoRef} alt={alt} style={style} />;
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

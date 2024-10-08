import React from "react";
import PropTypes from "prop-types";

export function PSACoverCropCouncil({
  src,
  alt,
  style,
}) {
  return (
    <img
      src={src}
      alt={alt}
      style={style}
    />   
  )
}

/* Define Props Type */

PSACoverCropCouncil.propTypes = {
  src: PropTypes.string.isRequired,
  alt: PropTypes.string,
  style: PropTypes.object
};
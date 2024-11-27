import React from "react";
import PropTypes from "prop-types";

export function PSALoadingspinner({ loaderStyle }) {
  return <div style={loaderStyle}></div>;
}

PSALoadingspinner.propTypes = {

   /**
   * Styles for the loader
   */
   loaderStyle: PropTypes.object,

};
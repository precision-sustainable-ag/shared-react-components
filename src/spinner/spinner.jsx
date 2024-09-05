import React from "react";
import PropTypes from "prop-types";
import styles from "./spinner.module.scss";

/**
 * React Component for rendering a Spinner
 */
export function Spinner({
  size = "50px",
  color = "#3498db",
  backgroundColor = "#f3f3f3",
}) {
  const loaderStyle = {
    width: size,
    height: size,
    border: `8px solid ${backgroundColor}`,
    borderTop: `8px solid ${color}`,
    borderLeft: `8px solid ${color}`,
    borderRight: `8px solid ${color}`,
    borderRadius: "50%",
    animation: `${styles.spin} 2s linear infinite`,
  };

  return <div style={loaderStyle}></div>;
}

Spinner.propTypes = {
  /**
   * Size of the spinner
   */
  size: PropTypes.string,
  /**
   * Background color of the spinner
   */
  backgroundColor: PropTypes.string,
  /**
   * Major color of the spinner
   */
  color: PropTypes.string,
};

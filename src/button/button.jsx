import React from "react";
import PropTypes from "prop-types";
export function PSAButton({
    title=""
}) {
  return (
   <>{title}</>
  );
}
PSAButton.propTypes = {
    title: PropTypes.string
};
import React from "react";
import PropTypes from "prop-types";

export function PSAFeedback({
    title=""
}) {
  return (
   <>{title}</>
  );
}

PSAFeedback.propTypes = {
    title: PropTypes.string
};

import React from 'react';
import PropTypes from "prop-types";
import { Tooltip } from '@mui/material';

export function PSATooltip({
  tooltipContent, 
  ...props
}) {
  return (
    <Tooltip
      {...props}
      children={tooltipContent}
    />
  );
}

PSATooltip.propTypes = {

  /**
   * Custom content to render inside the tooltip.
   */
  tooltipContent: PropTypes.node,
};

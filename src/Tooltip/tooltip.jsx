import React from 'react';
import PropTypes from "prop-types";
import { Tooltip } from '@mui/material';

export function PSATooltip({
  onMouseEnter,//Extracting onMouseEnter from the props.
  onMouseLeave,//Extracting onMouseLeave from the props.
  tooltipContent, 
  ...props
}) {
  // Cloning tooltipContent and adding/injecting event handlers directly to element
  const eventHandlers = {};
  if (onMouseEnter) eventHandlers.onMouseEnter = onMouseEnter;
  if (onMouseLeave) eventHandlers.onMouseLeave = onMouseLeave;
  const clonedTooltipContent = React.cloneElement(tooltipContent, eventHandlers);
  return (
    <Tooltip
      {...props}
      children={clonedTooltipContent}
    />
  );
}

PSATooltip.propTypes = {

  /**
   * Custom content to render inside the tooltip.
   */
  tooltipContent: PropTypes.node,

  /**
   * Mouse enter event handler.
   */
  onMouseEnter: PropTypes.func,

  /**
   * Mouse leave event handler.
   */
  onMouseLeave: PropTypes.func,

};

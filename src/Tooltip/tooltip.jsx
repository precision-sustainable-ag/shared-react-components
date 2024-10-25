import React from 'react';
import PropTypes from "prop-types";
import { Tooltip } from '@mui/material';

export function PSATooltip({
  title, 
  placement = 'bottom', 
  arrow = true,
  enterTouchDelay = 0, 
  dangerouslySetInnerHTML, 
  tooltipContent, 
  ...props
}) {
  return (
    <Tooltip
      title={dangerouslySetInnerHTML ? undefined : title}
      placement={placement}
      arrow={arrow}
      enterTouchDelay={enterTouchDelay}
      {...props}
    >
      {tooltipContent}
    </Tooltip>
  );
}

PSATooltip.propTypes = {
  
   /**
   * The text or node to be displayed inside the tooltip.
   */
  title: PropTypes.node,

  /**
   * Where the tooltip will appear relative to its child element.
   */
  placement: PropTypes.oneOf([
    'top', 'bottom', 'left', 'right', 'top-start', 'top-end', 'bottom-start', 'bottom-end', 'left-start', 'left-end', 'right-start', 'right-end'
  ]),

  /**
   * Whether the tooltip will have an arrow pointing to the child element.
   */
  arrow: PropTypes.bool,

  /**
   * The delay in milliseconds before showing the tooltip on touch devices.
   */
  enterTouchDelay: PropTypes.number,

  /**
   * If you want to render HTML inside the tooltip. Use this cautiously.
   */
  dangerouslySetInnerHTML: PropTypes.shape({
    __html: PropTypes.string
  }),

  /**
   * Custom content to render inside the tooltip.
   */
  tooltipContent: PropTypes.node,

};

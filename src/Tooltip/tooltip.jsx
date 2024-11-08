import React from 'react';
import PropTypes from "prop-types";
import { Tooltip } from '@mui/material';

export function PSATooltip({
  title, 
  placement = 'bottom', 
  arrow = true,
  enterTouchDelay = 0, 
  leaveTouchDelay = 0, 
  tooltipContent, 
  open,
  onMouseEnter,
  onMouseLeave,
  componentsProps = {},
  ...props
}) {
  return (
    <Tooltip
      title={title}
      placement={placement}
      arrow={arrow}
      enterTouchDelay={enterTouchDelay}
      leaveTouchDelay={leaveTouchDelay}
      open={open}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      componentsProps={componentsProps}
      {...props}
      children={tooltipContent}
    />
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
   * The delay in milliseconds before hiding the tooltip on touch devices.
   */
  leaveTouchDelay: PropTypes.number,

  /**
   * Custom content to render inside the tooltip.
   */
  tooltipContent: PropTypes.node,

   /**
   * Additional props to customize nested elements within Tooltip.
   */
   componentsProps: PropTypes.object,

};

import { Tooltip } from '@mui/material';
import PropTypes from 'prop-types';

export function PSATooltip({ tooltipContent, ...props }) {
  return <Tooltip {...props} children={tooltipContent} />;
}

PSATooltip.propTypes = {
  /**
   * Custom content to render inside the tooltip.
   */
  tooltipContent: PropTypes.node,
};

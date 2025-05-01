import React from 'react';
import PropTypes from 'prop-types';
import { Chip } from '@mui/material';
import { PSATooltip } from '../Tooltip/tooltip';

export function TagItem({
  chipId,
  label,
  tooltipText,
  disabled,
  color,
  avatarContent,
  onClick,
}) {
  return (
    <PSATooltip
      id={`tooltip-${chipId}`}
      title={tooltipText}
      key={`tooltip${chipId}`}
      placement="top"
      arrow
      enterDelay={1000}
      enterNextDelay={1000}
      tooltipContent={
        <Chip
          id={`chip-${chipId}`}
          label={label}
          disabled={disabled}
          color={color}
          avatar={avatarContent}
          onClick={onClick}
          size="medium"
          variant="outlined"
          data-test={`tag-item-${chipId}`}
          sx={{
            '&.MuiChip-root.Mui-disabled': {
              opacity: 1,
              color: '#757575',
            },
          }}
        />
      }
    />
  );
}

TagItem.propTypes = {
  /** unique id for DOM/testing hooks */
  chipId:       PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  /** text shown in the chip */
  label:        PropTypes.string.isRequired,
  /** tooltip content */
  tooltipText:  PropTypes.string,
  /** disable the chip */
  disabled:     PropTypes.bool,
  /** MUI chip color: "primary" or "secondary" */
  color:        PropTypes.oneOf(['primary', 'secondary']),
  /** optional content for the Avatar slot */
  avatarContent: PropTypes.node,
  /** click handler */
  onClick:      PropTypes.func,
};

TagItem.defaultProps = {
  tooltipText:  '',
  disabled:     false,
  color:        'secondary',
  avatarContent: null,
  onClick:      () => {},
};

export default TagItem;

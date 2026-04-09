import { Chip } from '@mui/material';
import PropTypes from 'prop-types';
import { PSATooltip } from '../Tooltip/tooltip';

export function PSATagItem({
  chipId,
  label,
  tooltipText,
  disabled,
  color,
  avatarContent,
  onClick,
  ...props
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
          data-test={`goal-tag-${chipId}`}
          sx={{
            '&.MuiChip-root:focus': {
              '&.Mui-disabled': {
                color: '#757575',
              },
            },
            '&.Mui-disabled': {
              opacity: 1,
              color: '#757575',
            },
          }}
          {...props}
        />
      }
    />
  );
}

PSATagItem.propTypes = {
  /** unique id for DOM/testing hooks */
  chipId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  /** text shown in the chip */
  label: PropTypes.string.isRequired,
  /** tooltip content */
  tooltipText: PropTypes.string,
  /** disable the chip */
  disabled: PropTypes.bool,
  /** MUI chip color: "primary" or "secondary" */
  color: PropTypes.oneOf(['primary', 'secondary']),
  /** optional content for the Avatar slot */
  avatarContent: PropTypes.node,
  /** click handler */
  onClick: PropTypes.func,
};

PSATagItem.defaultProps = {
  tooltipText: '',
  disabled: false,
  color: 'secondary',
  avatarContent: null,
  onClick: () => {},
};

export default PSATagItem;

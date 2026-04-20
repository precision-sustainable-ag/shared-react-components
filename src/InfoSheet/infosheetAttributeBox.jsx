import { Box, Typography } from '@mui/material';
import PropTypes from 'prop-types';
import PSATooltip from '../Tooltip';

export const PSAInfoSheetAttributeBox = ({ variant, description, label, value, sx }) => {
  const isText = variant === 'texts';

  switch (variant) {
    // case 'texts':
    default:
      return (
        <Box
          className="info-sheet-item"
          sx={{
            width: { xs: '100%', md: '50%' },
            wordWrap: 'break-word',
            padding: { xs: 0, md: '8px', lg: '8px 16px' },
            ...sx,
          }}
        >
          <Box
            sx={{
              display: 'flex',
              flexWrap: 'wrap',
              alignItems: isText ? 'flex-start' : 'center',
              backgroundColor: '#F5F5F5',
              borderTop: { xs: '1px solid #e6e3e3', md: '' },
              borderRadius: { xs: '0 0 30px 30px', md: '30px' },
              boxShadow: { xs: '', md: '0px 2px 4px rgba(0, 0, 0, 0.1)' },
              padding: '6px 16px',
              minHeight: '50px',
              height: '100%',
            }}
          >
            {/* Label Section */}
            <Box
              className={`attribute-label${isText ? '-text' : ''}`}
              sx={{
                width: isText ? '100%' : '50%',
                textAlign: isText ? 'center' : 'inherit',
              }}
            >
              <PSATooltip
                placement="top-end"
                enterTouchDelay={0}
                title={description}
                PopperProps={{ style: { zIndex: 10000000 } }}
                arrow
                tooltipContent={
                  <Typography sx={{ fontWeight: 'bold' }} variant="body1" tabIndex="0">
                    {label}
                  </Typography>
                }
              />
            </Box>

            {/* Value Section */}
            <Box
              className={`attribute-value${isText ? '-text' : ''}`}
              sx={{ width: isText ? '100%' : '50%' }}
            >
              <Typography
                sx={{
                  display: 'block',
                  textAlign: isText ? 'center' : 'right',
                }}
              >
                {value}
              </Typography>
            </Box>
          </Box>
        </Box>
      );
  }
};

PSAInfoSheetAttributeBox.propTypes = {
  /**
   * State for controlling the open status of the Infosheet
   */
  variant: PropTypes.oneOf(['texts', '']),

  /**
   * Attribute description that will be shown in the tooltip
   */
  description: PropTypes.string,

  /**
   * Label of the attribute
   */
  label: PropTypes.node,

  /**
   * Value of the attribute
   */
  value: PropTypes.node,

  /**
   * Additional stylings that would be applied to the outer grid
   */
  sx: PropTypes.node,
};

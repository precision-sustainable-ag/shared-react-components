import { Box, Typography } from '@mui/material';
import PropTypes from 'prop-types';
import PSASubContainer from '../SubContainer';

export function PSADataPoint({ title, value, icon, unit, boxSx }) {
  return (
    <PSASubContainer
      title={title}
      content={
        <Box
          sx={{
            minWidth: '300px',
            minHeight: '155px',
            display: 'flex',
            ...boxSx,
          }}
        >
          <Box margin={'auto'}>
            <Typography
              sx={{
                fontSize: '40px',
                fontWeight: 600,
                color: 'main.text',
                textAlign: 'center',
              }}
            >
              {value}
              {icon}
            </Typography>
            <Typography
              sx={{
                fontSize: '1rem',
                color: `additional.grey1`,
                textAlign: 'center',
              }}
            >
              {unit}
            </Typography>
          </Box>
        </Box>
      }
    />
  );
}

/* Define Props Type */

PSADataPoint.propTypes = {
  /**
   * The title of the data point, it will be displayed as the wrapper's title.
   */
  title: PropTypes.string,
  /**
   * The display value of the data point.
   */
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  /**
   * The icon of the value.
   */
  icon: PropTypes.node,
  /**
   * The display unit of the data point.
   */
  unit: PropTypes.string,
  /**
   * The alternate stylings for the wrapper of the data point.
   */
  boxSx: PropTypes.object,
};

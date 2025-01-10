import React from "react";
import { Box, Typography } from "@mui/material";
import PropTypes from "prop-types";

export function PSADataPoint({ value, icon, unit, boxSx }) {
  return (
    <Box
      sx={{
        minWidth: "300px",
        minHeight: "155px",
        display: "flex",
        ...boxSx,
      }}
    >
      <Box margin={"auto"}>
        <Typography
          sx={{
            fontSize: "40px",
            fontWeight: 600,
            color: "main.text",
            textAlign: "center",
          }}
        >
          {value}
          {icon}
        </Typography>
        <Typography
          sx={{
            fontSize: "1rem",
            color: `additional.grey1`,
            textAlign: "center",
          }}
        >
          {unit}
        </Typography>
      </Box>
    </Box>
  );
}

/* Define Props Type */

PSADataPoint.propTypes = {
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

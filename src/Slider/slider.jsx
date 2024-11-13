import React from "react";
import PropTypes from "prop-types";
import Slider from "@mui/material/Slider";
import { Box } from "@mui/material";

export function PSASlider({
  min,
  max,
  step,
  value,
  valueLabelDisplay,
  onChange,
  onChangeCommitted,
  dataTestId,
  width
}) {
  const sliderStyles = {
    width: width || "100%", // Use the provided width or default to 100% of parent
  };
  return (
    <div style={sliderStyles}>
      <Slider
        min={min}
        max={max}
        step={step}
        value={value}
        valueLabelDisplay={valueLabelDisplay}
        onChange={onChange}
        onChangeCommitted={onChangeCommitted}
        data-test={dataTestId}
      />
    </div>
  );
}

// Define Prop Types
PSASlider.propTypes = {
  min: PropTypes.number,
  max: PropTypes.number,
  step: PropTypes.number,
  value: PropTypes.number,
  valueLabelDisplay: PropTypes.string,
  onChange: PropTypes.func,
  onChangeCommitted: PropTypes.func,
  dataTestId: PropTypes.string,
  width: PropTypes.string
};

export default PSASlider;

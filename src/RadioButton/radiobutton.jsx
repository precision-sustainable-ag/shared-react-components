import React from "react";
import Radio from "@mui/material/Radio";
import PropTypes from "prop-types";
import { Box, Button, Typography } from "@mui/material";

export function PSARadioButton({
  options,
  selectedValue,
  onChange,
  row = false,
  sx,
  size = "small",
  ...props
}) {
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: row ? "row" : "column",
        gap: 2,
        width: size === "small" ? "fit-content" : "100%",
      }}
    >
      {options.map((option) => (
        <Button
          key={option.value}
          onClick={() => onChange(option.value)}
          sx={{
            width: "100%",
            padding: 2,
            textAlign: "left",
            backgroundColor: selectedValue === option.value && "main.accent2",
            color: selectedValue === option.value ? "white" : "text.primary",
            display: "flex",
            alignItems: "center",
            justifyContent: "flex-start",
            borderRadius: 1,
            textTransform: "none",
            boxShadow: "0px 1px 10px 0px #0000001A",
            "&:hover": {
              backgroundColor:
                selectedValue === option.value ? "#2B79B4" : "#e0e0e0",
            },
          }}
        >
          <Radio
            checked={selectedValue === option.value}
            sx={{
              color: selectedValue === option.value ? "white" : "primary.main",
              marginRight: 1,
              padding: "4px",
              "&.Mui-checked": {
                color: "white",
              },
            }}
          />
          <Typography
            sx={{
              fontSize: "14px",
              lineHeight: 1.5,
              textAlign: "left",
            }}
          >
            {option.label}
          </Typography>
        </Button>
      ))}
    </Box>
  );
}

PSARadioButton.propTypes = {
  /**
   * Array of options for the radio group, each option must have a label and value
   */
  options: PropTypes.arrayOf(
    PropTypes.shape({
      label: PropTypes.string.isRequired,
      value: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
        .isRequired,
    })
  ).isRequired,

  /**
   * The currently selected value of the radio group
   */
  selectedValue: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
    .isRequired,

  /**
   * Callback function triggered when the selection changes
   */
  onChange: PropTypes.func.isRequired,

  /**
   * Whether the radio buttons should be displayed in a row
   */
  row: PropTypes.bool,

  /**
   * Additional styles to be applied to the RadioGroup
   */
  sx: PropTypes.object, // Add PropTypes for the sx prop

  /**
   *  Size of the radio button group. 'large' makes it full width, 'small' makes it fit content
   */
  size: PropTypes.oneOf(["small", "large"]),
};

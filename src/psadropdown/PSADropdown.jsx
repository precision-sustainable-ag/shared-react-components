import React from "react";
import PropTypes from "prop-types";
import { FormControl, InputLabel, MenuItem, Select } from "@mui/material";

export const PSADropdown = ({
  label,
  items = [],
  formSx = {},
  inputSx = {},
  SelectProps = {},
}) => (
  <FormControl sx={formSx} variant={SelectProps.variant}>
    <InputLabel sx={inputSx}>{label}</InputLabel>
    <Select label={label} {...SelectProps}>
      {items.map((item, index) => (
        <MenuItem
          key={index}
          value={item.value}
          data-test={`${SelectProps["data-test"]}-${item.label}`}
        >
          {item.label}
        </MenuItem>
      ))}
    </Select>
  </FormControl>
);

PSADropdown.propTypes = {
  /**
   * The label text for the dropdown
   */
  label: PropTypes.string.isRequired,

  /**
   * Array of items for the dropdown, each item must have a label and value
   */
  items: PropTypes.arrayOf(
    PropTypes.shape({
      label: PropTypes.string.isRequired,
      value: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
        .isRequired,
    })
  ).isRequired,

  /**
   * The sx prop for styling the FormControl element
   */
  formSx: PropTypes.object,

  /**
   * The sx prop for styling the InputLabel element
   */
  inputSx: PropTypes.object,

  /**
   * The props for the Select component (including value, onChange, style, etc.)
   */
  SelectProps: PropTypes.shape({
    value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    variant: PropTypes.oneOf(["standard", "outlined", "filled"]),
    onChange: PropTypes.func.isRequired,
    MenuProps: PropTypes.object,
    style: PropTypes.object,
    sx: PropTypes.object,
    error: PropTypes.bool,
    "data-test": PropTypes.string,
  }),
};

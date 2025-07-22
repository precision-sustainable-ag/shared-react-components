import React from "react";
import PropTypes from "prop-types";
import { FormControl, InputLabel, MenuItem, Select } from "@mui/material";

const getIdFromLabel = (label) => {
  if (typeof label !== "string") return "dropdown";
  return label.replace(/[^a-zA-Z0-9]/g, "-");
};

export const PSADropdown = ({
  label,
  items = [],
  formSx = {},
  inputSx = {},
  SelectProps = {},
  menuSx = {},
}) => (
  <FormControl sx={formSx} variant={SelectProps.variant}>
    <InputLabel sx={inputSx} id={`${getIdFromLabel(label)}-label`}>
      {label}
    </InputLabel>
    <Select
      labelId={`${getIdFromLabel(label)}-label`}
      id={`${getIdFromLabel(label)}-select`}
      label={label}
      {...SelectProps}
    >
      {items.map((item, index) => (
        <MenuItem
          key={index}
          value={item.value}
          data-test={`${SelectProps["data-test"]}-${item.label}`}
          disabled={item.isHeader}
          style={item.isHeader ? menuSx : {}}
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
  label: PropTypes.string,

  /**
   * Array of items for the dropdown, each item must have a label and value
   */
  items: PropTypes.arrayOf(
    PropTypes.shape({
      label: PropTypes.string,
      value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    })
  ),

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
    onChange: PropTypes.func,
    MenuProps: PropTypes.object,
    style: PropTypes.object,
    sx: PropTypes.object,
    error: PropTypes.bool,
    "data-test": PropTypes.string,
  }),

  /**
   * The sx prop for styling the MenuItem element
   */
  menuSx: PropTypes.object,
};

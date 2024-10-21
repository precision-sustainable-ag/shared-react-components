import React from "react";
import PropTypes from "prop-types";
import {
  FormControl, InputLabel, MenuItem, Select,
} from '@mui/material';

export const PSADropdown = ({
  id,
  labelId,
  label,
  value,
  onChange,
  variant,
  items = [],
  style = {},
  formSx = {},
  inputSx = {},
  selectSx = {},
  MenuProps = {},
  error = false,
}) => (
  <FormControl sx={formSx} variant={variant}>
    <InputLabel
      id={id}
      sx={inputSx}
    >
      {label}
    </InputLabel>
    <Select
      labelId={labelId}
      id={id}
      label={label}
      value={value}
      variant={variant}
      onChange={onChange}
      MenuProps={MenuProps}
      style={style}
      sx={selectSx}
      error={error}
    >
      {items.map((item, index) => (
        <MenuItem key={index} value={item.value}>
          {item.label}
        </MenuItem>
      ))}
    </Select>
  </FormControl>

);

PSADropdown.propTypes = {
  /**
   * The id of the dropdown component
   */
  id: PropTypes.string.isRequired,

  /**
   * The id of the label for the dropdown
   */
  labelId: PropTypes.string.isRequired,

  /**
   * The label text for the dropdown
   */
  label: PropTypes.string.isRequired,

  /**
   * The selected value for the dropdown
   */
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),

  /**
   * Callback function that triggers when a dropdown item is selected
   */
  onChange: PropTypes.func.isRequired,

  /**
   * The variant of the dropdown component (e.g., standard, outlined, etc.)
   */
  variant: PropTypes.oneOf(['standard', 'outlined', 'filled']),

  /**
   * Array of items for the dropdown, each item must have a label and value
   */
  items: PropTypes.arrayOf(
    PropTypes.shape({
      label: PropTypes.string.isRequired,
      value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    })
  ).isRequired,

  /**
   * CSS styles for the dropdown component
   */
  style: PropTypes.object,

  /**
   * The sx prop for styling the FormControl element
   */
  formSx: PropTypes.object,

  /**
   * The sx prop for styling the InputLabel element
   */
  inputSx: PropTypes.object,

  /**
   * The sx prop for styling the Select component
   */
  selectSx: PropTypes.object,

  /**
   * Props for customizing the dropdown menu, e.g., positioning
   */
  MenuProps: PropTypes.object,

  /**
   * Whether the dropdown has an error state
   */
  error: PropTypes.bool,

};

/*
  This file contains the TextField component
*/

import React from "react";
import PropTypes from "prop-types";
import { TextField } from "@mui/material";

export function PSATextField({
  style,
  placeholder,
  multiline,
  variant,
  fullWidth,
  minRows,
  onChange,
  autoFocus,
  error,
  value,
  InputProps,
  color,
  label,
  onChangeCapture,
}) {
  return (
    <TextField
      style={style}
      placeholder={placeholder}
      multiline={multiline}
      variant={variant}
      fullWidth={fullWidth}
      minRows={minRows}
      onChange={onChange}
      autoFocus={autoFocus}
      error={error}
      value={value}
      InputProps={InputProps}
      color={color}
      label={label}
      onChangeCapture={onChangeCapture}
    />
  );
}

/* Define Props Type */
PSATextField.propTypes = {
  style: PropTypes.object,
  placeholder: PropTypes.string,
  multiline: PropTypes.bool,
  variant: PropTypes.string,
  fullWidth: PropTypes.bool,
  minRows: PropTypes.number,
  onChange: PropTypes.func,
  autoFocus: PropTypes.bool,
  error: PropTypes.bool,
  value: PropTypes.string,
  InputProps: PropTypes.object,
  color: PropTypes.string,
  label: PropTypes.string,
  onChangeCapture: PropTypes.func,
};

/* Define default props */
PSATextField.defaultProps = {
  style: {},
  placeholder: "",
  multiline: false,
  variant: "outlined",
  fullWidth: false,
  minRows: 1,
  onChange: () => {},
  autoFocus: false,
  error: false,
  value: "",
  InputProps: {},
  color: "primary",
  label: "",
  onChangeCapture: () => {},
};

export default PSATextField;

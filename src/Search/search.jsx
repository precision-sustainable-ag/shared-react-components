import React from "react";
import { PSATextField } from "../Textfield/textfield";
import {
  Box,
  styled,
  InputAdornment,
} from "@mui/material";
import PropTypes from "prop-types";

const StyledBox = styled(Box)(({ type }) => ({
  ...(type === "Paper" && {
    boxShadow: 2,
    borderRadius: '.2rem',
    backgroundColor: 'white',
  }),
}));

export const PSASearch = ({
  value,
  color,
  handleChange,
  handleChangeCapture,
  adornmentContent,
  inputProps,
  style,
  sx,
  boxProps,
  label,
  InputLabelProps,
  boxType,
  variant="standard",
  testId,
  }) => {
    return (
    <StyledBox
     type={boxType}
     sx={{              
      width: '80%',
      paddingBottom: '.1rem',
      ...boxProps
    }}>
      <PSATextField
        color={color}
        value={value}
        onChangeCapture={handleChangeCapture}
        onChange={handleChange}
        style={{ ...style }}
        sx={{
          width: '90%',
          ...sx,
        }}
        label={label}
        variant={variant}
        InputLabelProps={{
          sx: { color: '#C7C7C7' },
          ...InputLabelProps,
        }}
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              {adornmentContent}
            </InputAdornment>
          ),
          ...inputProps,
        }}
        data-test={testId}
      />
    </StyledBox>
  );
}

/** PropTypes for better type checking */
/** Search Prop Types */
PSASearch.propTypes = { 
  /** The Styled Type of the Box container */
  boxType: PropTypes.oneOf(["Paper"]),

  /** The properties of the Box container */
  boxProps: PropTypes.object,
  
  /** The value displayed on the Textfield */
  value: PropTypes.string,

  /** The function called as input is typed into the textfield */
  onChangeCapture: PropTypes.func,

  /** The function called as input is submitted through the Textfield */
  onChange: PropTypes.func,

  /** The style for the Textfield */
  style: PropTypes.object,

  /** The sx for the Textfield */
  sx: PropTypes.object,

  /** The label on the textfield that moves upon a click or data entry */
  label: PropTypes.string,

  /** The variant of the Textfield */
  variant: PropTypes.string,

  /** The properties for the input label */
  InputLabelProps: PropTypes.object,

  /** The content or icon that will appear at the end of the search */
  adornmentContent: PropTypes.node,

};
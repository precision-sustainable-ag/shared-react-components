import React from 'react';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import Radio from '@mui/material/Radio';
import PropTypes from 'prop-types';

export function PSARadiobutton({ options, selectedValue, onChange, row = false, sx, ...props }) {
  return (
    <RadioGroup
      row={row}
      sx={sx}
      {...props}
    >
      {options.map((option) => (
        <FormControlLabel
          key={option.value}
          value={option.value}
          control={<Radio checked={selectedValue === option.value} />}
          label={option.label}
          onChange={() => onChange(option.value)}
        />
      ))}
    </RadioGroup>
  );
}

PSARadiobutton.propTypes = {
  /**
   * Array of options for the radio group, each option must have a label and value
   */
  options: PropTypes.arrayOf(
    PropTypes.shape({
      label: PropTypes.string.isRequired,
      value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    })
  ).isRequired,

  /**
   * The currently selected value of the radio group
   */
  selectedValue: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,

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
};

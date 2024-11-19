import React from 'react';
import PropTypes from 'prop-types';
import Checkbox from '@mui/material/Checkbox';

export const PSACheckbox = ({
  checked,
  onChange,
  name,
  color = 'primary',
  style,
  dataTest,
  comparisonKeys,
  valueKey,
  dispatchRedux,
  updateAction,
}) => {
  const handleCheckboxChange = () => {
    const comparisonKeysCopy = [...comparisonKeys];
    const indexOfValue = comparisonKeysCopy.indexOf(valueKey);

    if (indexOfValue === -1) {
      comparisonKeysCopy.push(valueKey);
    } else {
      comparisonKeysCopy.splice(indexOfValue, 1);
    }

    dispatchRedux(updateAction(comparisonKeysCopy));
  };

  return (
    <Checkbox
      checked={checked}
      onChange={onChange || handleCheckboxChange}
      name={name}
      color={color}
      style={style}
      data-test={dataTest}
    />
  );
};

PSACheckbox.propTypes = {
  /**
   * Whether the checkbox is checked or not.
   */
  checked: PropTypes.bool.isRequired,

  /**
   * Callback function triggered when the checkbox state changes.
   * If not provided, the default logic for updating `comparisonKeys` will be used.
   */
  onChange: PropTypes.func,

  /**
   * Name of the checkbox, typically used for identification.
   */
  name: PropTypes.string.isRequired,

  /**
   * Color of the checkbox. Default is "primary".
   */
  color: PropTypes.string,

  /**
   * Inline style object to customize the appearance of the checkbox.
   */
  style: PropTypes.object,

  /**
   * Data attribute for testing purposes.
   */
  dataTest: PropTypes.string,

  /**
   * The array of keys currently selected or checked.
   */
  comparisonKeys: PropTypes.arrayOf(PropTypes.string).isRequired,

  /**
   * The value used to identify this checkbox in the `comparisonKeys` array.
   */
  valueKey: PropTypes.string.isRequired,

  /**
   * Function to dispatch an action to the Redux store.
   */
  dispatchRedux: PropTypes.func.isRequired,

  /**
   * The Redux action creator function used to update the `comparisonKeys` array.
   */
  updateAction: PropTypes.func.isRequired,
};


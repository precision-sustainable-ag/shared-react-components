import React from "react";
import PropTypes from "prop-types";
import { Button, styled } from '@mui/material';

// Reuse the pillBackgroundColor function
const pillBackgroundColor = (selected, transparent) => {
  if (selected) {
    return '#49a8ab';
  }
  if (transparent) {
    return 'transparent';
  }
  return '#e3f2f4';
};

// Use MUI's styled system to define the button styles
const StyledButton = styled(Button, {
  shouldForwardProp: (prop) => prop !== 'buttonType',
})(({ buttonType, selected, transparent }) => ({
  ...(buttonType === 'LightButton' && {
    backgroundColor: '#e3f2f4',
    borderRadius: '200px',
    color: '#000',
    padding: '10px 20px',
    borderColor: '#e3f2f4',
    '&:hover': {
      borderColor: '#62b8bc',
      backgroundColor: '#49a8ab',
      color: '#000',
    },
  }),
  ...(buttonType === 'PillButton' && {
    backgroundColor: pillBackgroundColor(selected, transparent),
    borderRadius: '200px',
    color: '#000',
    padding: '10px 20px',
    borderColor: '#e3f2f4',
    '&:hover': {
      borderColor: '#62b8bc',
      backgroundColor: '#49a8ab',
      color: '#000',
    },
  }),
  ...(buttonType === 'ValuesChanged' && {
    backgroundColor: 'rgba(255, 150, 28, 0.2)',
    borderRadius: '999px',
    padding: '0.5rem',
    '&:hover': {
      backgroundColor: 'rgba(255, 150, 28, 0.3)',
    },
    '@media (max-width:600px)': {
      padding: '0.5rem',
      borderRadius: '999px',
      '& .MuiTypography-root': {
        fontSize: '0.7rem',
      },
    },
  }),
  ...(buttonType === 'ModalLink' && {
    color: 'white',
    textTransform: 'none',
    marginLeft: '2em',
    textDecoration: 'underline',
  }),
  ...(buttonType === 'ToggleOptions' && {
    backgroundColor: selected ? '#598444' : 'white',
    color: selected ? 'white' : '#8abc62',
    border: '10px',
    '&:hover': {
      backgroundColor: selected ? '#598444' : 'white',
      color: selected ? 'white' : '#8abc62',
    },
  }),
}));

export const PSAButton = ({
  title = "",
  buttonType = "LightButton",
  selected = false,
  transparent = false,
  onClick = () => {},
  ...props
}) => {
  return (
    <StyledButton
      buttonType={buttonType}
      selected={selected}
      transparent={transparent}
      onClick={onClick}
      {...props}
    >
      {title}
    </StyledButton>
  );
};



PSAButton.propTypes = {
  /**
   * The text displayed on the button.
   */
  title: PropTypes.string,
  
  /**
   * The type of button to render, affecting its styling and behavior.
   * Options include 'LightButton', 'PillButton', 'ValuesChanged', 'ModalLink', or 'ToggleOptions'.
   */
  buttonType: PropTypes.oneOf([
    'LightButton',
    'PillButton',
    'ValuesChanged',
    'ModalLink',
    'ToggleOptions'
  ]),
  
  /**
   * Indicates whether the button is currently selected.
   */
  selected: PropTypes.bool,
  
  /**
   * If true, the button will be rendered with a transparent background.
   */
  transparent: PropTypes.bool,
  
  /**
   * Callback function to handle click events on the button.
   */
  onClick: PropTypes.func,

  /**
   * Additional MUI Button props like `disabled` can be passed here.
   */
  disabled: PropTypes.bool,
};


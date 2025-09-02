import React from "react";
import PropTypes from "prop-types";
import { Button, styled } from "@mui/material";

// Reuse the pillBackgroundColor function
const pillBackgroundColor = (selected, transparent) => {
  if (selected) {
    return "#49a8ab";
  }
  if (transparent) {
    return "transparent";
  }
  return "#FBFDFD";
};

// Use MUI's styled system to define the button styles
const StyledButton = styled(Button, {
  shouldForwardProp: (prop) => prop !== "buttonType" && prop !== "transparent",
})(({ buttonType, selected, disabled, transparent }) => ({
  ...(buttonType === "LightButton" && {
    backgroundColor: "#e3f2f4",
    borderRadius: "200px",
    color: "#000",
    padding: "10px 20px",
    borderColor: "#e3f2f4",
    "&:hover": {
      borderColor: "#62b8bc",
      backgroundColor: "#49a8ab",
      color: "#000",
    },
  }),
  ...(buttonType === "PillButton" && {
    backgroundColor: pillBackgroundColor(selected, transparent),
    borderRadius: "200px",
    color: "#000",
    padding: "10px 20px",
    borderColor: "#e3f2f4",
    "&:hover": {
      borderColor: "#62b8bc",
      backgroundColor: "#49a8ab",
      color: "#000",
    },
  }),
  ...(buttonType === "ValuesChanged" && {
    backgroundColor: "rgba(255, 150, 28, 0.2)",
    borderRadius: "999px",
    padding: "0.5rem",
    "&:hover": {
      backgroundColor: "rgba(255, 150, 28, 0.3)",
    },
    "@media (max-width:600px)": {
      padding: "0.5rem",
      borderRadius: "999px",
      "& .MuiTypography-root": {
        fontSize: "0.7rem",
      },
    },
  }),
  ...(buttonType === "ModalLink" && {
    color: "white",
    textTransform: "none",
    marginLeft: "2em",
    textDecoration: "underline",
  }),
  ...(buttonType === "ToggleOptions" && {
    backgroundColor: selected ? "#598444" : "white",
    color: selected ? "white" : "#5C8136",
    border: "10px",
    "&:hover": {
      backgroundColor: selected ? "#598444" : "white",
      color: selected ? "white" : "#5C8136",
    },
  }),
  ...(buttonType === "Yes" && {
    background: selected ? "#1976d2" : "",
    border: "2px solid #959393ff",
    "&:hover": {
      background: selected ? "#115293" : "",
      border: "2px solid #000000",
    },
    "&:focus": {
      outline: "none",
      boxShadow: "none",
      border: "2px solid #959393ff",
      "&:focus-visible": {
        outline: "none",
        boxShadow: "none",
      }
    }
  }),
  ...(buttonType === "No" && {
    background: selected ? "#d32f2f" : "",
    border: "2px solid #959393ff",
    color: selected ? "#fff" : "#d32f2f",
    "&:hover": {
      background: selected ? "#b71c1c" : "",
      border: "2px solid #000000",
    },
     ".MuiButton-icon": {
      color: !selected ? "#b71c1c" : "",
    },
    "&:focus": {
      outline: "none",
      boxShadow: "none",
      border: "2px solid #959393ff",
      "&:focus-visible": {
        outline: "none",
        boxShadow: "none",
      }
    }
  }),
  ...(buttonType === "Back" && {
    background: "#598444",
    border: "2px solid #598444",
    color: "#fff",
    "&:hover": {
      background: "#466734",
      border: "2px solid #466734",
      boxShadow: "0 0 0 2px #466734",
    },
    ".MuiButton-icon": {
      color: "#fff",
    },
    ".MuiTypography-root": {
      fontSize: "1rem",
      color: "#fff",
    },
    "&:focus": {
      outline: "none",
      boxShadow: "none",
    },
    "&:hover:focus": {
      border: "2px solid #466734",
      background: "#466734",
    },
  }),
  ...(buttonType === "Next" && {
    background: "#598444",
    border: "2px solid #598444",
    color: "#fff",
    "&:disabled": {
      background: "#bdbdbd",
      border: "1px solid #000000",
    },
    "&:hover": {
      background: "#466734",
      border: "2px solid #466734",
      boxShadow: "0 0 0 2px #466734",
    },
    ".MuiButton-icon": {
      color: disabled ? "#000" : "#fff",
    },
    ".MuiTypography-root": {
      fontSize: "1rem",
      color: disabled ? "#000" : "#fff",
    },
    "&:focus": {
      outline: "none",
      boxShadow: "none",
    },
    "&:hover:focus": {
      border: "2px solid #466734",
      background: "#466734",
    },
  }),
  minWidth: "24px",
  minHeight: "24px",
  "&.Mui-disabled": {
    color: "#757575",
  },
}));

export const PSAButton = ({
  title,
  buttonType = "",
  hoverText,
  selected = false,
  transparent = false,
  onClick = () => { },
  ...props
}) => {
  return (
    <StyledButton
      buttonType={buttonType}
      selected={selected}
      transparent={transparent}
      onClick={onClick}
      title={hoverText}
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
  title: PropTypes.node,

  /**
   * The type of button to render, affecting its styling and behavior.
   * Options include 'LightButton', 'PillButton', 'ValuesChanged', 'ModalLink', or 'ToggleOptions'.
   */
  buttonType: PropTypes.oneOf([
    "LightButton",
    "PillButton",
    "ValuesChanged",
    "ModalLink",
    "ToggleOptions",
    "Yes",
    "No",
    "Back",
    "Next",
    "",
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

  /**
   * The text displayed on the button upon hovering.
   */
  hoverText: PropTypes.string,
};
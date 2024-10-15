import React from "react";
import PropTypes from "prop-types";
import { Button, Typography, useTheme } from "@mui/material";

/**
 * Custom Button component,
 *  styling is based on [Figma](https://www.figma.com/design/dipljCC6Z3GZBFhJqth7a7/PSI-Components?node-id=393-5807&node-type=canvas&m=dev), 
 *  component is based on [MUI Button](https://mui.com/api/button/).
 */
export function PSAFigmaButton({
  variant = "standard",
  icon,
  rightIcon = false,
  leftIcon = false,
  text = "Next",
  ...props
}) {
  const theme = useTheme();

  const customStyles = () => {
    switch (variant) {
      case "standard":
        return {
          padding: "0.20381rem 1.1875rem",
          background: "#FFF",
          boxShadow: "0px 1px 10px 0px rgba(0, 0, 0, 0.10)",
          ".MuiButton-icon": {
            margin: "-0.2rem",
            color: theme.palette.additional.greydark,
          },
          "&:hover": {
            backgroundColor: theme.palette.additional.greydark,
            "& .MuiTypography-root": {
              color: "#fff",
            },
            ".MuiButton-icon": {
              color: "#fff",
            },
          },
        };
      case "color":
        return {
          padding: "0.16531rem 0.75rem",
          boxShadow: "0px 1px 10px 0px rgba(0, 0, 0, 0.10)",
          background: theme.palette.main.accent2,
          "& .MuiTypography-root": {
            color: "#fff",
          },
          ".MuiButton-icon": {
            margin: "-0.2rem",
            color: "#fff",
          },
          "&:hover": {
            backgroundColor: theme.palette.additional.greydark,
            ".MuiButton-icon": {
              color: "#fff",
            },
          },
        };
      case "text":
        return {
          "& .MuiTypography-root": {
            textDecoration: "underline",
          },
          ".MuiButton-icon": {
            margin: "-0.2rem",
            color: theme.palette.additional.greydark,
          },
          "&:hover": {
            "& .MuiTypography-root": {
              color: theme.palette.main.accent2,
            },
            ".MuiButton-icon": {
              color: theme.palette.main.accent2,
            },
          },
        };
      default:
        return {};
    }
  };

  return (
    <Button
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        gap: "0.375rem",
        borderRadius: "0.50956rem",
        textTransform: "none",
        ...customStyles(),
      }}
      color=""
      variant="text"
      startIcon={leftIcon && icon}
      endIcon={rightIcon && icon}
      {...props}
    >
      <Typography
        sx={{
          color: theme.palette.additional.greydark,
          fontFamily: "IBM Plex Sans",
          fontSize: "1.27388rem",
          fontStyle: "normal",
          fontWeight: 500,
          lineHeight: "normal",
        }}
      >
        {text}
      </Typography>
    </Button>
  );
}

/* Define Props Type */

PSAFigmaButton.propTypes = {
  /**
   * The variant of button.
   * 
   *  Options include `standard`, `color`, `text`.
   */
  variant: PropTypes.oneOf(['standard', 'color', 'text']),
  /**
   * Icon used in the button.
   * 
   * The options here is just for illustration of different kinds of icons, any icons can be used.
   */
  icon: PropTypes.node,
  /**
   * Props for rendering buttons on the right side of the button. 
   */
  rightIcon: PropTypes.bool,
  /**
   * Props for rendering buttons on the left side of the button. 
   */
  leftIcon: PropTypes.bool,
  /**
   * Props for rendering texts in the button. 
   */
  text: PropTypes.string,
  /**
   *  These are additional props which could be passed to the wrapped MUI Button, refer to [MUI docs](https://mui.com/api/button/) for available props.
   */
  props: PropTypes.object
};

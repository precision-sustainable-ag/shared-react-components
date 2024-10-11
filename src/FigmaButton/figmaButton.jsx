import React from "react";
import PropTypes from "prop-types";
import { Button, Typography, useTheme } from "@mui/material";

export function PSAFigmaButton({
  variant = "standard",
  icon,
  rightIcon = false,
  leftIcon = false,
  text = "Next",
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

PSAFigmaButton.propTypes = {};

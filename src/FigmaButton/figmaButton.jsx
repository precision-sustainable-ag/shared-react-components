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
  return (
    <Button
      sx={{
        display: "flex",
        // width: "6.4375rem",
        // height: "2.375rem",
        padding: "0.20381rem 1.1875rem",
        justifyContent: "center",
        alignItems: "center",
        gap: "0.375rem",
        borderRadius: "0.50956rem",
        background: "var(--Background-White, #FFF)",
        /* PSI - Dropshadow */
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
      }}
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

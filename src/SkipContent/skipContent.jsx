import React from "react";
import { Link } from "@mui/material";
import PropTypes from "prop-types";

export function PSASkipContent({ href, text, sx }) {
  return (
    <Link
      href={href}
      underline="none"
      sx={{
        position: "fixed",
        left: "16px",
        fontFamily: "IBM Plex Sans",
        color: "white",
        backgroundColor: "#598444",
        outlineOffset: "5px",
        outlineColor: "black",
        padding: "8px 16px",
        border: "1px solid #4f5c69",
        borderRadius: "12px",
        fontWeight: "bold",
        zIndex: 1001,
        top: "-80px",
        transition: "top 195ms cubic-bezier(0.4, 0, 1, 1)",
        "&:focus": {
          top: "16px",
          transition: "top 225ms cubic-bezier(0, 0, 0.2, 1)",
        },
        "&:hover": {
          color: "black",
          backgroundColor: "#f0f7eb",
        },
        ...sx,
      }}
    >
      {text}
    </Link>
  );
}

/* Define Props Type */

PSASkipContent.propTypes = {
  /**
   * The href that the button links to.
   */
  href: PropTypes.string,
  /**
   * The etxt of the button.
   */
  text: PropTypes.string,
  /**
   * Additional stylings.
   */
  sx: PropTypes.object,
};

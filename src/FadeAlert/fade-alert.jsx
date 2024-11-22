import React from "react";
import { Alert, Fade } from "@mui/material";
import PropTypes from "prop-types";

export function FadeAlert({
  showAlert = true,
  variant = "standard",
  severity = "error",
  action = null,
  message = "",
}) {
  return (
    <Fade in={showAlert}>
      <Alert variant={variant} severity={severity} action={action}>
        {message}
      </Alert>
    </Fade>
  );
}

FadeAlert.propTypes = {
  /**
   * controls whether to show the component, default to true
   */
  showAlert: PropTypes.bool,
  /**
   * controls the variant of the component
   */
  variant: PropTypes.oneOf(["filled", "outlined", "standard"]),
  /**
   * defines the color and icon used
   */
  severity: PropTypes.oneOf(["error", "warning", "info", "success"]),
  /**
   * action to display, renders after the message, at the end of the alert.
   */
  action: PropTypes.node,
  /**
   * controls the message shows inside the component
   */
  message: PropTypes.node,
};

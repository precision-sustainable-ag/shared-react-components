import React from "react";
import PropTypes from "prop-types";
import { Button, Typography } from "@mui/material";

export function PSAAuthbutton({
  type,
  variant = "text",
  onClickCallback = () => {},
}) {
  const { logout, loginWithPopup, loginWithRedirect } = useAuth0();

  const handleLogin = async () => {
    if (window.Cypress) await loginWithRedirect();
    else await loginWithPopup();
  };

  const handleSignUp = async () => {
    await loginWithPopup({
      authorizationParams: {
        screen_hint: "signup",
      },
    });
  };

  const handleLogout = () => {
    logout({
      logoutParams: {
        returnTo: window.location.origin,
      },
    });
  };

  const handleClick = () => {
    switch (type) {
      case "Login":
        return handleLogin();
      case "Signup":
        return handleSignUp();
      case "Logout":
        return handleLogout();
      default:
        return onClickCallback();
    }
  };

  const getColor = () => {
    switch (type) {
      case "Login":
        return "#008000";
      case "Signup":
        return "purple";
      case "Logout":
        return "#8B0000";
      default:
        return "black";
    }
  };

  return (
    <Button variant={variant} onClick={handleClick} data-test="auth_button">
      <Typography
        sx={{ fontSize: "0.875rem", fontWeight: "bold" }}
        color={getColor()}
      >
        {type}
      </Typography>
    </Button>
  );
}

/* Define Props Type */

PSAAuthbutton.propTypes = {
  /** The type of button. Must be either "Login", "Signup", or "Logout". */
  type: PropTypes.oneOf(["Login", "Signup", "Logout"]).isRequired,

  /** The variant of the button (e.g., "text", "outlined", etc.). Defaults to "text". */
  variant: PropTypes.string,

  /** Callback function to handle additional onClick behavior. */
  onClickCallback: PropTypes.func,
};

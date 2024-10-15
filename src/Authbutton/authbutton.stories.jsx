import React from "react";
import { PSAAuthbutton } from "./authbutton";
import { Button, Typography } from "@mui/material";

const meta = {
  component: PSAAuthbutton,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
  },
};

export default meta;

// Default Story for PSAAuthbutton
export const DefaultAuthbutton = {
  args: {
    type: "Login", // Default type, could be "Login", "Signup", or "Logout"
    variant: "text", // Default variant, can be "text", "contained", etc.
    onClickCallback: () => alert("Button clicked!"), // Default callback
  },
};

// Login Button Example
export const LoginButton = {
  args: {
    type: "Login",
    variant: "contained",
    onClickCallback: () => alert("Login button clicked!"),
  },
};

// Signup Button Example
export const SignupButton = {
  args: {
    type: "Signup",
    variant: "outlined",
    onClickCallback: () => alert("Signup button clicked!"),
  },
};

// Logout Button Example
export const LogoutButton = {
  args: {
    type: "Logout",
    variant: "text",
    onClickCallback: () => alert("Logout button clicked!"),
  },
};

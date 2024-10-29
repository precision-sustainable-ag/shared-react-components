import { TextField, styled } from "@mui/material";

/**
 * This component is based on [MUI TextField](https://mui.com/material-ui/react-text-field/) component.
 */
export const PSATextField = styled(TextField)(({ theme }) => ({
  ".MuiOutlinedInput-root": {
    boxShadow: "0px 1px 10px 0px rgba(0, 0, 0, 0.10)",
    fieldset: {
      borderWidth: "2px",
      borderColor: theme.palette.main.text,
    },
    "&:not(.Mui-disabled):not(.Mui-error):hover fieldset": {
      borderColor: theme.palette.main.accent1,
    },
    "&.Mui-focused fieldset": {
      borderColor: theme.palette.main.accent1,
    },
    "&.Mui-error fieldset": {
      borderColor: theme.palette.additional.error,
    },
    "&.Mui-disabled fieldset": {
      borderColor: theme.palette.main.background1,
    },
  },
  "& label": {
    transform: "translate(0, -20px) ",
    transformOrigin: "top left",
    color: theme.palette.main.text,
    fontFamily: "IBM Plex Sans",
    fontSize: "0.875rem",
    fontStyle: "italic",
    fontWeight: 500,
    maxWidth: "100%",
    overflow: "visible",
    "&.Mui-focused": {
      color: theme.palette.main.text,
    },
  },
  "legend span": {
    display: "none",
  },
  input: {
    paddingLeft: "1.25rem",
  },
}));

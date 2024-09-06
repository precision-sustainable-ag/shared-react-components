import React, { useState } from "react";
import { FadeAlert } from "./fade-alert";
import { Button, Typography } from "@mui/material";

const meta = {
  component: FadeAlert,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
  },
};

export default meta;

export const DefaultAlert = {
  args: {
    message: "This is an alert component!",
  },
};

export const BasicAlert = {
  render: () => (
    <>
      <FadeAlert severity={"error"} message={"This is an error alert!"} />
      <br />
      <FadeAlert severity={"warning"} message={"This is a warning alert!"} />
      <br />
      <FadeAlert severity={"info"} message={"This is an info alert!"} />
      <br />
      <FadeAlert severity={"success"} message={"This is a success alert!"} />
    </>
  ),
};

export const AlertWithDifferentVariant = {
  render: () => (
    <>
      <FadeAlert variant={"standard"} message={"This is a standard alert!"} />
      <br />
      <FadeAlert variant={"outlined"} message={"This is an outlined alert!"} />
      <br />
      <FadeAlert variant={"filled"} message={"This is a filled alert!"} />
    </>
  ),
};

export const CustomAlert = {
  render: () => {
    const [showAlert, setShowAlert] = useState(true);

    return (
      <>
        <FadeAlert
          showAlert={showAlert}
          variant={"filled"}
          severity={"error"}
          action={
            <Button
              aria-label="close"
              color="inherit"
              size="small"
              onClick={() => setShowAlert(false)}
            >
              CLOSE
            </Button>
          }
          message={
            <Typography fontWeight={600}>
              Network Error - Try again later or refresh the page!
            </Typography>
          }
        />
        <br />
        <Button onClick={() => setShowAlert(true)}>Show Alert</Button>
      </>
    );
  },
};

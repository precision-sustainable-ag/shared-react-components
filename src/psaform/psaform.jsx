import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import {
  Grid,
  Typography,
  Snackbar,
  Checkbox,
  FormGroup,
  FormControlLabel,
} from "@mui/material";
import PSAButton from "../button";
import PSATextField from "../Textfield";

export function PSAForm({
  headerTitle,
  title,
  titleDescription,
  titleTextFieldProps,
  messageTitle,
  messageDescription,
  messageTextFieldProps,
  topicTitle,
  topicDescription,
  checkBoxLabel1,
  topicCheckbox1,
  checkBoxLabel2,
  topicCheckbox2,
  checkBoxLabel3,
  topicCheckbox3,
  nameTitle,
  nameTextFieldProps,
  emailTitle,
  emailTextFieldProps,
  consentRedux,
  pirschAnalytics,
}) {
  const [snackbarData, setSnackbarData] = useState({
    open: false,
    message: "",
    color: "",
  });

  const [feedbackData, setFeedbackData] = useState({
    repository: "dst-feedback",
    title: "",
    comments: "",
    labels: [],
    name: "",
    email: "",
  });

  const convertMessageArr = (arr) => {
    if (arr.length === 0) return "";
    if (arr.length === 1) return `The "${arr[0]}" field is blank`;
    if (arr.length === 2) return `The "${arr.join('" and "')}" fields are blank`;
    return `The "${arr.slice(0, -1).join('", "')}", and "${arr[arr.length - 1]}" fields are blank`;
  };

  const checkDisabled = () => {
    const titleMissing = feedbackData.title === "";
    const commentsMissing = feedbackData.comments === "";
    const labelsMissing = feedbackData.labels.length === 0;
    const messageArr = [];

    if (titleMissing) messageArr.push("Title");
    if (commentsMissing) messageArr.push("Message");
    if (labelsMissing) messageArr.push("Topic");

    const messageStr = convertMessageArr(messageArr);
    return titleMissing || commentsMissing || labelsMissing
      ? { state: true, message: messageStr }
      : { state: false, message: "" };
  };

  useEffect(() => {
    pirschAnalytics("Visited Page", { meta: { visited: "Feedback" } });
  }, [consentRedux]);

  const handleTextInputChange = (event, propertyName) => {
    setFeedbackData({ ...feedbackData, [propertyName]: event.target.value });
  };

  const remove = (arr, value) => {
    const index = arr.indexOf(value);
    if (index > -1) arr.splice(index, 1);
    return arr;
  };

  const handleCheckboxChange = (event) => {
    if (event.target.checked) {
      setFeedbackData({
        ...feedbackData,
        labels: [...feedbackData.labels, event.target.name],
      });
    } else {
      setFeedbackData({
        ...feedbackData,
        labels: remove(feedbackData.labels, event.target.name),
      });
    }
  };

  const handleSnackbarClose = () => setSnackbarData({ ...snackbarData, open: false });

  const handleSubmit = () => {
    fetch("https://developfeedback.covercrop-data.org/v1/issues", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...feedbackData,
        labels: [headerTitle, ...feedbackData.labels],
      }),
    })
      .then((response) => {
        setSnackbarData({
          open: true,
          message: response.status === 201
            ? "Feedback Successfully Submitted!"
            : `Error ${response.status}. ${
                response.status === 400
                  ? "Bad Request"
                  : response.status === 422
                  ? "Unprocessable Entry"
                  : "Internal Server Error"
              }`,
          color: response.status === 201 ? "green" : "red",
        });
        return response.json();
      })
      .catch((error) => console.error(error));
  };

  return (
    <Grid container rowSpacing={5} style={{ padding: "3% 10%", textAlign: "left" }}>
      <Grid container item spacing={1} justifyContent="center">
        <Grid item xs={12}>
          <Typography variant="h3">{headerTitle}</Typography>
        </Grid>
      </Grid>

      {/* Feedback Title */}
      <Grid container item spacing={1} justifyContent="flex-start" alignItems="flex-start">
        <Grid item xs={12}>
          <Typography variant="h6" display="inline-block">
            {title}
          </Typography>
          <Typography variant="h6" display="inline-block" style={{ color: "red" }}>
            *
          </Typography>
        </Grid>
        <Grid item xs={12}>
          <Typography variant="body1">{titleDescription}</Typography>
        </Grid>
        <Grid item xs={12}>
          <PSATextField
            {...titleTextFieldProps}
            onChange={(event) => handleTextInputChange(event, "title")}
          />
        </Grid>
      </Grid>

      {/* Feedback Message */}
      <Grid container item spacing={1} justifyContent="flex-start" alignItems="flex-start">
        <Grid item xs={12}>
          <Typography variant="h6" display="inline-block">
            {messageTitle}
          </Typography>
          <Typography variant="h6" display="inline-block" style={{ color: "red" }}>
            *
          </Typography>
        </Grid>
        <Grid item xs={12}>
          <Typography variant="body1">{messageDescription}</Typography>
        </Grid>
        <Grid item xs={12}>
          <PSATextField
            {...messageTextFieldProps}
            onChange={(event) => handleTextInputChange(event, "comments")}
          />
        </Grid>
      </Grid>

      {/* Feedback Topic */}
      <Grid container item spacing={1} justifyContent="flex-start" alignItems="flex-start">
        <Grid item xs={12}>
          <Typography variant="h6" display="inline-block">
            {topicTitle}
          </Typography>
          <Typography variant="h6" display="inline-block" style={{ color: "red" }}>
            *
          </Typography>
        </Grid>
        <Grid item xs={12}>
          <Typography variant="body1">{topicDescription}</Typography>
        </Grid>
        <Grid item xs={12}>
          <FormGroup>
            <FormControlLabel
              control={<Checkbox {...topicCheckbox1} onChange={handleCheckboxChange} />}
              label={checkBoxLabel1}
            />
            <FormControlLabel
              control={<Checkbox {...topicCheckbox2} onChange={handleCheckboxChange} />}
              label={checkBoxLabel2}
            />
            <FormControlLabel
              control={<Checkbox {...topicCheckbox3} onChange={handleCheckboxChange} />}
              label={checkBoxLabel3}
            />
          </FormGroup>
        </Grid>
      </Grid>

      {/* Name */}
      <Grid container item spacing={1} justifyContent="flex-start" alignItems="flex-start">
        <Grid item xs={12}>
          <Typography variant="h6">{nameTitle}</Typography>
        </Grid>
        <Grid item xs={12}>
          <PSATextField
            {...nameTextFieldProps}
            onChange={(event) => handleTextInputChange(event, "name")}
          />
        </Grid>
      </Grid>

      {/* Email */}
      <Grid container item spacing={1} justifyContent="flex-start" alignItems="flex-start">
        <Grid item xs={12}>
          <Typography variant="h6">{emailTitle}</Typography>
        </Grid>
        <Grid item xs={12}>
          <PSATextField
            {...emailTextFieldProps}
            onChange={(event) => handleTextInputChange(event, "email")}
          />
        </Grid>
      </Grid>

      {/* Submit */}
      <Grid container item spacing={1} justifyContent="flex-start" alignItems="flex-start">
        {checkDisabled().state && (
          <Grid item xs={12}>
            <Typography variant="body1" style={{ color: "red" }}>
              {checkDisabled().message}. Please fill all required fields before submitting.
            </Typography>
          </Grid>
        )}
        <Grid item xs={12}>
          <PSAButton
            title="Submit"
            disabled={checkDisabled().state}
            onClick={handleSubmit}
            size="large"
            variant="outlined"
          />
        </Grid>
      </Grid>
      <Snackbar
        open={snackbarData.open}
        autoHideDuration={5000}
        onClose={handleSnackbarClose}
        message={snackbarData.message}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
        color={snackbarData.color}
      />
    </Grid>
  );
}

/* Define Props Type */
PSAForm.propTypes = {
  headerTitle: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  titleDescription: PropTypes.string.isRequired,
  titleTextFieldProps: PropTypes.object, // Object containing props for the title text field
  messageTitle: PropTypes.string.isRequired,
  messageDescription: PropTypes.string.isRequired,
  messageTextFieldProps: PropTypes.object, // Object containing props for the message text field
  topicTitle: PropTypes.string.isRequired,
  topicDescription: PropTypes.string.isRequired,
  checkBoxLabel1: PropTypes.string.isRequired,
  topicCheckbox1: PropTypes.shape({
    checked: PropTypes.bool,
    name: PropTypes.string.isRequired,
  }), // Props object for the first checkbox
  checkBoxLabel2: PropTypes.string.isRequired,
  topicCheckbox2: PropTypes.shape({
    checked: PropTypes.bool,
    name: PropTypes.string.isRequired,
  }), // Props object for the second checkbox
  checkBoxLabel3: PropTypes.string.isRequired,
  topicCheckbox3: PropTypes.shape({
    checked: PropTypes.bool,
    name: PropTypes.string.isRequired,
  }), // Props object for the third checkbox
  nameTitle: PropTypes.string.isRequired,
  nameTextFieldProps: PropTypes.object, // Object containing props for the name text field
  emailTitle: PropTypes.string.isRequired,
  emailTextFieldProps: PropTypes.object, // Object containing props for the email text field
  consentRedux: PropTypes.bool, // Boolean indicating consent (optional)
  pirschAnalytics: PropTypes.func.isRequired, // Function for analytics callback
};

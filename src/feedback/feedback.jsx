import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import {
  Grid,
  Typography,
  Button,
  Snackbar,
  Checkbox,
  FormGroup,
  FormControlLabel,
} from "@mui/material";
import PSAButton from "../button";
import PSATextField from "../Textfield";
export function PSAFeedback({ title, label, consentRedux, pirschAnalytics }) {
  const [snackbarData, setSnackbarData] = useState({
    open: false,
    message: "",
    color: "",
  });

  const [feedbackData, setFeedbackData] = useState({
    repository: "dst-feedback", //Repo-name
    title: "",
    comments: "",
    labels: [],
    // screenshot: null,
    name: "",
    email: "",
  });

  const convertMessageArr = (arr) => {
    if (arr.length === 0) {
      return "";
    }
    if (arr.length === 1) {
      return `The "${arr[0]}" field is blank`;
    }
    if (arr.length === 2) {
      return `The "${arr.join('" and "')}" fields are blank`;
    }
    return `The "${arr.slice(0, -1).join('", "')}", and "${arr[arr.length - 1]}" fields are blank`;
  };

  const checkDisabled = () => {
    const titleMissing = feedbackData.title === "";
    const commentsMissing = feedbackData.comments === "";
    const labelsMissing = feedbackData.labels.length === 0;
    const messageArr = [];

    if (titleMissing) {
      messageArr.push("Title");
    }
    if (commentsMissing) {
      messageArr.push("Message");
    }
    if (labelsMissing) {
      messageArr.push("Topic");
    }
    const messageStr = convertMessageArr(messageArr);
    if (titleMissing || commentsMissing || labelsMissing) {
      return { state: true, message: messageStr };
    }
    return { state: false, message: "" };
  };
  useEffect(() => {
    pirschAnalytics('Visited Page', { meta: { visited: 'Feedback' } });
  }, [consentRedux]);
  useEffect(() => {
    document.title = "Feedback";
  }, []);

  const handleTextInputChange = (event, propertyName) => {
    setFeedbackData({ ...feedbackData, [propertyName]: event.target.value });
  };

  const remove = (arr, value) => {
    const index = arr.indexOf(value);
    if (index > -1) {
      arr.splice(index, 1);
    }
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

  const handleSnackbarClose = () => {
    setSnackbarData({ ...snackbarData, open: false });
  };

  const handleSubmit = () => {
    fetch("https://developfeedback.covercrop-data.org/v1/issues", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        ...feedbackData,
        labels: [label, ...feedbackData.labels],
      }),
    })
      .then((response) => {
        if (response.status === 201) {
          setSnackbarData({
            open: true,
            message: "Feedback Successfully Submitted!",
            color: "green",
          });
        } else if (response.status === 400) {
          setSnackbarData({
            open: true,
            message: `Error ${response.status}. Bad Request`,
            color: "red",
          });
        } else if (response.status === 422) {
          setSnackbarData({
            open: true,
            message: `Error ${response.status}. Unprocessable Entry`,
            color: "red",
          });
        } else if (response.status === 500) {
          setSnackbarData({
            open: true,
            message: `Error ${response.status}. Internal Server Error`,
            color: "red",
          });
        }
        return response.json();
      })
      .catch((error) => {
        // eslint-disable-next-line
        console.error(error);
      });
  };

  return (
    <Grid
      container
      rowSpacing={5}
      style={{
        paddingLeft: "10%",
        paddingRight: "10%",
        paddingTop: "3%",
        paddingBottom: "3%",
      }}
    >
      {/* Title */}
      <Grid container item spacing={1} justifyContent="center">
        <Grid item xs={12}>
          <Typography variant="h3">{title}</Typography>
        </Grid>
      </Grid>

      {/* Feedback Title */}
      <Grid
        container
        item
        spacing={1}
        justifyContent="flex-start"
        alignItems="flex-start"
      >
        <Grid item xs={12}>
          <Typography variant="h6" display="inline-block">
            Title
          </Typography>
          <Typography
            variant="h6"
            display="inline-block"
            style={{ color: "red" }}
          >
            *
          </Typography>
        </Grid>
        <Grid item xs={12}>
          <Typography variant="body1">
            Give your feedback a short descriptive title.
          </Typography>
        </Grid>
        <Grid item xs={12}>
          <PSATextField
            placeholder="Enter Your Title"
            variant="outlined"
            onChange={(event) => handleTextInputChange(event, "title")}
            data-test="feedback_title"
          />
        </Grid>
      </Grid>

      {/* Feedback Messsage */}
      <Grid
        container
        item
        spacing={1}
        justifyContent="flex-start"
        alignItems="flex-start"
      >
        <Grid item xs={12}>
          <Typography variant="h6" display="inline-block">
            Message{" "}
          </Typography>
          <Typography
            variant="h6"
            display="inline-block"
            style={{ color: "red" }}
          >
            *
          </Typography>
        </Grid>
        <Grid item xs={12}>
          <Typography variant="body1">
            Explain your feedback as thoroughly as you can. Your feedback will
            help us improve the species selection experience. You can attach a
            screenshot of your feedback below.
          </Typography>
        </Grid>
        <Grid item xs={12}>
          <PSATextField
            placeholder="Enter Your Feedback"
            multiline
            variant="outlined"
            fullWidth
            minRows={3}
            onChange={(event) => handleTextInputChange(event, "comments")}
            data-test="feedback_message"
          />
        </Grid>
      </Grid>

      {/* Feedback Topic */}
      <Grid
        container
        item
        spacing={1}
        justifyContent="flex-start"
        alignItems="flex-start"
      >
        <Grid item xs={12}>
          <Typography variant="h6" display="inline-block">
            Topic{" "}
          </Typography>
          <Typography
            variant="h6"
            display="inline-block"
            style={{ color: "red" }}
          >
            *
          </Typography>
        </Grid>
        <Grid item xs={12}>
          <Typography variant="body1">What is this feedback about?</Typography>
        </Grid>
        <Grid item xs={12}>
          <FormGroup>
            <FormControlLabel
              control={
                <Checkbox
                  onChange={handleCheckboxChange}
                  name="About the Cover Crop Data"
                  data-test="feedback_data"
                />
              }
              label="About the Cover Crop Data"
            />
            <FormControlLabel
              control={
                <Checkbox
                  onChange={handleCheckboxChange}
                  name="About the Website"
                  data-test="feedback_website"
                />
              }
              label="About the Website"
            />
            <FormControlLabel
              control={
                <Checkbox onChange={handleCheckboxChange} name="Other" data-test="feedback_other" />
              }
              label="Other"
            />
          </FormGroup>
        </Grid>
      </Grid>

      {/* Name */}
      <Grid
        container
        item
        spacing={1}
        justifyContent="flex-start"
        alignItems="flex-start"
      >
        <Grid item xs={12}>
          <Typography variant="h6">Name </Typography>
        </Grid>
        <Grid item xs={12}>
          <PSATextField
            placeholder="Enter Name"
            variant="outlined"
            onChange={(event) => handleTextInputChange(event, "name")}
            data-test="feedback_name"
          />
        </Grid>
      </Grid>

      {/* Email */}
      <Grid
        container
        item
        spacing={1}
        justifyContent="flex-start"
        alignItems="flex-start"
      >
        <Grid item xs={12}>
          <Typography variant="h6">Email </Typography>
        </Grid>
        <Grid item xs={12}>
          <PSATextField
            placeholder="Enter Email"
            variant="outlined"
            onChange={(event) => handleTextInputChange(event, "email")}
            data-test="feedback_email"
          />
        </Grid>
      </Grid>

      {/* Submit */}
      <Grid
        container
        item
        spacing={1}
        justifyContent="flex-start"
        alignItems="flex-start"
      >
        {checkDisabled().state && (
          <Grid item xs={12}>
            <Typography variant="body1" style={{ color: "red" }}  data-test="feedback_alert">
              {checkDisabled().message}. Please fill all required fields before
              submitting.
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
            data-test="feedback_submit"
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
        data-test="feedback_snackbar"
      />
    </Grid>
  );
}

PSAFeedback.propTypes = {
  /** 
   * The title of the feedback section. This will be displayed at the top of the component.
   * Required: Expected to be a string.
   */
  title: PropTypes.string.isRequired,

  /** 
   * The label text associated with the feedback input.
   * This will be shown either with a selector or a seed calculator, depending on the implementation.
   * Required: Expected to be a string.
   */
  label: PropTypes.string.isRequired,

  /** 
   * Redux object that handles the user's consent state for feedback.
   * Used to manage and store consent-related information in the feedback process.
   * Required: Expected to be an object.
   */
  consentRedux: PropTypes.object.isRequired,

  /** 
   * Function for sending data to the Pirsch Analytics service.
   * It tracks and logs feedback or user interactions within the component.
   * Required: Expected to be a function.
   */
  pirschAnalytics: PropTypes.func.isRequired,
};



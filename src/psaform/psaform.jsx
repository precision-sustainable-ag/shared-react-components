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

export const PSAForm = ({
  apiUrl,
  submitMessage,
  headerTitle,
  textFields,
  checkboxes,
  buttons,
  consentRedux,
  pirschAnalytics,
}) => {

  const [isSubmitDisabled, setIsSubmitDisabled] = useState(true);

  const remove = (arr, value) => arr.filter((item) => item !== value);

  const [snackbarData, setSnackbarData] = useState({
    open: false,
    message: "",
    color: "",
  });

  const initialFormData = textFields.reduce((acc, field) => {
    acc[field.name] = "";
    return acc;
  }, { repository: "dst", labels: [] });

  const [formData, setFormData] = useState(initialFormData);

  useEffect(() => {
    // Check for required fields whenever formData changes
    const { state } = checkDisabled();
    setIsSubmitDisabled(state);
  }, [formData]);

  useEffect(() => {
    pirschAnalytics("Visited Page", { meta: { visited: "Feedback" } });
  }, [consentRedux]);

  const convertMessageArr = (arr) => {
    if (arr.length === 0) return "";
    if (arr.length === 1) return `The "${arr[0]}" field is blank`;
    if (arr.length === 2) return `The "${arr.join('" and "')}" fields are blank`;
    return `The "${arr.slice(0, -1).join('", "')}", and "${arr[arr.length - 1]}" fields are blank`;
  };

  const checkDisabled = () => {
    const messageArr = [];
  
    // Check required text fields
    textFields.forEach((field) => {
      if (field.required && formData[field.name] === "") {
        messageArr.push(field.label);
      }
    });
  
    // Check required checkboxes in each group
    checkboxes.forEach((group) => {
      if(group.required && formData.labels.length === 0)
      {
        messageArr.push(group.title);
      }
    });
  
    const messageStr = convertMessageArr(messageArr);
    return messageArr.length > 0
      ? { state: true, message: messageStr }
      : { state: false, message: "" };
  }; 

  const handleTextInputChange = (event, name) => {
    setFormData({ ...formData, [name]: event.target.value });
  };

  const handleCheckboxChange = (event) => {
    const { name, checked } = event.target;
    setFormData((prev) => ({
      ...prev,
      labels: checked ? [...(prev.labels || []), name] : remove(prev.labels || [], name),
    }));
  };

  const handleSubmit = () => {
    const { state, message } = checkDisabled();
    if (state) {
      setSnackbarData({ open: true, message, color: "red" });
      return;
    }

    fetch(apiUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    })
      .then((response) => {
        setSnackbarData({
          open: true,
          message: response.status === 201
            ? submitMessage
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

      {/* Dynamically Render Text Fields */}
      {textFields.map((field, index) => (
        <Grid key={index} container item spacing={1} justifyContent="flex-start" alignItems="flex-start">
          <Grid item xs={12}>
            <Typography variant="h6">
              {field.label} {field.required && <span style={{ color: "red" }}>*</span>}
            </Typography>
          </Grid>
          <Grid item xs={12}>
            <Typography variant="body1">{field.description}</Typography>
          </Grid>
          <Grid item xs={12}>
            <PSATextField
              {...field.props}
              onChange={(event) => handleTextInputChange(event, field.name)}
            />
          </Grid>
        </Grid>
      ))}

        {/* Dynamically Render Checkbox Groups */}
    {checkboxes.map((group, groupIndex) => (
      <Grid key={groupIndex} container item spacing={1} justifyContent="flex-start" alignItems="flex-start">
        <Grid item xs={12}>
          <Typography variant="h6">
            {group.title} {group.required && <span style={{ color: "red" }}>*</span>}
          </Typography>
        </Grid>
        <Grid item xs={12}>
          <FormGroup>
            {group.options.map((checkbox, index) => (
              <FormControlLabel
                key={index}
                control={
                  <Checkbox
                    {...checkbox.props}
                    onChange={handleCheckboxChange}
                  />
                }
                label={checkbox.label}
              />
            ))}
          </FormGroup>
        </Grid>
      </Grid>
    ))}

    {/* Submit Button with Disabled State */}
    <Grid container item spacing={1} justifyContent="flex-start" alignItems="flex-start">
      {isSubmitDisabled && (
        <Grid item xs={12}>
          <Typography variant="body1" style={{ color: "red" }}>
            {checkDisabled().message}. Please fill all required fields before submitting.
          </Typography>
        </Grid>
      )}
      {buttons.map((button, index) => (
        <Grid key={index} item xs={12}>
          <PSAButton
            {...button.props}
            onClick={button.action === "submit" ? handleSubmit : button.onClick}
            disabled={isSubmitDisabled}
          />
        </Grid>
      ))}
    </Grid>

      <Snackbar
        open={snackbarData.open}
        autoHideDuration={5000}
        onClose={() => setSnackbarData({ ...snackbarData, open: false })}
        message={snackbarData.message}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
        color={snackbarData.color}
      />
    </Grid>
  );
};

PSAForm.propTypes = {
  apiUrl: PropTypes.string.isRequired,
  submitMessage: PropTypes.string.isRequired,
  headerTitle: PropTypes.string.isRequired,
  textFields: PropTypes.arrayOf(
    PropTypes.shape({
      label: PropTypes.string.isRequired,
      description: PropTypes.string,
      props: PropTypes.object, // Any additional props for PSATextField component
      name: PropTypes.string.isRequired,
      required: PropTypes.bool, // Determines if the field is required
    })
  ).isRequired,
  checkboxes: PropTypes.arrayOf(
    PropTypes.shape({
      label: PropTypes.string.isRequired,
      props: PropTypes.shape({
        checked: PropTypes.bool,
        name: PropTypes.string.isRequired,
      }),
      required: PropTypes.bool, // Determines if the checkbox is required
    })
  ),
  buttons: PropTypes.arrayOf(
    PropTypes.shape({
      props: PropTypes.object, // Any additional props for PSAButton component
      action: PropTypes.string, // "submit" for submit action, or any custom identifier
      onClick: PropTypes.func, // onClick function if action is not "submit"
    })
  ).isRequired,
  consentRedux: PropTypes.bool, // Redux state for user consent
  pirschAnalytics: PropTypes.func.isRequired, // Analytics function
};

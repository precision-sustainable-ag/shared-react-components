import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { Grid, Typography, Snackbar, Checkbox, FormGroup, FormControlLabel } from "@mui/material";
import PSAButton from "../button";
import PSATextField from "../Textfield";

export const PSAForm = ({
  apiUrl,
  submitMessage,
  headerTitle,
  fields, // Single prop for both text fields and checkboxes
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

  const initialFormData = fields.reduce((acc, field) => {
    if (field.type === "text") {
      acc[field.name] = "";
    }
    return acc;
  }, {labels: []});

  const [formData, setFormData] = useState(initialFormData);

  useEffect(() => {
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

    fields.forEach((field) => {
      if (field.required && ((field.type === "text" && formData[field.name] === "") ||
        (field.type === "checkbox" && formData.labels.length === 0))) {
        messageArr.push(field.label);
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
            : `Error ${response.status}. ${response.status === 400
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

      {fields.map((field, index) => (
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
            {field.type === "text" ? (
              <PSATextField
                {...field.props}
                onChange={(event) => handleTextInputChange(event, field.name)}
              />
            ) : (
              <FormGroup>
               {field.options.map((checkbox, index) => (
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
            )}
          </Grid>
        </Grid>
      ))}

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
  fields: PropTypes.arrayOf(
    PropTypes.shape({
      type: PropTypes.oneOf(["text", "checkbox"]).isRequired,
      label: PropTypes.string.isRequired,
      description: PropTypes.string,
      props: PropTypes.object,
      options: PropTypes.arrayOf(
        PropTypes.shape({
          label: PropTypes.string.isRequired,
          props: PropTypes.object,
        })),
      name: PropTypes.string.isRequired,
      required: PropTypes.bool,
    })
  ).isRequired,
  buttons: PropTypes.arrayOf(
    PropTypes.shape({
      props: PropTypes.object,
      action: PropTypes.string,
      onClick: PropTypes.func,
    })
  ).isRequired,
  consentRedux: PropTypes.bool,
  pirschAnalytics: PropTypes.func.isRequired,
};

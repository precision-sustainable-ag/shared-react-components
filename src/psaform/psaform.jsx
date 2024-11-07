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
}) => {
  const [isSubmitDisabled, setIsSubmitDisabled] = useState(true);

  const [snackbarData, setSnackbarData] = useState({
    open: false,
    message: "",
    color: "",
  });

  const initialFormData = fields.reduce((acc, field) => {
    acc[field.name] = "";
    return acc;
  }, {labels: []});

  const [formData, setFormData] = useState(initialFormData);

  useEffect(() => {
    const { state } = checkDisabled();
    setIsSubmitDisabled(state);
  }, [formData]);

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
    const remove = (arr, value) => arr.filter((item) => item !== value);
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
  /**
   * The URL to which form data is submitted upon form submission
   */
  apiUrl: PropTypes.string,

  /**
   * Message displayed in a Snackbar upon successful form submission
   */
  submitMessage: PropTypes.string,

  /**
   * Header title displayed at the top of the form
   */
  headerTitle: PropTypes.string,

  /**
   * Array of field objects for the form. Each field object must include:
   * - `name` (string): Identifier for the form field.
   * - `label` (string): Label displayed for the form field.
   * - `type` (string): Type of the form field (e.g., "text" or "checkbox").
   * - `required` (boolean): Whether the field is required.
   * - `description` (string): Additional description displayed below the field label.
   * - `options` (array): For checkboxes, an array of checkbox objects with `label` and `props` for each option.
   */
  fields: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string,
      label: PropTypes.string,
      type: PropTypes.oneOf(["text", "checkbox"]),
      required: PropTypes.bool,
      description: PropTypes.string,
      options: PropTypes.arrayOf(
        PropTypes.shape({
          label: PropTypes.string,
          props: PropTypes.object,
        })
      ),
      props: PropTypes.object,
    })
  ),

  /**
   * Array of button objects for the form. Each button object should include:
   * - `action` (string): The action type of the button, such as "submit".
   * - `onClick` (function): Function called on button click.
   * - `props` (object): Additional props for the button.
   */
  buttons: PropTypes.arrayOf(
    PropTypes.shape({
      action: PropTypes.string,
      onClick: PropTypes.func,
      props: PropTypes.object,
    })
  ),
};


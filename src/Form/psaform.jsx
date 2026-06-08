import {
  Checkbox,
  FormControlLabel,
  FormGroup,
  Grid,
  Typography,
  Dialog,
  DialogContent,
  Alert,
} from '@mui/material';
import PropTypes from 'prop-types';
import { useEffect, useState } from 'react';
import PSAButton from '../Button';
import PSADropdown from '../Dropdown';
import PSALoadingSpinner from '../LoadingSpinner';
import PSATextField from '../Textfield';

export const PSAForm = ({
  apiUrl,
  submitMessage,
  headerTitle,
  repository,
  fields, // Single prop for both text fields and checkboxes
  buttons,
  handleSubmit,
  onFormChange,
  isDarkMode = false,
  loaderImage,
}) => {
  const [isSubmitDisabled, setIsSubmitDisabled] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [alertData, setAlertData] = useState({
    open: false,
    message: '',
    severity: 'success',
  });

  const initialFormData = fields.reduce(
    (acc, field) => {
      if (field.type === 'text') acc[field.name] = '';
      if (field.type === 'dropdown') {
        acc[field.name] = field.props?.value ?? '';
      }
      return acc;
    },
    { repository: repository, labels: [] },
  );

  const [formData, setFormData] = useState(initialFormData);

  // biome-ignore lint/correctness/useExhaustiveDependencies: <>
  useEffect(() => {
    const { state } = checkDisabled();
    setIsSubmitDisabled(state);
    onFormChange?.(formData);
  }, [formData]);

  useEffect(() => {
    fields.forEach((field) => {
      if (
        field.type === 'dropdown' &&
        field.props?.value &&
        formData[field.name] !== field.props.value
      ) {
        setFormData((prev) => ({
          ...prev,
          [field.name]: field.props.value,
        }));
      }
    });
  }, [fields, formData]);

  const convertMessageArr = (arr) => {
    if (arr.length === 0) return '';
    if (arr.length === 1) return `The "${arr[0]}" field is blank`;
    if (arr.length === 2) return `The "${arr.join('" and "')}" fields are blank`;
    return `The "${arr.slice(0, -1).join('", "')}", and "${arr[arr.length - 1]}" fields are blank`;
  };

  const checkDisabled = () => {
    const messageArr = [];

    fields.forEach((field) => {
      if (
        field.required &&
        ((field.type === 'text' && formData[field.name] === '') ||
          (field.type === 'dropdown' && formData[field.name] === '') ||
          (field.type === 'checkbox' && formData.labels.length === 0))
      ) {
        messageArr.push(field.label);
      }
    });

    const messageStr = convertMessageArr(messageArr);
    return messageArr.length > 0
      ? { state: true, message: messageStr }
      : { state: false, message: '' };
  };

  const handleTextInputChange = (event, name) => {
    setFormData({ ...formData, [name]: event.target.value });
  };

  const handleDropdownChange = (event, name) => {
    setFormData((prev) => ({
      ...prev,
      [name]: event.target.value,
    }));
  };

  const handleCheckboxChange = (event) => {
    const remove = (arr, value) => arr.filter((item) => item !== value);
    const { name, checked } = event.target;
    setFormData((prev) => ({
      ...prev,
      labels: checked ? [...(prev.labels || []), name] : remove(prev.labels || [], name),
    }));
  };

  const submit = async () => {
    const { state, message } = checkDisabled();
    if (state) {
      setAlertData({ open: true, message, severity: 'error' });
      return;
    }

    setIsSubmitting(true);

    const payload = { ...formData };

    payload.labels = payload.labels || [];
    payload.labels.push(`${formData.repository}`);
    if (formData.state) {
      payload.labels.push(`State: ${formData.state}`);
    }
    if (formData.county) {
      payload.labels.push(`County: ${formData.county}`);
    }

    try {
      if (handleSubmit) {
        await handleSubmit(formData);
      } else {
        const response = await fetch(apiUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
        setAlertData({
          open: true,
          message:
            response.status === 201
              ? submitMessage
              : `Error ${response.status}. ${
                  response.status === 400
                    ? 'Bad Request'
                    : response.status === 422
                      ? 'Unprocessable Entry'
                      : 'Internal Server Error'
                }`,
          severity: response.status === 201 ? 'success' : 'error',
        });
        if (response.status === 201) {
          setFormData(initialFormData);
        }
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Grid
      container
      rowSpacing={5}
      style={{
        padding: '3% 10%',
        textAlign: 'left',
        backgroundColor: isDarkMode ? '#000' : '#fff',
      }}
    >
      <Grid container item spacing={1} justifyContent="center">
        <Grid item xs={12}>
          <Typography variant="h3" style={{ color: isDarkMode ? '#aaa' : '#000' }}>
            {headerTitle}
          </Typography>
        </Grid>
      </Grid>

      {fields
        .filter((field) => !(field.type === 'dropdown' && field.orientation === 'horizontal'))
        .map((field, index) => (
          <Grid
            key={index}
            container
            item
            spacing={1}
            justifyContent="flex-start"
            alignItems="flex-start"
          >
            <Grid item xs={12}>
              <Typography variant="h6" style={{ color: isDarkMode ? '#aaa' : '#000' }}>
                {field.label} {field.required && <span style={{ color: 'red' }}>*</span>}
              </Typography>
            </Grid>
            <Grid item xs={12}>
              <Typography
                variant="body1"
                style={{ color: isDarkMode ? 'rgb(170, 170, 170, 0.8)' : '#333' }}
              >
                {field.description}
              </Typography>
            </Grid>
            <Grid item xs={12}>
              {field.type === 'text' && (
                <PSATextField
                  sx={{
                    '& input': {
                      color: isDarkMode ? '#aaa' : '#000',
                    },
                    '& textarea': {
                      color: isDarkMode ? '#aaa' : '#000',
                    },
                  }}
                  {...field.props}
                  value={formData[field.name] || ''}
                  onChange={(event) => handleTextInputChange(event, field.name)}
                />
              )}

              {/* Vertical dropdowns */}
              {field.type === 'dropdown' && (
                <PSADropdown
                  {...field.props}
                  items={field.items}
                  SelectProps={{
                    ...field.props?.SelectProps,
                    value: formData[field.name] ?? '',
                    onChange: (event) => handleDropdownChange(event, field.name),
                  }}
                />
              )}
              {field.type === 'checkbox' && (
                <FormGroup>
                  {field.options.map((checkbox, index) => (
                    <FormControlLabel
                      key={index}
                      style={{ color: isDarkMode ? '#aaa' : '#000' }}
                      control={
                        <Checkbox
                          {...checkbox.props}
                          checked={(formData.labels || []).includes(checkbox.props.name)}
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

      {/* Horizontal dropdowns */}
      {(() => {
        const horizontalDropdowns = fields.filter(
          (field) => field.type === 'dropdown' && field.orientation === 'horizontal',
        );
        return (
          horizontalDropdowns.length > 0 && (
            <Grid item xs={12}>
              <Typography variant="h6">{horizontalDropdowns[0].label}</Typography>
            </Grid>
          )
        );
      })()}
      <Grid item xs={12}>
        <Grid container spacing={2} alignItems="center">
          {fields
            .filter((field) => field.type === 'dropdown' && field.orientation === 'horizontal')
            .map((field) => (
              <Grid item key={field.name}>
                <PSADropdown
                  {...field.props}
                  items={field.items}
                  SelectProps={{
                    ...field.props?.SelectProps,
                    value: formData[field.name] ?? '',
                    onChange: (event) => handleDropdownChange(event, field.name),
                  }}
                />
              </Grid>
            ))}
        </Grid>
      </Grid>

      <Grid container item spacing={1} justifyContent="flex-start" alignItems="flex-start">
        {isSubmitDisabled && (
          <Grid item xs={12}>
            <Typography variant="body1" style={{ color: 'red' }}>
              {checkDisabled().message}. Please fill all required fields before submitting.
            </Typography>
          </Grid>
        )}
        {buttons.map((button, index) => (
          <Grid key={index} item xs={12}>
            <PSAButton
              {...button.props}
              onClick={button.action === 'submit' ? submit : button.onClick}
              disabled={isSubmitDisabled || isSubmitting}
              sx={{
                '&.Mui-disabled': {
                  backgroundColor: isDarkMode ? '#2c2c2c' : '#e0e0e0',
                  borderColor: isDarkMode ? '#444' : '#ccc',
                },
              }}
            />
          </Grid>
        ))}
      </Grid>

      {isSubmitting && (
        <Grid
          container
          justifyContent="center"
          alignItems="center"
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100vw',
            height: '100vh',
            backgroundColor: 'rgba(255,255,255,0.6)',
            zIndex: 9999,
          }}
        >
          <PSALoadingSpinner image={loaderImage} />
        </Grid>
      )}

      <Dialog open={alertData.open} onClose={() => setAlertData({ ...alertData, open: false })}>
        <DialogContent>
          <Alert
            severity={alertData.severity}
            onClose={() => setAlertData({ ...alertData, open: false })}
          >
            {alertData.message}
          </Alert>
        </DialogContent>
      </Dialog>
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
      type: PropTypes.oneOf(['text', 'checkbox', 'dropdown']),
      required: PropTypes.bool,
      description: PropTypes.string,
      items: PropTypes.arrayOf(
        PropTypes.shape({
          value: PropTypes.string,
          label: PropTypes.string,
        }),
      ),
      options: PropTypes.arrayOf(
        PropTypes.shape({
          label: PropTypes.string,
          props: PropTypes.object,
        }),
      ),
      props: PropTypes.object,
    }),
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
    }),
  ),

  /**
   * Function to handle form submission
   */
  handleSubmit: PropTypes.func,
};

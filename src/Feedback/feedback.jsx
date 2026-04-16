import { Box, Checkbox, FormControlLabel, FormGroup, Snackbar, Typography } from '@mui/material';
import PropTypes from 'prop-types';
import { useEffect, useState } from 'react';
import PSAButton from '../Button';
import PSATextField from '../Textfield';

const requiredMark = (
  <Typography component="span" variant="h6" sx={{ color: 'red' }}>
    *
  </Typography>
);

const sectionSx = {
  display: 'flex',
  flexDirection: 'column',
  gap: 1,
};

export function PSAFeedback({ title, label, consentRedux, pirschAnalytics }) {
  const [snackbarData, setSnackbarData] = useState({
    open: false,
    message: '',
    color: '',
  });

  const [feedbackData, setFeedbackData] = useState({
    repository: 'dst-feedback', //Repo-name
    title: '',
    comments: '',
    labels: [],
    // screenshot: null,
    name: '',
    email: '',
  });

  const convertMessageArr = (arr) => {
    if (arr.length === 0) {
      return '';
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
    const titleMissing = feedbackData.title === '';
    const commentsMissing = feedbackData.comments === '';
    const labelsMissing = feedbackData.labels.length === 0;
    const messageArr = [];

    if (titleMissing) {
      messageArr.push('Title');
    }
    if (commentsMissing) {
      messageArr.push('Message');
    }
    if (labelsMissing) {
      messageArr.push('Topic');
    }
    const messageStr = convertMessageArr(messageArr);
    if (titleMissing || commentsMissing || labelsMissing) {
      return { state: true, message: messageStr };
    }
    return { state: false, message: '' };
  };

  useEffect(() => {
    void consentRedux;
    pirschAnalytics('Visited Page', { meta: { visited: 'Feedback' } });
  }, [consentRedux, pirschAnalytics]);

  useEffect(() => {
    document.title = 'Feedback';
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
    fetch('https://developfeedback.covercrop-data.org/v1/issues', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
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
            message: 'Feedback Successfully Submitted!',
            color: 'green',
          });
        } else if (response.status === 400) {
          setSnackbarData({
            open: true,
            message: `Error ${response.status}. Bad Request`,
            color: 'red',
          });
        } else if (response.status === 422) {
          setSnackbarData({
            open: true,
            message: `Error ${response.status}. Unprocessable Entry`,
            color: 'red',
          });
        } else if (response.status === 500) {
          setSnackbarData({
            open: true,
            message: `Error ${response.status}. Internal Server Error`,
            color: 'red',
          });
        }
        return response.json();
      })
      .catch((error) => {
        console.error(error);
      });
  };

  const disabledState = checkDisabled();

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        gap: 5,
        px: '10%',
        py: '3%',
        textAlign: 'left',
      }}
    >
      {/* Title */}
      <Box>
        <Typography variant="h3">{title}</Typography>
      </Box>

      {/* Feedback Title */}
      <Box sx={sectionSx}>
        <Box>
          <Typography variant="h6" component="span">
            Title
          </Typography>{' '}
          {requiredMark}
        </Box>
        <Typography variant="body1">Give your feedback a short descriptive title.</Typography>
        <Box>
          <PSATextField
            placeholder="Enter Your Title"
            variant="outlined"
            onChange={(event) => handleTextInputChange(event, 'title')}
            data-test="feedback_title"
          />
        </Box>
      </Box>

      {/* Feedback Messsage */}
      <Box sx={sectionSx}>
        <Box>
          <Typography variant="h6" component="span">
            Message
          </Typography>{' '}
          {requiredMark}
        </Box>
        <Typography variant="body1">
          Explain your feedback as thoroughly as you can. Your feedback will help us improve the
          species selection experience. You can attach a screenshot of your feedback below.
        </Typography>
        <Box>
          <PSATextField
            placeholder="Enter Your Feedback"
            multiline
            variant="outlined"
            fullWidth
            minRows={3}
            onChange={(event) => handleTextInputChange(event, 'comments')}
            data-test="feedback_message"
          />
        </Box>
      </Box>

      <Box sx={sectionSx}>
        <Box>
          <Typography variant="h6" component="span">
            Topic
          </Typography>{' '}
          {requiredMark}
        </Box>
        <Typography variant="body1">What is this feedback about?</Typography>
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
      </Box>
      {/* Name */}
      <Box sx={sectionSx}>
        <Typography variant="h6">Name</Typography>
        <Box>
          <PSATextField
            placeholder="Enter Name"
            variant="outlined"
            onChange={(event) => handleTextInputChange(event, 'name')}
            data-test="feedback_name"
          />
        </Box>
      </Box>

      {/* Email */}
      <Box sx={sectionSx}>
        <Typography variant="h6">Email</Typography>
        <Box>
          <PSATextField
            placeholder="Enter Email"
            variant="outlined"
            onChange={(event) => handleTextInputChange(event, 'email')}
            data-test="feedback_email"
          />
        </Box>
      </Box>

      {/* Submit */}
      <Box sx={sectionSx}>
        {disabledState.state && (
          <Typography variant="body1" sx={{ color: 'red' }} data-test="feedback_alert">
            {disabledState.message}. Please fill all required fields before submitting.
          </Typography>
        )}
        <Box>
          <PSAButton
            title="Submit"
            disabled={disabledState.state}
            onClick={handleSubmit}
            size="large"
            variant="outlined"
            data-test="feedback_submit"
            buttonType=""
          />
        </Box>
      </Box>

      <Snackbar
        open={snackbarData.open}
        autoHideDuration={5000}
        onClose={handleSnackbarClose}
        message={snackbarData.message}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        color={snackbarData.color}
        data-test="feedback_snackbar"
      />
    </Box>
  );
}

PSAFeedback.propTypes = {
  /**
   * The title of the feedback section. This will be displayed at the top of the component.
   * Required: Expected to be a string.
   */
  title: PropTypes.string,

  /**
   * The label text associated with the feedback input.
   * This will be shown either with a selector or a seed calculator, depending on the implementation.
   * Required: Expected to be a string.
   */
  label: PropTypes.string,

  /**
   * Redux object that handles the user's consent state for feedback.
   * Used to manage and store consent-related information in the feedback process.
   * Required: Expected to be an object.
   */
  consentRedux: PropTypes.object,

  /**
   * Function for sending data to the Pirsch Analytics service.
   * It tracks and logs feedback or user interactions within the component.
   * Required: Expected to be a function.
   */
  pirschAnalytics: PropTypes.func,
};

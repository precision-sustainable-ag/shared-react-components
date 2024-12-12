import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Box, Step, StepButton, Stepper, styled, Typography } from '@mui/material';
import StepConnector, { stepConnectorClasses } from '@mui/material/StepConnector';

const StepLight = ({ strokeColor }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="43" height="43" viewBox="0 0 43 43" fill="none">
    <circle cx="21.4318" cy="21.4318" r="17.9318" fill="#AAAAAA" stroke={strokeColor} strokeWidth="7" />
  </svg>
);

const StepDark = ({ strokeColor }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="43" height="43" viewBox="0 0 43 43" fill="none">
    <circle cx="21.5001" cy="21.4318" r="17.9318" fill="#363636" stroke={strokeColor} strokeWidth="7" />
  </svg>
);

const StepActive = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="42" height="42" viewBox="0 0 42 42" fill="none">
    <circle cx="21" cy="21" r="20" fill="#334A03" stroke="#F5F5F5" strokeWidth="17" />
    <circle cx="21" cy="21" r="19" stroke="#334A03" strokeWidth="3" />
  </svg>
);

const CustomStepConnector = styled(StepConnector)(() => ({
  [`&.${stepConnectorClasses.alternativeLabel}`]: {
    top: 20,
    left: 'calc(-50% + 24px)',
    right: 'calc(50% + 24px)',
  },
  [`&.${stepConnectorClasses.active}`]: {
    [`& .${stepConnectorClasses.line}`]: {
      backgroundColor: '#363636',
    },
  },
  [`&.${stepConnectorClasses.completed}`]: {
    [`& .${stepConnectorClasses.line}`]: {
      backgroundColor: '#363636',
    },
  },
  [`& .${stepConnectorClasses.line}`]: {
    height: 3,
    border: 0,
    backgroundColor: '#AAA',
  },
}));

export const PSAStepper = ({
  steps = [],
  tabs = [],
  maxAvailableStep,
  onStepClick = () => { },
  boxProps = {},
  stepperProps = {},
  stepProps = {},
  stepButtonProps = {},
  typographyProps = {},
  strokeColor = "#F5F5F5",
}) => {

  const [activeStep, setActiveStep] = useState(0);

  useEffect(() => {
    if (stepperProps.activeStep !== undefined) {
      setActiveStep(stepperProps.activeStep);
    }
  }, [stepperProps.activeStep]);

  const handleStepClick = (tab, index) => {
    setActiveStep(index);
    onStepClick(tab, index);
  };

  const getStepIcon = (currStep, activeStep) => {

    const baseIcon = maxAvailableStep != undefined ?

      (() => {
        if (activeStep === currStep) return <StepActive />;
        if (maxAvailableStep < currStep) return <StepLight strokeColor={strokeColor} />;
        if (maxAvailableStep >= currStep) return <StepDark strokeColor={strokeColor} />;
      })()
      :
      (() => {
        if (activeStep < currStep) return <StepLight strokeColor={strokeColor} />;
        if (activeStep > currStep) return <StepDark strokeColor={strokeColor} />;
        else return <StepActive />;
      })()

    const getTextColor = maxAvailableStep != undefined ? 
    () => {
      if (activeStep === currStep) return 'white';
      if (maxAvailableStep >= currStep) return 'white';
      return 'black';
    }
    :
    () => {
      if (activeStep >= currStep) return 'white';
      return 'black';
    }

    return (
      <Box position="relative" display="inline-flex">
        {baseIcon}
        <Typography
          variant="caption"
          position="absolute"
          top="50%"
          left="50%"
          sx={{
            transform: 'translate(-50%, -50%)',
            color: getTextColor(),
            fontWeight: activeStep === currStep ? 'bold' : 'normal',
          }}
        >
          {currStep + 1}
        </Typography>
      </Box>
    );
  };

  return (
    <Box
      p="1rem"
      sx={{
        backgroundColor: '#F5F5F5',
        opacity: 0.9,
        ...boxProps.sx,
      }}
      {...boxProps}
    >
      <Stepper
        activeStep={activeStep}
        alternativeLabel
        nonLinear
        connector={<CustomStepConnector />}
        {...stepperProps}
      >
        {steps.map((step, index) => (
          <Step key={index} completed={index < activeStep} disabled={maxAvailableStep !== undefined ? maxAvailableStep < index : false} {...stepProps}>
            <StepButton
              onClick={() => handleStepClick(tabs[index], index)}
              icon={getStepIcon(index, activeStep)}
              sx={{
                '.MuiStepLabel-label': { marginTop: 0 },
                ...stepButtonProps.sx,
              }}
              {...stepButtonProps}
            >
              <Typography
                fontFamily="IBM Plex Sans"
                color="additional.greydark"
                sx={{
                  ...(activeStep === index && {
                    color: 'main.text',
                    fontWeight: 700,
                    textDecoration: 'underline',
                    textDecorationThickness: '1.5px',
                    textUnderlinePosition: 'from-font',
                  }),
                  ...typographyProps.sx,
                }}
                {...typographyProps}
              >
                {step}
              </Typography>
            </StepButton>
          </Step>
        ))}
      </Stepper>
    </Box>
  );
};

PSAStepper.propTypes = {
  /**
   * Array of step labels to display in the stepper.
   */
  steps: PropTypes.arrayOf(PropTypes.string).isRequired,

  /**
   * Array of tabs or additional data that is associated with each step.
   */
  tabs: PropTypes.arrayOf(PropTypes.any).isRequired,

  /**
   * The maximum available step that the user can access (optional).
   */
  maxAvailableStep: PropTypes.number,

  /**
   * Callback function triggered when a step is clicked, receives the tab and index as arguments.
   */
  onStepClick: PropTypes.func,

  /**
   * Additional props for styling the outer box container.
   */
  boxProps: PropTypes.shape({
    sx: PropTypes.object,
  }),

  /**
   * Additional props for the Stepper component.
   */
  stepperProps: PropTypes.object,

  /**
   * Additional props for the Step component.
   */
  stepProps: PropTypes.object,

  /**
   * Additional props for the StepButton component.
   */
  stepButtonProps: PropTypes.object,

  /**
   * Additional props for the Typography component inside the StepButton.
   */
  typographyProps: PropTypes.object,

  /**
   * The stroke color for the step icons.
   */
  strokeColor: PropTypes.string,
};


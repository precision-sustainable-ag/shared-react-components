import React from 'react';
import { Box, Step, StepButton, Stepper, styled, Typography } from '@mui/material';
import StepConnector, { stepConnectorClasses } from '@mui/material/StepConnector';

const StepLight = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="43" height="43" viewBox="0 0 43 43" fill="none">
    <circle cx="21.4318" cy="21.4318" r="17.9318" fill="#AAAAAA" stroke="#F5F5F5" strokeWidth="7" />
  </svg>
);

const StepDark = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="43" height="43" viewBox="0 0 43 43" fill="none">
    <circle cx="21.5001" cy="21.4318" r="17.9318" fill="#363636" stroke="#F5F5F5" strokeWidth="7" />
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

export const PSAProgressstepper = ({
  steps = [],
  tabs = [],
  activeStep = 0,
  onStepClick = () => {},
  getStepIcon,
  boxProps = {},
  stepperProps = {},
  stepProps = {},
  stepButtonProps = {},
  typographyProps = {},
}) => {

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
          <Step key={index} completed={index < activeStep} {...stepProps}>
            <StepButton
              onClick={() => {
                activeStep = index
                onStepClick(tabs[index], index)
              }}
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

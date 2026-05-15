import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import {
  Box,
  MobileStepper,
  Step,
  StepButton,
  Stepper,
  styled,
  Typography,
  useTheme,
} from '@mui/material';
import StepConnector, { stepConnectorClasses } from '@mui/material/StepConnector';
import PropTypes from 'prop-types';
import { useEffect, useState } from 'react';
import PSAFigmaButton from '../FigmaButton';

const StepLight = ({ strokeColor }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="43"
    height="43"
    viewBox="0 0 43 43"
    fill="none"
    aria-hidden="true"
  >
    <circle
      cx="21.4318"
      cy="21.4318"
      r="17.9318"
      fill="#AAAAAA"
      stroke={strokeColor}
      strokeWidth="7"
    />
  </svg>
);

const StepDark = ({ strokeColor }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="43"
    height="43"
    viewBox="0 0 43 43"
    fill="none"
    aria-hidden="true"
  >
    <circle
      cx="21.5001"
      cy="21.4318"
      r="17.9318"
      fill="#363636"
      stroke={strokeColor}
      strokeWidth="7"
    />
  </svg>
);

const StepActive = ({ strokeColor }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="42"
    height="42"
    viewBox="0 0 42 42"
    fill="none"
    aria-hidden="true"
  >
    <circle cx="21" cy="21" r="20" fill="#334A03" stroke={strokeColor} strokeWidth="17" />
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
  maxAvailableStep,
  onStepClick = () => {},
  stepperProps = {},
  stepProps = {},
  stepButtonProps = {},
  typographyProps = {},
  strokeColor = '#F5F5F5',
  mobile = false,
  nextButtonDisabled = false,
}) => {
  const [activeStep, setActiveStep] = useState(0);

  const theme = useTheme();

  useEffect(() => {
    if (stepperProps.activeStep !== undefined) {
      setActiveStep(stepperProps.activeStep);
    }
  }, [stepperProps.activeStep]);

  const handleStepClick = (index) => {
    setActiveStep(index);
    onStepClick(index);
  };

  const getStepIcon = (currStep, activeStep) => {
    const baseIcon =
      maxAvailableStep !== undefined
        ? (() => {
            if (activeStep === currStep) return <StepActive strokeColor={strokeColor} />;
            if (maxAvailableStep < currStep) return <StepLight strokeColor={strokeColor} />;
            if (maxAvailableStep >= currStep) return <StepDark strokeColor={strokeColor} />;
          })()
        : (() => {
            if (activeStep < currStep) return <StepLight strokeColor={strokeColor} />;
            if (activeStep > currStep) return <StepDark strokeColor={strokeColor} />;
            else return <StepActive strokeColor={strokeColor} />;
          })();

    const getTextColor =
      maxAvailableStep !== undefined
        ? () => {
            if (activeStep === currStep) return 'white';
            if (maxAvailableStep >= currStep) return 'white';
            return 'black';
          }
        : () => {
            if (activeStep >= currStep) return 'white';
            return 'black';
          };

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

  if (mobile) {
    return (
      <MobileStepper
        variant="dots"
        steps={steps.length}
        position="bottom"
        activeStep={activeStep}
        sx={{
          backgroundColor: theme.palette.additional.background2,
          '.MuiMobileStepper-dotActive': {
            backgroundColor: '#334A03',
          },
        }}
        nextButton={
          <PSAFigmaButton
            variant="color"
            icon={<ArrowForwardIcon />}
            rightIcon
            onClick={() => handleStepClick(activeStep + 1)}
            disabled={activeStep === steps.length || nextButtonDisabled}
            text="Next"
            style={{
              background:
                activeStep === steps.length || nextButtonDisabled
                  ? theme.palette.additional.grey1
                  : theme.palette.main.accent1,
            }}
          />
        }
        backButton={
          <PSAFigmaButton
            variant="color"
            icon={<ArrowBackIcon />}
            leftIcon
            onClick={() => handleStepClick(activeStep - 1)}
            disabled={activeStep === 0}
            text="Back"
            style={{
              background:
                activeStep === 0 ? theme.palette.additional.grey1 : theme.palette.main.accent1,
            }}
          />
        }
      />
    );
  }

  return (
    <Stepper
      activeStep={activeStep}
      alternativeLabel
      nonLinear
      connector={<CustomStepConnector />}
      {...stepperProps}
    >
      {steps.map((step, index) => (
        <Step
          key={step}
          completed={index < activeStep}
          disabled={maxAvailableStep !== undefined ? maxAvailableStep < index : false}
          {...stepProps}
        >
          <StepButton
            onClick={() => handleStepClick(index)}
            icon={getStepIcon(index, activeStep)}
            sx={{
              '.MuiStepLabel-label.MuiStepLabel-alternativeLabel': {
                marginTop: 0,
              },
              ...stepButtonProps.styles,
            }}
            data-test={`step-${index}`}
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
                ...typographyProps.styles,
              }}
              {...typographyProps}
            >
              {step}
            </Typography>
          </StepButton>
        </Step>
      ))}
    </Stepper>
  );
};

PSAStepper.propTypes = {
  /**
   * Array of step labels to display in the stepper.
   */
  steps: PropTypes.arrayOf(PropTypes.string).isRequired,

  /**
   * The maximum available step that the user can access (optional).
   */
  maxAvailableStep: PropTypes.number,

  /**
   * Callback function triggered when a step is clicked, receives the tab and index as arguments.
   */
  onStepClick: PropTypes.func,

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

  /**
   * Props for showing mobile stepper.
   */
  mobile: PropTypes.bool,

  /**
   * Props for disable next button, this will only work when `mobile` is `true`.
   */
  nextButtonDisabled: PropTypes.bool,
};

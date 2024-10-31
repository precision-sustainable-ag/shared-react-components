/*
  This file contains the Accordion component
*/
import React from "react";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Typography,
  Box,
} from "@mui/material";
import PropTypes from "prop-types";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";

/**
 * This is a custom Accordion component,
 *  styling is based on [Figma](https://www.figma.com/design/dipljCC6Z3GZBFhJqth7a7/PSI-Components?node-id=393-5807&node-type=canvas&m=dev),
 *  component is based on [MUI Accordion](https://mui.com/material-ui/react-accordion/).
 */
export const PSAAccordion = ({
  expanded,
  onChange,
  summaryContent,
  detailsContent,
  accordionProps,
  summaryProps,
  summarySx,
  testId,
}) => {
  return (
    <Accordion
      expanded={expanded}
      onChange={onChange}
      sx={{
        boxShadow: "0px 1px 10px 0px rgba(0, 0, 0, 0.10)",
        "&.MuiAccordion-root": {
          borderRadius: "1.6875rem",
        },
        backgroundColor: "additional.background2",
      }}
      data-test={`psa-accordion-${testId}`}
      {...accordionProps}
    >
      <AccordionSummary
        expandIcon={
          <Typography
            sx={{
              textDecoration: "underline",
              display: "flex",
              alignItems: "center",
              color: "main.text",
            }}
          >
            {expanded ? "Hide " : "Show "}
            {expanded ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
          </Typography>
        }
        sx={{
          ".MuiAccordionSummary-expandIconWrapper": {
            transform: "none",
            WebkitTransform: "none",
            transition: "none",
            WebkitTransition: "none",
            "&.Mui-expanded": {
              transform: "none",
              WebkitTransform: "none",
            },
          },
          height: "70px",
          // backgroundColor: "main.accent2",

          borderTopLeftRadius: "1.6875rem",
          borderTopRightRadius: "1.6875rem",
          borderBottomLeftRadius: expanded ? 0 : "1.6875rem",
          borderBottomRightRadius: expanded ? 0 : "1.6875rem",
          ...summarySx,
        }}
        data-test="psa-accordion-summary"
        {...summaryProps}
      >
        {summaryContent}
      </AccordionSummary>
      <AccordionDetails data-test="psa-accordion-details">
        {detailsContent}
      </AccordionDetails>
    </Accordion>
  );
};

/** PropTypes for better type checking */
PSAAccordion.propTypes = {
  /** Whether the accordion is expanded or not */
  expanded: PropTypes.bool,
  /** The function activated when the accordion changes */
  onChange: PropTypes.func,
  /** The content in the accordion summary */
  summaryContent: PropTypes.node,
  /** The content in the accordion details */
  detailsContent: PropTypes.node,
  /** Other props of Accordion */
  accordionProps: PropTypes.object,
  /** Other props of AccordionSummary */
  summaryProps: PropTypes.object,
  /** The sx that is passed to the accordion summary */
  summarySx: PropTypes.object,
  /** id for testing */
  testId: PropTypes.string,
};

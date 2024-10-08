/*
  This file contains the Accordion component
*/
import React from "react";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  styled,
} from "@mui/material";
import PropTypes from "prop-types";

const StyledAccordion = styled(Accordion)(({ type }) => ({
  ...(type === "SheetReferences" && {
    border: "1px solid #2b7b79",
    boxShadow: "none",
  }),
}));

const StyledAccordionSummary = styled(AccordionSummary)(({ type, theme }) => ({
  ...(type === "NRCSAccordionSummary" && {
    "&.MuiAccordionSummary-root": {
      minHeight: "1.5rem",
      padding: "0.3125rem 1rem",
      backgroundColor: theme.palette.primary.dark,
      color: theme.palette.primary.text,
      ".MuiAccordionSummary-content": {
        margin: "0",
      },
      "&.Mui-expanded": {
        minHeight: "2rem",
      },
      ".MuiAccordionSummary-expandIconWrapper.Mui-expanded": {
        transform: "rotate(0deg) !important",
      },
    },
  }),
}));

const StyledAccordionDetails = styled(AccordionDetails)(({ type, theme }) => ({
  ...(type === "NRCSAccordionDetails" && {
    "&.MuiAccordionDetails-root": {
      padding: " 2%",
      "th,td": {
        color: theme.palette.primary.text,
      },
    },
  }),
}));

export const PSAAccordion = ({
  accordionType,
  defaultExpanded,
  expanded,
  onChange,
  accordionSx,
  theme,
  summaryContent,
  summaryExpandIcon,
  summarySx,
  divider,
  detailsContent,
}) => {
  return (
    <StyledAccordion
      type={accordionType}
      defaultExpanded={defaultExpanded}
      expanded={expanded || undefined}
      data-test="psa-accordion"
      onChange={onChange}
      sx={accordionSx}
    >
      <StyledAccordionSummary
        sx={summarySx}
        expandIcon={summaryExpandIcon}
        data-test="psa-accordion-summary"
        type={accordionType}
        theme={theme}
      >
        {summaryContent}
      </StyledAccordionSummary>
      {divider && divider}
      <StyledAccordionDetails
        data-test="psa-accordion-details"
        type={accordionType}
        theme={theme}
      >
        {detailsContent}
      </StyledAccordionDetails>
    </StyledAccordion>
  );
};

/** PropTypes for better type checking */
PSAAccordion.propTypes = {
  /** Accordion Props */
  /** The type of accordion */
  accordionType: PropTypes.oneOf(["SheetReferences", "NRCSAccordionSummary"]),
  /** Whether the accordion is expanded at the start */
  defaultExpanded: PropTypes.bool,
  /** Whether the accordion is expanded or not */
  expanded: PropTypes.bool,
  /** The function activated when the accordion changes */
  onChange: PropTypes.func,
  /** The theme of the accordion */
  theme: PropTypes.object,

  /** Accordion Summary Props */
  /** The content in the accordion summary */
  summaryContent: PropTypes.node,
  /** The expand icon for the accordion summary */
  summaryExpandIcon: PropTypes.node,
  /** The sx that is passed to the accordion summary */
  summarySx: PropTypes.object,

  /** The divider between the accordion summary and details */
  divider: PropTypes.node,

  /** Accordion Content Props */
  /** The content in the accordion details */
  detailsContent: PropTypes.node,
};

/*
  This file contains the Accordion component
*/
import React from 'react';
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  styled,
} from '@mui/material';
import PropTypes from 'prop-types';

const StyledAccordion = styled(Accordion)(({ type }) => ({
  ...(type === 'SheetReferences' && {
    border: '1px solid #2b7b79',
    boxShadow: 'none',
  }),

}));

const StyledAccordionSummary = styled(AccordionSummary)(({ type, theme }) => ({
  ...(type === 'NRCSAccordionSummary' && {
    '&.MuiAccordionSummary-root': {
      minHeight: '1.5rem',
      padding: '0.3125rem 1rem',
      backgroundColor: theme.palette.primary.dark,
      color: theme.palette.primary.text,
      '.MuiAccordionSummary-content': {
        margin: '0',
      },
      '&.Mui-expanded': {
        minHeight: '2rem',
      },
      '.MuiAccordionSummary-expandIconWrapper.Mui-expanded': {
        transform: 'rotate(0deg) !important',
      },
    },
  }),
}));

const StyledAccordionDetails = styled(AccordionDetails)(({ type, theme }) => ({
  ...(type === 'NRCSAccordionDetails' && {
    '&.MuiAccordionDetails-root': {
      padding: ' 2%',
      'th,td': {
        color: theme.palette.primary.text,
      },
    },
  }),
}));

export const PSAAccordion = ({
  accordionType, defaultExpanded, expanded, accordionDataTest, onChange, accordionSx,
  summaryContent, summaryExpandIcon, summarySx, summaryDataTest, summaryType, summaryTheme,
  divider,
  detailsContent, detailsDataTest, detailsType, detailsTheme,
}) => {
  return (
    <StyledAccordion
      type={accordionType}
      defaultExpanded={defaultExpanded}
      expanded={expanded || undefined}
      data-test={accordionDataTest}
      onChange={onChange}
      sx={accordionSx}
    >
      <StyledAccordionSummary
        sx={summarySx}
        expandIcon={summaryExpandIcon}
        data-test={summaryDataTest}
        type={summaryType}
        theme={summaryTheme}
      >
        {summaryContent}
      </StyledAccordionSummary>
      {divider && divider}
      <StyledAccordionDetails
        data-test={detailsDataTest}
        type={detailsType}
        theme={detailsTheme}
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
  accordionType: PropTypes.oneOf([
    '',
    'SheetReferences'
  ]),
  /** Whether the accordion is expanded at the start */
  defaultExpanded: PropTypes.bool,
  /** Whether the accordion is expanded or not */
  expanded: PropTypes.bool,
  /** The testing attribute of the accordion */
  accordionDataTest: PropTypes.string,
  /** The function activated when the accordion changes */
  onChange: PropTypes.func,
  
  /** Accordion Summary Props */
  /** The content in the accordion summary */
  summaryContent: PropTypes.node,
  /** The expand icon for the accordion summary */
  summaryExpandIcon: PropTypes.node,
  /** The sx that is passed to the accordion summary */
  summarySx: PropTypes.object,
  /** The testing attribute of the accordion summary */
  summaryDataTest: PropTypes.string,
  /** The type of the accordion summary */
  summaryType: PropTypes.oneOf([
    '',
    'NRCSAccordionSummary'
  ]),
  /** The theme of the accordion summary */
  summaryTheme: PropTypes.object,

  /** The divider between the accordion summary and details */
  divider: PropTypes.node,

  /** Accordion Content Props */
  /** The content in the accordion details */
  detailsContent: PropTypes.node,
  /** The testing attribute of the accordion details */
  detailsDataTest: PropTypes.string,
  detailsType: PropTypes.oneOf([
    '',
    'NRCSAccordionDetails'
  ]),
  /** The type of the accordion summary */
  detailsTheme: PropTypes.object,
};



/*
  This file contains the Accordion component
*/


import React from "react";
import PropTypes from "prop-types";

import {
    Accordion,
    styled,
  } from '@mui/material';
  

const StyledAccordion = styled(Accordion, {
    shouldForwardProp: (prop) => prop !== 'accordionType',
  })(({ accordionType }) => ({
    ...(accordionType === 'SheetReferences' && {
      border: '1px solid #2b7b79',
      boxShadow: 'none',
    }),
  
}));
  
export const PSAAccordion = ({
  }) => {
    return (
      <StyledAccordion/>
    );
  };
/* Define Props Type */
PSAAccordion.propTypes = {
    accordionType: PropTypes.oneOf([
        'SheetReferences',
    ]),
};

export default PSAAccordion;

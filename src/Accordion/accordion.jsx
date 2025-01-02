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
  Container,
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
  sx,
  summaryContent,
  detailsContent,
  accordionProps,
  summaryProps,
  testId,
  error,
  subContainer
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
        backgroundColor: error ? "#f3e2dd" : "additional.background2",
        ...sx,
      }}
      data-test={testId}
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
          ".MuiAccordionSummary-content p": {
            fontFamily: "IBM PLex Sans",
            fontSize: "1.5626rem",
            fontWeight: 600,
            paddingLeft: "0.5rem",
          },
          height: "70px",
          // backgroundColor: "main.accent2",

          borderTopLeftRadius: "1.6875rem",
          borderTopRightRadius: "1.6875rem",
          borderBottomLeftRadius: expanded ? 0 : "1.6875rem",
          borderBottomRightRadius: expanded ? 0 : "1.6875rem",
        }}
        data-test="psa-accordion-summary"
        {...summaryProps}
      >
        {summaryContent}
      </AccordionSummary>
      <AccordionDetails data-test="psa-accordion-details">
        {subContainer && subContainer.length > 0 ? (
          <div
            style={{
              fontFamily: "IBM Plex Sans",
              padding: "40px",
            }}
          >
            {subContainer.map((item, index) => (
              <div
                key={index}
                style={{
                  width: "100%",
                  maxWidth: "1200px",
                  margin: "0 auto",
                  backgroundColor: "#fff",
                  borderRadius: "8px",
                  boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
                  marginBottom: "20px", // Add spacing between cards
                }}
              >
                {/* Header Section */}
                <div
                  style={{
                    backgroundColor: "#f5f5f5",
                    padding: "20px",
                    borderTopLeftRadius: "8px",
                    borderTopRightRadius: "8px",
                  }}
                >
                  <h3
                    style={{
                      margin: 0,
                      color: "#333",
                      fontWeight: "normal",
                    }}
                  >
                    {item.title}
                  </h3>
                </div>

                {/* Content Section */}
                <div
                  style={{
                    padding: "20px",
                  }}
                >
                  {item.list.map((listItem, listIndex) => (
                    <div
                      key={listIndex}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        padding: "10px",
                        border: listItem.selected
                          ? "3px solid #ddd"
                          : "1px solid #ddd",
                        borderRadius: "4px",
                        marginBottom: "15px", // Add spacing between list items
                      }}
                    >
                      <div
                        style={{
                          width: "120px",
                          padding: "8px 12px",
                          border: "1px solid #ddd",
                          borderRadius: "4px",
                          marginRight: "20px",
                          fontSize: "1.1rem",
                        }}
                      >
                        {listItem.key}
                      </div>
                      <span
                        style={{
                          fontSize: "1rem",
                          color: "#333",
                        }}
                      >
                        {listItem.label} - {listItem.value}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        ) : (
          detailsContent
        )}
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
  /** The sx that is passed to the accordion, this can be used to customize styling for the accordion and its children */
  sx: PropTypes.object,
  /** The content in the accordion summary */
  summaryContent: PropTypes.node,
  /** The content in the accordion details */
  detailsContent: PropTypes.node,
  /** Other props of Accordion */
  accordionProps: PropTypes.object,
  /** Other props of AccordionSummary */
  summaryProps: PropTypes.object,
  /** id for testing */
  testId: PropTypes.string,
  /** Indicates whether the accordion is in an error state */
  error: PropTypes.bool,

  subContainer: PropTypes.array,
};

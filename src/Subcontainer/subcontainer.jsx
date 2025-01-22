import React from "react";
import PropTypes from "prop-types";

export function PSASubContainer({ title, content, error }) {
  return (
    <div
      style={{
        fontFamily: "IBM Plex Sans",
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: "1200px",
          margin: "0 auto",
          backgroundColor: "#fff",
          borderRadius: "8px",
          border: error && `2px solid #DD3804`,
          boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
          marginBottom: "20px", // Add spacing between cards
        }}
      >
        {/* Header Section */}
        <div
          style={{
            backgroundColor: error ? "#f3e2dd" : "#f5f5f5",
            padding: "20px",
            borderTopLeftRadius: "8px",
            borderTopRightRadius: "8px",
          }}
        >
          {title}
        </div>

        {/* Content Section */}
        {content}
      </div>
    </div>
  );
}

/* Define Props Type */

PSASubContainer.propTypes = {
  /** The Title of the SubContainer */
  title: PropTypes.node,
  /** The Content of the SubContainer */
  content: PropTypes.node,
};

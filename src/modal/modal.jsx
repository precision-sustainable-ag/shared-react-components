import React from "react";
import PropTypes from "prop-types";
import { Modal } from '@mui/material';

export function PSAModal({
  modalContent, ...props
}) {
  return (
    <Modal
      {...props}
      aria-labelledby={props['aria-labelledby']}
      aria-describedby={props['aria-describedby']}
    >
    {modalContent}
  </Modal>
  );
}

/* Define Props Type */

PSAModal.propTypes = {
  /**
   * The content of the modal.
   */
  modalContent: PropTypes.node.isRequired,

  /**
   * The id of the element that serves as the label for the modal.
   */
  'aria-labelledby': PropTypes.string,

  /**
   * The id of the element that serves as the description for the modal.
   */
  'aria-describedby': PropTypes.string,
};
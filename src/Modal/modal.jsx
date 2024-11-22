import React from "react";
import PropTypes from "prop-types";
import { Modal } from '@mui/material';

export function PSAModal({
  modalContent, ...props
}) {
  return (
    <Modal
      {...props}
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
};
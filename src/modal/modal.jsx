import React from "react";
import PropTypes from "prop-types";
import { Modal } from '@mui/material';

export function PSAModal({
  modalContent, 
  sx, 
  style, 
  open, 
  onClose, 
  closeAfterTransition, 
  disableEscapeKeyDown
}) {
  return (
    <Modal
      sx={sx}
      open={open}
      style={style}
      onClose={onClose}
      closeAfterTransition={closeAfterTransition}
      disableEscapeKeyDown={disableEscapeKeyDown}
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
   * The system prop that allows defining system overrides as well as additional CSS styles.
   */
  sx: PropTypes.object,

  /**
   * React styling object to apply custom styles.
   */
  style: PropTypes.object,

  /**
   * If `true`, the modal is open.
   */
  open: PropTypes.bool.isRequired,

  /**
   * Callback fired when the component requests to be closed.
   */
  onClose: PropTypes.func,

  /**
   * If `true`, the modal will close after the transition is completed.
   */
  closeAfterTransition: PropTypes.bool,

  /**
   * If `true`, hitting the Escape key will not fire the `onClose` callback.
   */
  disableEscapeKeyDown: PropTypes.bool,
};
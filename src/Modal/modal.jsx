import { Modal } from '@mui/material';
import PropTypes from 'prop-types';
import React from 'react';

export function PSAModal({ modalContent, ...props }) {
  return <Modal {...props}>{modalContent}</Modal>;
}

/* Define Props Type */

PSAModal.propTypes = {
  /**
   * The content of the modal.
   */
  modalContent: PropTypes.node.isRequired,
};

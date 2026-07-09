import CloseIcon from '@mui/icons-material/Close';
import { Box, Button, IconButton, Modal, Paper } from '@mui/material';
import PropTypes from 'prop-types';
import { useState } from 'react';

export function PSAModal({ open, button, modalContent, paperProps, onClose, ...props }) {
  const [internalOpen, setInternalOpen] = useState(false);

  const controlled = open !== undefined;
  const modalOpen = controlled ? open : internalOpen;

  const handleOpen = () => {
    if (!controlled) {
      setInternalOpen(true);
    }
  };

  const handleClose = (event, reason) => {
    if (!controlled) {
      setInternalOpen(false);
    }

    onClose?.(event, reason);
  };

  return (
    <>
      {button && (
        <Button variant="contained" color="primary" onClick={handleOpen}>
          {button}
        </Button>
      )}

      <Modal open={modalOpen} onClose={handleClose} {...props}>
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            height: '100%',
          }}
        >
          <Paper
            sx={{
              position: 'relative',
              p: 3,
            }}
            {...paperProps}
          >
            <IconButton
              onClick={handleClose}
              sx={{
                position: 'absolute',
                top: 8,
                right: 8,
              }}
              aria-label="Close"
            >
              <CloseIcon />
            </IconButton>

            {modalContent}
          </Paper>
        </Box>
      </Modal>
    </>
  );
}

PSAModal.propTypes = {
  open: PropTypes.bool,
  button: PropTypes.node,
  modalContent: PropTypes.node,
  paperProps: PropTypes.object,
  onClose: PropTypes.func,
};

PSAModal.defaultProps = {
  open: undefined,
  button: null,
  modalContent: null,
  paperProps: {},
  onClose: undefined,
};

import { Close } from '@mui/icons-material';
import { Box, Dialog, DialogContent, DialogTitle, IconButton } from '@mui/material';
import PropTypes from 'prop-types';
import React from 'react';

export const PSAInfoSheet = ({ open, setOpen, title, content, ...props }) => {
  return (
    <Dialog
      open={open}
      onClose={() => setOpen(false)}
      scroll="paper"
      maxWidth="lg"
      aria-labelledby="infosheet-title"
      {...props}
    >
      <DialogTitle
        id="infosheet-title"
        sx={{
          backgroundColor: '#2D7B7B',
          color: 'white',
          display: 'flex',
          justifyContent: 'space-between',
          padding: '8px',
        }}
        className="no-print"
      >
        <Box>{title}</Box>
        <IconButton
          aria-label="close"
          onClick={() => setOpen(false)}
          sx={{ color: 'white' }}
          className="modalClose"
        >
          <Close />
        </IconButton>
      </DialogTitle>
      <DialogContent dividers>
        <Box id="cropDetailModal-infosheet">{content}</Box>
      </DialogContent>
    </Dialog>
  );
};

PSAInfoSheet.propTypes = {
  /**
   * State for controlling the open status of the Infosheet
   */
  open: PropTypes.bool,

  /**
   * Function to set the open state.
   */
  setOpen: PropTypes.func,

  /**
   * Component to render as the title of the Infosheet
   */
  title: PropTypes.node,

  /**
   * Component to render as the content of the Infosheet
   */
  content: PropTypes.node,
};

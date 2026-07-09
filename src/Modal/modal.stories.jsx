import { Button, Typography } from '@mui/material';
import { useState } from 'react';

import { PSAModal } from './modal';

const meta = {
  title: 'Layout/Modal',
  component: PSAModal,
  tags: ['autodocs'],
};

export default meta;

export const Uncontrolled = {
  args: {
    button: 'Open Modal',
    modalContent: (
      <>
        <Typography variant="h6" gutterBottom>
          Uncontrolled Modal
        </Typography>
        <Typography>This modal manages its own open/close state.</Typography>
      </>
    ),
  },
};

function ControlledComponent() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Button variant="contained" onClick={() => setOpen(true)}>
        Open Controlled Modal
      </Button>

      <PSAModal
        open={open}
        onClose={() => setOpen(false)}
        modalContent={
          <>
            <Typography variant="h6" gutterBottom>
              Controlled Modal
            </Typography>
            <Typography>The parent component controls the state.</Typography>
          </>
        }
      />
    </>
  );
}

export const Controlled = {
  render: () => <ControlledComponent />,
};

export const LargeContent = {
  args: {
    button: 'Large Modal',
    paperProps: {
      sx: {
        p: 3,
        maxWidth: 800,
        width: '90%',
      },
    },
    modalContent: (
      <>
        <Typography variant="h5" gutterBottom>
          Large Modal Example
        </Typography>

        {Array.from({ length: 10 }).map((_, i) => (
          // biome-ignore lint/suspicious/noArrayIndexKey: okay for demo
          <Typography key={i} paragraph>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor
            incididunt ut labore et dolore magna aliqua.
          </Typography>
        ))}
      </>
    ),
  },
};

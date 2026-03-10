import { Box, Button, Grid, Typography } from '@mui/material';
import { useState } from 'react';
import PSAAccordion from '../Accordion';
import { PSAInfoSheet, PSAInfoSheetAttributeBox } from './index';

export default {
  title: 'Layout/Infosheet',
  component: PSAInfoSheet,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: `This is a custom Infosheet dialog for displaying crop details information. 
        The component is build on the basis of [MUI Dialog](https://mui.com/material-ui/react-dialog/)`,
      },
    },
  },
};

// Default story
export const DefaultInfoSheet = () => {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Button onClick={() => setOpen(true)}>Open Infosheet</Button>
      <PSAInfoSheet
        open={open}
        setOpen={setOpen}
        title={<Box sx={{ height: '50px' }}>Title</Box>}
        content={<Box sx={{ width: '100px', height: '100px' }}>Infosheet content</Box>}
      />
    </>
  );
};

export const SampleSelectorInfoSheet = () => {
  const [open, setOpen] = useState(false);
  const [accordionOpen, _setAccordionOpen] = useState(true);

  console.log('accordionOpen', accordionOpen);

  return (
    <>
      <Button onClick={() => setOpen(true)}>Open Infosheet</Button>
      <PSAInfoSheet
        open={open}
        setOpen={setOpen}
        title={<Box sx={{ height: '50px' }}>Title</Box>}
        content={
          <Box sx={{ minWidth: '800px' }}>
            <PSAAccordion
              sx={{
                border: '1px solid #e3e1e1',
                '& .MuiAccordionDetails-root': {
                  backgroundColor: { xs: '#F5F5F5', md: 'white' },
                  borderRadius: '0 0 30px 30px',
                  padding: { xs: '0', md: '8px' },
                },
              }}
              summaryContent={
                <Typography
                  className={`infosheetAccordionButton`}
                  variant="h4"
                  style={{ color: 'grey' }}
                >
                  Basic Agronomics
                </Typography>
              }
              detailsContent={
                <Grid container>
                  <PSAInfoSheetAttributeBox
                    key={0}
                    description={'description'}
                    label={'sample attribute'}
                    value={'value'}
                  />
                  <PSAInfoSheetAttributeBox
                    variant={'texts'}
                    key={1}
                    description={'description'}
                    label={'sample note'}
                    value={'value'}
                  />
                </Grid>
              }
            />
          </Box>
        }
      />
    </>
  );
};

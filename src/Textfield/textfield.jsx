import { styled, TextField } from '@mui/material';

/**
 * This component is based on [MUI TextField](https://mui.com/material-ui/react-text-field/) component.
 */
export const PSATextField = styled((props) => (
  <TextField
    {...props}
    sx={{ fieldset: props.label ? {} : { top: 0 } }}
    slotProps={{
      inputLabel: { shrink: true },
    }}
  />
))(({ theme }) => ({
  '.MuiOutlinedInput-root': {
    fieldset: {
      borderWidth: '2px',
      borderColor: theme.palette.additional.border,
    },
    '&:hover fieldset': {
      borderColor: theme.palette.main.accent2,
    },
    '&.Mui-focused fieldset': {
      borderColor: theme.palette.main.accent2,
    },
    '&.Mui-error fieldset': {
      borderColor: theme.palette.additional.error,
    },
    '&.Mui-disabled fieldset': {
      borderColor: theme.palette.additional.border,
    },
    '&.Mui-disabled': {
      backgroundColor: '#F0F0F0',
    },
  },
  '& label': {
    transform: 'translate(0, -20px)',
    transformOrigin: 'top left',
    color: theme.palette.main.text,
    fontFamily: 'IBM Plex Sans',
    fontSize: '0.875rem',
    fontStyle: 'italic',
    fontWeight: 500,
    maxWidth: '100%',
    overflow: 'visible',
    '&.Mui-focused': {
      color: theme.palette.main.text,
    },
    '&.Mui-error': {
      color: theme.palette.main.text,
    },
    '&.Mui-disabled': {
      color: '#757575',
    },
  },
  'legend span': {
    display: 'none',
  },
  input: {
    fontFamily: 'IBM Plex Sans',
    padding: '8px',
    '&.Mui-disabled': {
      color: '#737373',
      background: theme.palette.additional.background2,
      WebkitTextFillColor: 'unset',
    },
  },
}));

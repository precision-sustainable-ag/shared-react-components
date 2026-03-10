import { useAuth0 } from '@auth0/auth0-react';
import { Box } from '@mui/material';
import PropTypes from 'prop-types';

export function PSAProfile({ styles }) {
  const { user, isAuthenticated } = useAuth0();

  return (
    <Box sx={{ border: 0.5, borderColor: 'grey.300', ...styles }} ml={2} mr={2} mt={5}>
      {isAuthenticated ? (
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'auto 1fr',
            columnGap: '16px',
          }}
        >
          <img
            src={user.picture}
            alt="Profile"
            style={{
              borderRadius: '50%',
              height: '80px',
              width: '80px',
            }}
          />
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-around',
            }}
          >
            <h2
              style={{
                marginTop: 0,
                marginBottom: 0,
              }}
            >
              {user.name}
            </h2>
            <span
              style={{
                fontSize: '1.3rem',
              }}
            >
              {user.email}
            </span>
          </div>
        </div>
      ) : (
        <div>You have not been logged in!</div>
      )}
    </Box>
  );
}

/* Define Props Type */

PSAProfile.propTypes = {
  /** Additional styles for profile */
  styles: PropTypes.object,
};

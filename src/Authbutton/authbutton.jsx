import { useAuth0 } from '@auth0/auth0-react';
import PersonIcon from '@mui/icons-material/Person';
import PropTypes from 'prop-types';
import PSAFigmaButton from '../FigmaButton';

/**
 * This is a button component based on `figmaButton`. The button includes functions for login/logout and is need to be implemented under
 * `Auth0Provider`. Check [Auth0 document](https://developer.auth0.com/resources/guides/spa/react/basic-authentication) for more details.
 */
export function PSAAuthButton({ buttonSx, textSx }) {
  const { isAuthenticated, logout, loginWithPopup, loginWithRedirect } = useAuth0();

  const handleSignup = async () => {
    const options = {
      authorizationParams: {
        screen_hint: 'signup',
      },
    };

    if (window.Cypress) {
      await loginWithRedirect(options);
    } else {
      await loginWithPopup(options);
    }
  };

  const handleLogin = async () => {
    if (window.Cypress) await loginWithRedirect();
    else await loginWithPopup();
  };

  const handleLogout = () => {
    logout({
      logoutParams: {
        returnTo: window.location.origin,
      },
    });
  };

  return (
    <>
      <PSAFigmaButton
        variant="color"
        icon={<PersonIcon />}
        rightIcon
        text={isAuthenticated ? 'LOGOUT' : 'LOGIN'}
        onClick={isAuthenticated ? handleLogout : handleLogin}
        buttonSx={{
          backgroundColor: isAuthenticated ? 'additional.error' : 'main.accent2',
          ...buttonSx,
        }}
        textSx={{ fontSize: '1rem', ...textSx }}
        data-test="auth_button"
      />

      {!isAuthenticated && (
        <PSAFigmaButton
          variant="color"
          icon={<PersonIcon />}
          rightIcon
          text={'SIGN UP'}
          onClick={handleSignup}
          buttonSx={{
            // backgroundColor: 'main.accent2',
            backgroundColor: '#66f',
            ...buttonSx,
          }}
          textSx={{ fontSize: '1rem', ...textSx }}
          data-test="signup_button"
        />
      )}
    </>
  );
}

/* Define Props Type */

PSAAuthButton.propTypes = {
  /** Additional styles for button */
  buttonSx: PropTypes.object,
  /** Additional styles for the text in the button */
  textSx: PropTypes.object,
};

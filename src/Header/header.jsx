import MenuIcon from '@mui/icons-material/Menu';
import {
  Box,
  Button,
  Grid,
  Menu,
  MenuItem,
  Typography,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import PropTypes from 'prop-types';
import React, { Fragment, useState } from 'react';
import { PSAFigmaButton, PSALogoDisplayer } from '../index';

export function PSAHeader({ title, subtitle, council, onLogoClick, logoTitle, navContent }) {
  const theme = useTheme();
  const underMd = useMediaQuery(theme.breakpoints.down('md'));

  const [anchor, setAnchor] = useState(null);
  const open = Boolean(anchor);

  return (
    <Grid
      container
      sx={{
        display: 'flex',
        height: underMd ? '85px' : '120px',
      }}
      pl={underMd ? 0 : '1rem'}
      pr={underMd ? 0 : '1rem'}
    >
      <Grid
        item
        xs={10}
        md={6}
        sx={{
          display: 'flex',
          justifyContent: 'flex-start',
          alignItems: 'center',
        }}
      >
        <Button
          onClick={onLogoClick}
          title={logoTitle}
          data-test="header_logo_button"
          aria-label="Reset and go back to home page"
        >
          <Box sx={{ width: underMd ? '100px' : '150px' }}>
            <PSALogoDisplayer
              council={council}
              alt={council}
              style={{
                maxWidth: underMd ? '100px' : '150px',
                maxHeight: underMd ? '60px' : '80px',
              }}
            />
          </Box>
        </Button>

        <Grid item sx={{ display: 'flex', flexDirection: 'column' }}>
          <Grid
            item
            xs={12}
            sx={{
              display: 'flex',
              alignItems: 'flex-end',
              height: '2.25rem',
              flex: 1,
            }}
          >
            <Typography
              variant="header"
              fontSize={underMd ? '1.25rem' : '2.5rem'}
              data-test="header_title"
            >
              {title}
            </Typography>
          </Grid>
          {subtitle && (
            <Grid item xs={12} sx={{ display: 'flex' }}>
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  height: '2.25rem',
                }}
              >
                <Typography
                  variant="subtitle"
                  fontSize={underMd && '0.75rem'}
                  data-test="header_subtitle"
                >
                  {subtitle}
                </Typography>
              </Box>
            </Grid>
          )}
        </Grid>
      </Grid>

      <Grid
        item
        xs={2}
        md={6}
        sx={{
          display: 'flex',
          justifyContent: underMd ? 'center' : 'flex-end',
          alignItems: 'center',
          gap: '0.5rem',
        }}
      >
        {underMd ? (
          <>
            <Button onClick={(e) => setAnchor(e.target)} data-test="open_menu">
              <MenuIcon style={{ color: theme.palette.main.accent1 }} />
            </Button>
            <Menu anchorEl={anchor} open={open} onClose={() => setAnchor(null)}>
              {navContent?.map((item, i) => (
                <MenuItem
                  onClick={() => {
                    if (item.type === 'button') {
                      item.onClick();
                      setAnchor(null);
                    }
                  }}
                  key={i}
                  data-test={`navbar-${item.text}`}
                >
                  {/* if type is button, return text menuItem, else return component directly */}
                  {item.type === 'button' ? (
                    <Typography
                      sx={{
                        fontSize: '0.875rem',
                        fontWeight: 'bold',
                        color: 'main.text',
                      }}
                    >
                      {item.text}
                    </Typography>
                  ) : (
                    item.component
                  )}
                </MenuItem>
              ))}
            </Menu>
          </>
        ) : (
          navContent.map((item, i) => (
            <Fragment key={i}>
              {item.type === 'button' ? (
                <PSAFigmaButton
                  variant={item.variant}
                  icon={item.icon}
                  rightIcon={item.rightIcon}
                  text={item.text}
                  key={i}
                  onClick={item.onClick}
                  buttonSx={item.buttonSx}
                  textSx={{ ...item.textSx, fontSize: '1rem' }}
                  data-test={`navbar-${item.text}`}
                />
              ) : (
                item.component
              )}
            </Fragment>
          ))
        )}
      </Grid>
    </Grid>
  );
}

/* Define Props Type */

PSAHeader.propTypes = {
  /**
   * The title of the header.
   */
  title: PropTypes.string,
  /**
   * The subtitle of the header, locates under the header
   */
  subtitle: PropTypes.string,
  /**
   * Current council, the value will be applied to the logo displayer
   */
  council: PropTypes.string,
  /**
   * The onClick function for the logo image.
   */
  onLogoClick: PropTypes.func,
  /**
   * The title for the logo image, which will show when hovering at the logo
   */
  logoTitle: PropTypes.string,
  /**
   * Content of the navbar, this should be a list of components with type property `type="button"` or `type="component"`.
   */
  navContent: PropTypes.arrayOf(
    PropTypes.shape({
      type: PropTypes.oneOf(['button', 'component']),
      variant: PropTypes.oneOf(['standard', 'color', 'text']),
      icon: PropTypes.node,
      rightIcon: PropTypes.bool,
      leftIcon: PropTypes.bool,
      text: PropTypes.string,
      props: PropTypes.object,
      buttonSx: PropTypes.object,
      textSx: PropTypes.object,
      component: PropTypes.node,
    }),
  ),
};

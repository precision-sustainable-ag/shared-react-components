import {
  AutoFixHighOutlined,
  ChatBubbleOutline,
  Close as CloseIcon,
  HelpOutline,
  InfoOutlined,
  Menu as MenuIcon,
  TextSnippetOutlined,
} from '@mui/icons-material';

import {
  Box,
  Button,
  Dialog,
  DialogContent,
  DialogTitle,
  Grid2,
  IconButton,
  Menu,
  MenuItem,
  Typography,
  useTheme,
} from '@mui/material';

import PropTypes from 'prop-types';
import { Fragment, useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import PSAFigmaButton from '../FigmaButton';
import PSAHistory from '../History';
import PSALogoDisplayer from '../LogoDisplayer';
import { PSAWizard } from '../Wizard';

export const PSAHeader = ({
  title,
  subtitle,
  council,
  onLogoClick,
  logoTitle,
  navContent = [],
  aboutLink,
  helpLink,
  feedbackLink,
  wizardLink,
  releaseLink,
  loadHistory,
  getStore,
}) => {
  const navigate = useNavigate();
  if (!navContent) {
    navContent = [];

    if (aboutLink !== false) {
      navContent.push(
        aboutLink || {
          type: 'button',
          variant: 'text',
          text: 'About',
          icon: <InfoOutlined />,
          rightIcon: true,
          onClick: () => navigate('/About'),
        },
      );
    }

    if (helpLink !== false) {
      navContent.push(
        helpLink || {
          type: 'button',
          variant: 'text',
          text: 'Help',
          icon: <HelpOutline />,
          rightIcon: true,
          onClick: () => navigate('/Help'),
        },
      );
    }

    if (feedbackLink !== false) {
      navContent.push(
        feedbackLink || {
          type: 'button',
          variant: 'text',
          text: 'Feedback',
          icon: <ChatBubbleOutline />,
          rightIcon: true,
          onClick: () => navigate('/Feedback'),
        },
      );
    }

    if (wizardLink !== false) {
      navContent.push(
        wizardLink || {
          type: 'button',
          variant: 'text',
          text: 'Wizard',
          icon: <AutoFixHighOutlined />,
          rightIcon: true,
          onClick: () => setDialog(<PSAWizard />),
        },
      );
    }

    if (releaseLink !== false) {
      navContent.push(
        releaseLink || {
          type: 'button',
          variant: 'text',
          text: 'Release Notes',
          icon: <TextSnippetOutlined />,
          rightIcon: true,
          onClick: () => navigate('/Notes'),
        },
      );
    }
  }

  const theme = useTheme();
  const mainRef = useRef(null);
  const leftRef = useRef(null);
  const rightRef = useRef(null);
  const [compact, setCompact] = useState(false);
  const breakWidthRef = useRef(0);
  const [ready, setReady] = useState(false);
  const [height, setHeight] = useState(null);

  const [anchor, setAnchor] = useState(null);
  const open = Boolean(anchor);

  const [natural, setNatural] = useState(null);
  const [dialog, setDialog] = useState(null);

  const handleLoad = useCallback(
    (e) => {
      void title;
      const { naturalWidth: nw, naturalHeight: nh } = e.target;
      setNatural({ nw, nh });
    },
    [title],
  );

  useEffect(() => {
    void title;
    setCompact(false);
    setReady(false);
    setHeight(null);
    breakWidthRef.current = 0;
  }, [title]);

  useEffect(() => {
    if (!natural) return;

    if (council === 'USDA') {
      setHeight(47);
      return;
    }

    const compute = () => {
      const { nw, nh } = natural;

      const scale = Math.sqrt((window.innerWidth ** 0.9 * 20) / (nw * nh));
      const height = Math.max(50, Math.min(nh * scale, 70));
      setHeight(height);
    };

    compute();

    window.addEventListener('resize', compute);
    return () => window.removeEventListener('resize', compute);
  }, [natural, council]);

  const checkOverlap = useCallback(() => {
    requestAnimationFrame(() => {
      const lw = leftRef.current.scrollWidth;
      const rl = rightRef.current.getBoundingClientRect().left - 10;
      const sw = mainRef.current.clientWidth;

      if (ready && height) {
        if (!compact && rl < lw) {
          breakWidthRef.current = sw + (lw - rl);
        }
        setCompact(sw < breakWidthRef.current);
      }
    });
  }, [ready, compact, height]);

  useLayoutEffect(() => {
    const leftEl = leftRef.current;
    const rightEl = rightRef.current;
    const parentEl = leftEl?.parentElement;

    if (!leftEl || !rightEl || !parentEl) return;

    const ro = new ResizeObserver(checkOverlap);

    ro.observe(leftRef.current);
    ro.observe(rightRef.current);
    ro.observe(leftRef.current.parentElement);

    const handleImageLoad = () => {
      requestAnimationFrame(() => {
        checkOverlap();
        setReady(true);
      });
    };

    const img = parentEl.querySelector('img');

    if (img) {
      img.addEventListener('load', handleImageLoad);
    } else {
      setReady(true);
    }

    return () => {
      ro.disconnect();
      if (img) img.removeEventListener('load', handleImageLoad);
    };
  }, [checkOverlap]);

  const fullNav = (
    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 1 }}>
      {loadHistory && <PSAHistory loadHistory={loadHistory} getStore={getStore} />}
      <Box sx={{ display: 'flex', alignItems: 'center' }}>
        {navContent.map((item) => (
          <Fragment key={item.text}>
            {item.type === 'button' ? (
              <PSAFigmaButton
                variant={item.variant}
                icon={item.icon}
                rightIcon={item.rightIcon}
                text={item.text}
                onClick={item.onClick}
                buttonSx={item.buttonSx}
                textSx={{ ...item.textSx, fontSize: '1rem' }}
                data-test={`navbar-${item.text}`}
              />
            ) : (
              item.component
            )}
          </Fragment>
        ))}
      </Box>
    </Box>
  );

  return (
    <>
      <Dialog open={!!dialog} onClose={() => setDialog(null)} fullWidth maxWidth="lg">
        <DialogTitle sx={{ m: 0, p: 2 }}>
          <IconButton
            aria-label="close"
            onClick={() => setDialog(null)}
            sx={{
              position: 'absolute',
              right: 8,
              top: 8,
            }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent>{dialog}</DialogContent>
      </Dialog>
      <Grid2
        ref={mainRef}
        container
        alignItems="flex-start"
        wrap="nowrap"
        sx={{
          visibility: ready ? 'visible' : 'hidden',
          position: 'relative',
        }}
      >
        <Grid2
          ref={leftRef}
          sx={{
            display: 'flex',
            alignItems: 'center',
            minWidth: 0,
            // outline: '1px solid red',
          }}
        >
          {council ? (
            <Button
              onClick={onLogoClick}
              title={logoTitle}
              data-test="header_logo_button"
              aria-label="Reset and go back to home page"
            >
              <Box>
                <PSALogoDisplayer
                  council={council}
                  alt={council}
                  onLoad={handleLoad}
                  style={{
                    visibility: height ? 'visible' : 'hidden',
                    height: height ? `${height}px` : undefined,
                  }}
                />
              </Box>
            </Button>
          ) : null}

          <Grid2
            sx={{
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              minWidth: 0,
            }}
          >
            <Grid2 sx={{ display: 'flex', alignItems: 'center' }}>
              <Typography
                variant="header"
                fontSize={council === 'USDA' ? '20px' : 'clamp(20px, 2vw, 32px)'}
                whiteSpace="nowrap"
                data-test="header_title"
                color="black"
              >
                {title}
              </Typography>
            </Grid2>

            {subtitle && (
              <Grid2 sx={{ display: 'flex', alignItems: 'center' }}>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <Typography
                    variant="subtitle"
                    fontSize={council === 'USDA' ? '12px' : 'clamp(12px, 1.5vw, 20px)'}
                    fontFamily={
                      council === 'USDA'
                        ? 'Source Sans Pro Web, Helvetica Neue, Helvetica, Roboto, Arial, sans-serif'
                        : ''
                    }
                    data-test="header_subtitle"
                    color="black"
                  >
                    {subtitle}
                  </Typography>
                </Box>
              </Grid2>
            )}
          </Grid2>
        </Grid2>

        <Grid2
          ref={rightRef}
          sx={{
            display: 'flex',
            alignItems: 'center',
            flexShrink: 0,
            ml: 'auto',
            // outline: '1px solid blue',
          }}
        >
          {compact ? (
            <>
              <Button onClick={(e) => setAnchor(e.currentTarget)} data-test="open_menu">
                <MenuIcon style={{ color: theme.palette.main.accent1 }} />
              </Button>
              <Menu anchorEl={anchor} open={open} onClose={() => setAnchor(null)}>
                {loadHistory && (
                  <PSAHistory
                    loadHistory={loadHistory}
                    getStore={getStore}
                    inMenu
                    setAnchor={setAnchor}
                  />
                )}

                {navContent?.map((item) => (
                  <MenuItem
                    onClick={() => {
                      if (item.type === 'button') {
                        item.onClick();
                        setAnchor(null);
                      }
                    }}
                    key={item.text}
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
            fullNav
          )}
        </Grid2>
      </Grid2>
    </>
  );
};

/* Define Props Type */

PSAHeader.propTypes = {
  /**
   * The title of the header.
   */
  title: PropTypes.node,
  /**
   * The subtitle of the header, locates under the header
   */
  subtitle: PropTypes.node,
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

  /**
   * false = hide, object = custom item, otherwise default link
   */
  aboutLink: PropTypes.oneOfType([PropTypes.bool, PropTypes.object]),
  helpLink: PropTypes.oneOfType([PropTypes.bool, PropTypes.object]),
  feedbackLink: PropTypes.oneOfType([PropTypes.bool, PropTypes.object]),
  wizardLink: PropTypes.oneOfType([PropTypes.bool, PropTypes.object]),
  releaseLink: PropTypes.oneOfType([PropTypes.bool, PropTypes.object]),
};

import {
  AutoFixHighOutlined,
  ChatBubbleOutlineOutlined,
  Close as CloseIcon,
  HelpOutlineOutlined,
  InfoOutlined,
  Menu as MenuIcon,
  TextSnippetOutlined,
} from '@mui/icons-material';

import {
  Box,
  Button,
  ClickAwayListener,
  Dialog,
  DialogContent,
  DialogTitle,
  IconButton,
  Typography,
  useTheme,
} from '@mui/material';

import PropTypes from 'prop-types';
import {
  Fragment,
  isValidElement,
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from 'react';

import PSAFigmaButton from '../FigmaButton';
import PSAHistory from '../History';
import PSALogoDisplayer from '../LogoDisplayer';
import { PSAWizard2 } from '../Wizard2';

export const PSAHeader = ({
  title,
  subtitle,
  council,
  onLogoClick,
  logoTitle,
  navContent = [],
  loadHistory,
  getStore,
}) => {
  const theme = useTheme();
  council = council || 'PSA';

  const [titlePadding, setTitlePadding] = useState(2);
  const [dialogMaxWidth, setDialogMaxWidth] = useState('lg');
  const [path, setPath] = useState(window.location.pathname);

  const showHistory = !!loadHistory;

  const menu = (text, icon, path, item, titlePadding = 2, maxWidth = 'auto') => ({
    text,
    icon,
    onClick: () => {
      if (item?.dialog) {
        setDialog(item.dialog);
        setTitlePadding(titlePadding);
        setDialogMaxWidth(maxWidth);
      } else {
        window.history.pushState({}, '', path);
        window.dispatchEvent(new PopStateEvent('popstate'));
      }
    },
  });

  const items = navContent.map((item) => {
    if (item === 'About' || item.text === 'About') {
      return menu('About', item.icon ?? <InfoOutlined />, '/About', item);
    } else if (item === 'Help' || item.text === 'Help') {
      return menu('Help', item.icon ?? <HelpOutlineOutlined />, '/Help', item);
    } else if (item === 'Feedback' || item.text === 'Feedback') {
      return menu('Feedback', item.icon ?? <ChatBubbleOutlineOutlined />, '/Feedback', item);
    } else if (item === 'Wizard' || item.text === 'Wizard') {
      return menu(
        'Wizard',
        item.icon ?? <AutoFixHighOutlined />,
        '/Wizard',
        { dialog: item.dialog || <PSAWizard2 /> },
        0,
        1050,
      );
    } else if (item === 'Notes' || item.text === 'Notes') {
      return menu('Release Notes', item.icon ?? <TextSnippetOutlined />, '/Notes', item);
    }

    return item;
  });

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
    if (!compact || !open) return;
    const handleKey = (e) => {
      if (e.key === 'Escape') {
        setAnchor(null);
      }
    };

    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [compact, open]);

  useEffect(() => {
    void title;
    void path;
    setCompact(false);
    setAnchor(null);
    breakWidthRef.current = 0;
  }, [title, path]);

  useEffect(() => {
    const handler = () => setPath(window.location.pathname);
    window.addEventListener('popstate', handler);
    return () => window.removeEventListener('popstate', handler);
  }, []);

  useEffect(() => {
    if (!natural) return;

    if (council === 'USDA') {
      setHeight(47);
      return;
    }

    const compute = () => {
      const { nw, nh } = natural;
      const scale = Math.sqrt((window.innerWidth ** 0.9 * 20) / (nw * nh));
      const newHeight = Math.max(50, Math.min(nh * scale, 70));
      setHeight(newHeight);
    };

    compute();
    setAnchor(null);

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

    ro.observe(leftEl);
    ro.observe(rightEl);
    ro.observe(parentEl);

    const handleImageLoad = () => {
      requestAnimationFrame(() => {
        checkOverlap();
        setReady(true);
      });
    };

    const img = parentEl.querySelector('img');

    if (img) {
      if (img.complete) {
        handleImageLoad();
      } else {
        img.addEventListener('load', handleImageLoad);
      }
    } else {
      setReady(true);
    }

    return () => {
      ro.disconnect();
      if (img && !img.complete) img.removeEventListener('load', handleImageLoad);
    };
  }, [checkOverlap]);

  const navButtons = (
    <Box
      sx={{
        display: 'flex',
        flexDirection: compact ? 'column' : 'row',
        alignItems: compact ? 'stretch' : 'center',
        gap: 0.5,
      }}
    >
      {items.map((item) => (
        <Fragment key={item.key ?? item.text}>
          {isValidElement(item) ? (
            item
          ) : item.component ? (
            item.component
          ) : (
            <PSAFigmaButton
              variant={item.variant ?? 'text'}
              icon={item.icon}
              rightIcon={item.rightIcon ?? true}
              leftIcon={!(item.rightIcon ?? true)}
              text={item.text}
              onClick={() => {
                item.onClick?.();
                if (compact) setAnchor(null);
              }}
              buttonSx={{
                justifyContent: compact ? 'flex-start' : undefined,
                width: compact ? '100%' : undefined,
                ...item.buttonSx,
              }}
              textSx={{
                fontSize: compact ? '0.9rem' : '1rem',
                fontWeight: compact ? 'bold' : '',
                textDecoration: compact ? 'none !important' : '',
                ...item.textSx,
              }}
              data-test={`navbar-${item.text}`}
            />
          )}
        </Fragment>
      ))}
    </Box>
  );

  const navPanel = (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: compact ? 'stretch' : 'center',
        justifyContent: compact ? 'flex-start' : showHistory ? 'flex-start' : 'center',
        flex: compact ? '0 0 auto' : '1 1 auto',
        gap: 1,
        p: compact ? 1.5 : 0,
        minWidth: compact ? 220 : 'auto',
        backgroundColor: compact ? 'background.paper' : 'transparent',
        boxShadow: compact ? 3 : 'none',
        borderRadius: compact ? 1 : 0,
      }}
    >
      {showHistory ? (
        <Box sx={{ order: compact ? 999 : 0, alignSelf: 'flex-end' }}>
          <PSAHistory
            loadHistory={loadHistory}
            getStore={getStore}
            compact={compact}
            setAnchor={setAnchor}
          />
        </Box>
      ) : null}

      {navButtons}
    </Box>
  );

  return (
    <>
      <Dialog
        open={!!dialog}
        onClose={() => setDialog(null)}
        fullWidth
        maxWidth="lg"
        slotProps={{
          paper: {
            sx: { maxWidth: dialogMaxWidth },
          },
        }}
      >
        <DialogTitle sx={{ m: 0, p: titlePadding }}>
          <IconButton
            aria-label="close"
            onClick={() => setDialog(null)}
            sx={{
              position: 'absolute',
              right: 8,
              top: 8,
              zIndex: 9999,
            }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent sx={{ p: 0 }}>{dialog}</DialogContent>
      </Dialog>
      <Box
        ref={mainRef}
        sx={{
          display: 'flex',
          alignItems: 'stretch',
          flexWrap: 'nowrap',
          visibility: ready ? 'visible' : 'hidden',
          position: 'relative',
        }}
      >
        <Box
          ref={leftRef}
          sx={{
            display: 'flex',
            alignItems: 'center',
            minWidth: 0,
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

          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              minWidth: 0,
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <Typography
                variant="header"
                fontSize={council === 'USDA' ? '20px' : 'clamp(20px, 2vw, 32px)'}
                whiteSpace="nowrap"
                data-test="header_title"
                color="black"
              >
                {title}
              </Typography>
            </Box>

            {subtitle && (
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
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
              </Box>
            )}
          </Box>
        </Box>

        <Box
          ref={rightRef}
          sx={{
            position: 'relative',
            display: 'flex',
            alignItems: 'stretch',
            flexShrink: 0,
            ml: 'auto',
            zIndex: compact ? 1300 : 'auto',
          }}
        >
          <ClickAwayListener onClickAway={() => setAnchor(null)}>
            <Box
              sx={{
                position: 'relative',
                display: 'flex',
                alignItems: 'stretch',
                height: '100%',
              }}
            >
              {compact && (
                <Button
                  onClick={(e) => setAnchor(anchor ? null : e.currentTarget)}
                  data-test="open_menu"
                >
                  <MenuIcon style={{ color: theme.palette.main.accent1 }} />
                </Button>
              )}
              <Box
                sx={{
                  display: compact ? (open ? 'block' : 'none') : 'flex',
                  position: compact ? 'absolute' : 'static',
                  top: compact ? '100%' : 'auto',
                  right: compact ? 0 : 'auto',
                  mt: compact ? 1 : 0,
                  alignItems: 'stretch',
                }}
              >
                {navPanel}
              </Box>
            </Box>
          </ClickAwayListener>
        </Box>
      </Box>
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
   * Navigation items for the header
   */
  navContent: PropTypes.arrayOf(
    PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.shape({
        text: PropTypes.string,
        icon: PropTypes.node,
        onClick: PropTypes.func,
        props: PropTypes.object,
        buttonSx: PropTypes.object,
        textSx: PropTypes.object,
        component: PropTypes.node,
        dialog: PropTypes.node,

        /**
         * Optional overrides.
         */
        variant: PropTypes.oneOf(['standard', 'color', 'text']),
        rightIcon: PropTypes.bool,
      }),
    ]),
  ),
  loadHistory: PropTypes.func,
  getStore: PropTypes.func,
};

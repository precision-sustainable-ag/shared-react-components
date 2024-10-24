import React, { useState } from "react";
import PropTypes from "prop-types";
import { PSALogoDisplayer, PSAFigmaButton } from "../index";
import {
  Box,
  Typography,
  Grid,
  Button,
  useMediaQuery,
  useTheme,
  Menu,
  MenuItem,
} from "@mui/material";
import { useAuth0 } from "@auth0/auth0-react";
import MenuIcon from "@mui/icons-material/Menu";
import PersonIcon from "@mui/icons-material/Person";

export function PSAHeader({
  title,
  subtitle,
  council,
  onLogoClick,
  navButtons,
}) {
  const theme = useTheme();
  const underMd = useMediaQuery(theme.breakpoints.down("md"));

  const [anchor, setAnchor] = useState(null);
  const open = Boolean(anchor);

  const { isAuthenticated, logout, loginWithPopup, loginWithRedirect } =
    useAuth0();

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

  const handleAuthButtonClick = () => {
    if (isAuthenticated) return handleLogout();
    return handleLogin();
  };

  return (
    <Grid
      container
      sx={{
        display: "flex",
        height: underMd ? "85px" : "9.6875rem",
      }}
      pr="1rem"
    >
      <Grid
        item
        xs={10}
        md={6}
        sx={{ display: "flex", justifyContent: "center", alignItems: "center" }}
      >
        <Button onClick={onLogoClick} data-test="header_logo_button">
          <PSALogoDisplayer
            council={council}
            alt={council}
            style={{
              height: "75px",
            }}
          />
        </Button>

        <Grid item sx={{ display: "flex", flexDirection: "column" }}>
          <Grid
            item
            xs={12}
            sx={{
              display: "flex",
              alignItems: "flex-end",
              height: "2.25rem",
              flex: 1,
            }}
          >
            <Typography
              variant="header"
              fontSize={underMd ? "1.25rem" : "2.5rem"}
              data-test="header_title"
            >
              {title}
            </Typography>
          </Grid>
          <Grid item xs={12} sx={{ display: "flex" }}>
            <Box
              sx={{ display: "flex", alignItems: "center", height: "2.25rem" }}
            >
              <Box
                sx={{
                  width: "11.6875rem",
                  height: "0.3125rem",
                  backgroundColor: "main.accent1",
                  marginRight: "1rem",
                }}
              />
              <Typography
                variant="subtitle"
                fontSize={underMd && "0.75rem"}
                data-test="header_subtitle"
              >
                {subtitle}
              </Typography>
            </Box>
          </Grid>
        </Grid>
      </Grid>

      <Grid
        item
        xs={2}
        md={6}
        sx={{
          display: "flex",
          justifyContent: underMd ? "center" : "flex-end",
          alignItems: "center",
          gap: "0.5rem",
        }}
      >
        {underMd ? (
          <>
            <Button onClick={(e) => setAnchor(e.target)} data-test="open_menu">
              <MenuIcon style={{ color: theme.palette.main.accent1 }} />
            </Button>
            <Menu anchorEl={anchor} open={open} onClose={() => setAnchor(null)}>
              {navButtons?.map((button, i) => (
                <MenuItem
                  onClick={button.onClick}
                  key={i}
                  data-test={`navbar-${button.text}`}
                >
                  <Typography
                    sx={{
                      fontSize: "0.875rem",
                      fontWeight: "bold",
                      color: "main.text",
                    }}
                  >
                    {button.text}
                  </Typography>
                </MenuItem>
              ))}
              <MenuItem onClick={handleAuthButtonClick} data-test="auth_button">
                <Typography
                  sx={{
                    fontSize: "0.875rem",
                    fontWeight: "bold",
                    color: isAuthenticated
                      ? "additional.error"
                      : "main.accent2",
                  }}
                >
                  {isAuthenticated ? "LOGOUT" : "LOGIN"}
                </Typography>
              </MenuItem>
            </Menu>
          </>
        ) : (
          <>
            {navButtons?.map((button, i) => (
              <PSAFigmaButton
                variant={button.variant}
                icon={button.icon}
                rightIcon={button.rightIcon}
                text={button.text}
                key={i}
                onClick={button.onClick}
                buttonSx={button.buttonSx}
                textSx={{ ...button.textSx, fontSize: "1rem" }}
                data-test={`navbar-${button.text}`}
              />
            ))}
            <PSAFigmaButton
              variant="color"
              icon={<PersonIcon />}
              rightIcon
              text={isAuthenticated ? "LOGOUT" : "LOGIN"}
              onClick={handleAuthButtonClick}
              buttonSx={{
                backgroundColor: isAuthenticated
                  ? "additional.error"
                  : "main.accent2",
              }}
              textSx={{ fontSize: "1rem" }}
              data-test="auth_button"
            />
          </>
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
   * List of nav buttons, this should be a list of `<PSAFigmaButton />`.
   */
  navButtons: PropTypes.arrayOf(
    PropTypes.shape({
      variant: PropTypes.oneOf(["standard", "color", "text"]),
      icon: PropTypes.node,
      rightIcon: PropTypes.bool,
      leftIcon: PropTypes.bool,
      text: PropTypes.string,
      props: PropTypes.object,
      buttonSx: PropTypes.object,
      textSx: PropTypes.object,
    })
  ),
};

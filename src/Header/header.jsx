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
import MenuIcon from "@mui/icons-material/Menu";

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

  return (
    <Grid
      container
      sx={{
        display: "flex",
        height: "9.6875rem",
      }}
    >
      <Grid
        item
        xs={10}
        md={6}
        sx={{ display: "flex", justifyContent: "center", alignItems: "center" }}
      >
        <Button onClick={onLogoClick}>
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
            <Typography variant="header" fontSize={underMd && "1.25rem"}>
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
              <Typography variant="subtitle" fontSize={underMd && "0.75rem"}>
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
          justifyContent: "center",
          alignItems: "center",
          gap: "1rem",
        }}
      >
        {underMd ? (
          <>
            <Button onClick={(e) => setAnchor(e.target)} data-test="open_menu">
              <MenuIcon style={{ color: theme.palette.main.accent1 }} />
            </Button>
            <Menu anchorEl={anchor} open={open} onClose={() => setAnchor(null)}>
              {navButtons?.map((button, i) => (
                <MenuItem onClick={button.onClick} key={i}>
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
              />
            ))}
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
};

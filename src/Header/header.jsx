import React from "react";
import PropTypes from "prop-types";
import { PSALogoDisplayer, PSAFigmaButton } from "../index";
import { Box, Typography, useTheme, Grid } from "@mui/material";
import PersonIcon from "@mui/icons-material/Person";
import ChatBubbleOutlineIcon from "@mui/icons-material/ChatBubbleOutline";

export function PSAHeader({ title, subtitle, council }) {
  const theme = useTheme();

  return (
    <Grid
      container
      sx={{
        display: "flex",
        height: "9.6875rem",
      }}
    >
      <Grid item xs={2} sx={{ margin: "auto" }}>
        <PSALogoDisplayer
          council={council}
          alt={council}
          style={{
            height: "75px",
          }}
        />
      </Grid>

      <Grid item xs={6} sx={{ display: "flex", flexDirection: "column" }}>
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
            sx={{
              color: theme.palette.main.text,
              fontFamily: "IBM Plex Sans",
              fontSize: "2.5rem",
              fontStyle: "normal",
              fontWeight: 600,
              lineHeight: "normal",
            }}
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
                backgroundColor: theme.palette.main.accent1,
                marginRight: "1rem",
              }}
            />
            <Typography
              sx={{
                color: theme.palette.main.text,
                fontFamily: "IBM Plex Sans",
                fontSize: "1.25rem",
                fontStyle: "italic",
                fontWeight: 500,
                lineHeight: "normal",
              }}
            >
              {subtitle}
            </Typography>
          </Box>
        </Grid>
      </Grid>

      <Grid
        item
        xs={4}
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          gap: "1rem",
        }}
      >
        <PSAFigmaButton
          variant="text"
          icon={<ChatBubbleOutlineIcon />}
          rightIcon
          text="FEEDBACK"
        />

        <PSAFigmaButton
          variant="color"
          text="LOGIN"
          icon={<PersonIcon />}
          rightIcon
        />
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
  subtitle: PropTypes.string,
};

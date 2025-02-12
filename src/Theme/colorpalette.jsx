import React, { useState } from "react";
import PropTypes from "prop-types";
import { Box, Typography, IconButton, Tooltip } from "@mui/material";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import CheckIcon from "@mui/icons-material/Check";
import theme from ".";

export function PSAColorpalette() {
  const [copiedHex, setCopiedHex] = useState("");
  const [copiedPath, setCopiedPath] = useState("");

  const copyToClipboard = (text, type) => {
    navigator.clipboard.writeText(text).then(() => {
      if (type === "hex") {
        setCopiedHex(text);
        setCopiedPath(""); // Reset JS Path copied state
      } else {
        setCopiedPath(text);
        setCopiedHex(""); // Reset HEX copied state
      }
      setTimeout(() => {
        setCopiedHex("");
        setCopiedPath("");
      }, 2000); // Reset after 2 seconds
    });
  };

  const ColorBox = ({ name, hex, category }) => {
    const jsPath = `PSATheme.palette.${category}.${name}`;
    const isHexCopied = copiedHex === hex;
    const isPathCopied = copiedPath === jsPath;

    return (
      <Box
        display="flex"
        alignItems="center"
        justifyContent="space-between"
        justifyItems="center"
        sx={{
          border: "1px solid #ddd",
          p: 2,
          borderRadius: 2,
          backgroundColor: "#f9f9f9",
          mb: 1.5,
        }}
      >
        <Box display="flex" alignItems="center" gap={2} mb={1}>
          <Box
            sx={{
              width: 40,
              height: 40,
              backgroundColor: hex,
              borderRadius: 1,
              border: "1px solid #ccc",
            }}
          />
          <Box>
            <Typography fontWeight="bold">{name.toUpperCase()}</Typography>
          </Box>
        </Box>

        <Box display="flex" flexDirection="column" gap={1}>
          {/* Copy HEX */}
          <Tooltip title="Copy HEX">
            <Box display="flex" alignItems="center" justifyContent="flex-end">
              <Typography variant="caption" mr={1}>
                {hex}
              </Typography>
              <IconButton
                onClick={() => copyToClipboard(hex, "hex")}
                color="primary"
              >
                {isHexCopied ? (
                  <CheckIcon color="success" />
                ) : (
                  <ContentCopyIcon />
                )}
              </IconButton>
            </Box>
          </Tooltip>

          {/* Copy Path */}
          <Tooltip title="Copy Path">
            <Box display="flex" alignItems="center">
              <Typography variant="caption" mr={1}>
                {jsPath}
              </Typography>
              <IconButton
                onClick={() => copyToClipboard(jsPath, "path")}
                color="primary"
              >
                {isPathCopied ? (
                  <CheckIcon color="success" />
                ) : (
                  <ContentCopyIcon />
                )}
              </IconButton>
            </Box>
          </Tooltip>
        </Box>
      </Box>
    );
  };

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ p: 3 }} mb={2}>
        <Typography variant="h4" mb={1}>
          Main Colors
        </Typography>

        {Object.entries(theme.palette.main).map(([name, hex]) => (
          <ColorBox key={name} name={name} hex={hex} category="main" />
        ))}
      </Box>
      <Box sx={{ p: 3 }} mb={2}>
        <Typography variant="h4" mb={1}>
          Additional Colors
        </Typography>
        {Object.entries(theme.palette.additional).map(([name, hex]) => (
          <ColorBox key={name} name={name} hex={hex} category="additional" />
        ))}
      </Box>
    </Box>
  );
}

PSAColorpalette.propTypes = {};

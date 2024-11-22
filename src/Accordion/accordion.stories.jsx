import React, { useState } from "react";
import { PSAAccordion } from "./accordion";
import { Box, Typography } from "@mui/material";
import GrassIcon from "@mui/icons-material/Grass";

const meta = {
  title: "Accordion",
  component: PSAAccordion,
  tags: ["autodocs"],
  parameters: {},
};

export default meta;

const Template = (args) => {
  const [open, setOpen] = useState(false);
  return (
    <PSAAccordion
      expanded={open}
      onChange={() => setOpen(!open)}
      summaryContent={
        <Box
          sx={{
            display: "flex",
            jutifyContent: "center",
            alignItems: "center",
            color: "additional.greydark",
          }}
        >
          <GrassIcon />
          <Typography>Summary Content</Typography>
        </Box>
      }
      detailsContent={
        <Box height={"100px"}>
          <Typography>Details content</Typography>
        </Box>
      }
      {...args}
    />
  );
};

export const DefaultAccordion = Template.bind({});
DefaultAccordion.args = {};

export const ColoredAccordion = Template.bind({});
ColoredAccordion.args = {
  sx: {
    ".MuiAccordionSummary-root": {
      backgroundColor: "main.accent2",
      ".MuiAccordionSummary-expandIconWrapper p": {
        color: "white",
      },
    },
  },
  summaryContent: (
    <Box
      sx={{
        display: "flex",
        jutifyContent: "center",
        alignItems: "center",
        color: "white",
      }}
    >
      <GrassIcon />
      <Typography fontSize={"1.5625rem"} fontWeight={600} pl={"0.5rem"}>
        White Summary Content
      </Typography>
    </Box>
  ),
};

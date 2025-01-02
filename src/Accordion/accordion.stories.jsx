import React, { useState } from "react";
import { PSAAccordion } from "./accordion";
import { Box, Typography } from "@mui/material";
import GrassIcon from "@mui/icons-material/Grass";

const meta = {
  title: "Layout/Accordion",
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

export const ErrorAccordion = Template.bind({});
ErrorAccordion.args = {
  error: true,
  summaryContent: (
    <Box
      sx={{
        display: "flex",
        jutifyContent: "center",
        alignItems: "center",
        color: "additional.greydark",
      }}
    >
      <GrassIcon />
      <Typography>Error Summary Content</Typography>
    </Box>
  ),
};

export const SubContainerAccordion = Template.bind({});
SubContainerAccordion.args = {
  sx: { background: "white" },
  summaryContent: (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center", // Fixed typo
        alignItems: "center",
        color: "additional.greydark",
      }}
    >
      <GrassIcon />
      <Typography>Sub Container Accordion</Typography>
    </Box>
  ),
  subContainer: [
    {
      title: "Card Title 1",
      list: [
        {
          key: "1.1",
          value: "1000 sq ft",
          label: "Default Seeding",
          selected: false,
        },
        {
          key: "1.2",
          value: "500 sq ft",
          label: "Another Seeding",
          selected: true,
        },
      ],
    },
    {
      title: "Card Title 2",
      list: [
        {
          key: "2.1",
          value: "2000 sq ft",
          label: "Custom Seeding",
          selected: true,
        },
        {
          key: "2.2",
          value: "1500 sq ft",
          label: "Yet Another Seeding",
          selected: false,
        },
      ],
    },
  ],
};

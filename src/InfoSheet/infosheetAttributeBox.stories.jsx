import React from "react";
import { Typography } from "@mui/material";
import { PSAInfoSheetAttributeBox } from "./index";

export default {
  title: "Layout/InfosheetAttributeBox",
  component: PSAInfoSheetAttributeBox,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component: `This is a custom Infosheet dialog for displaying crop details information. 
        The component is build on the basis of [MUI Dialog](https://mui.com/material-ui/react-dialog/)`,
      },
    },
  },
};

// Default story
export const DefaultInfoSheetAttributeBox = {
  args: {
    variant: "",
    description: "Description",
    label: "Label",
    value: "Value",
    sx: {
      minWidth: "200px",
    },
  },
};

export const InfoSheetAttributeBoxWithTexts = {
  args: {
    variant: "texts",
    description: "Description",
    label: "Label",
    value: Array.from({ length: 5 }, (_, index) => `Value ${index + 1}`).map(
      (item) => <Typography>{item}</Typography>
    ),
    sx: {
      minWidth: "200px",
    },
  },
};

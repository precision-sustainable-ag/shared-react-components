import React from "react";
import { fn } from "@storybook/test";
import { PSAHeader } from "./header";
import PersonIcon from "@mui/icons-material/Person";
import ChatBubbleOutlineIcon from "@mui/icons-material/ChatBubbleOutline";

const meta = {
  component: PSAHeader,
  tags: ["autodocs"],
  parameters: {
    layout: "fullscreen",
  },
};

export default meta;

const navButtons = [
  {
    variant: "text",
    text: "Release Notes",
    icon: <ChatBubbleOutlineIcon />,
    rightIcon: true,
    onClick: fn(),
    style: { fontSize: "1rem" },
  },
  {
    variant: "text",
    text: "About",
    icon: <ChatBubbleOutlineIcon />,
    rightIcon: true,
    onClick: fn(),
  },
  {
    variant: "text",
    text: "Feedback",
    icon: <ChatBubbleOutlineIcon />,
    rightIcon: true,
    onClick: fn(),
  },
  {
    variant: "color",
    text: "LOGIN",
    icon: <PersonIcon />,
    rightIcon: true,
    onClick: fn(),
  },
];

export const DefaultHeader = {
  args: {
    title: "Seeding Rate Calculator",
    subtitle: "",
    council: "",
    onLogoClick: fn(),
    navButtons: navButtons,
  },
};

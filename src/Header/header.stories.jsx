import React from "react";
import { fn } from "@storybook/test";
import { PSAHeader } from "./header";
import ChatBubbleOutlineIcon from "@mui/icons-material/ChatBubbleOutline";
import PSAAuthButton from "../Authbutton";
import PSADropdown from "../psadropdown";

const meta = {
  component: PSAHeader,
  tags: ["autodocs"],
  parameters: {
    layout: "fullscreen",
  },
  argTypes: {
    council: {
      control: "select",
      options: ["NECCC", "SCCC", "MCCC", "PSA"],
    },
  },
};

export default meta;

const navContent = [
  {
    type: "button",
    variant: "text",
    text: "Release Notes",
    icon: <ChatBubbleOutlineIcon />,
    rightIcon: true,
    onClick: fn(),
    style: { fontSize: "1rem" },
  },
  {
    type: "button",
    variant: "text",
    text: "About",
    icon: <ChatBubbleOutlineIcon />,
    rightIcon: true,
    onClick: fn(),
  },
  {
    type: "button",
    variant: "text",
    text: "Feedback",
    icon: <ChatBubbleOutlineIcon />,
    rightIcon: true,
    onClick: fn(),
  },
];

const customNavComponent = [
  {
    type: "component",
    component: (
      <PSADropdown
        items={[
          { label: "Option 1", value: "option1" },
          { label: "Option 2", value: "option2" },
          { label: "Option 3", value: "option3" },
        ]}
      />
    ),
  },
  {
    type: "component",
    component: <PSAAuthButton />,
  },
];

export const DefaultHeader = {
  args: {
    title: "Seeding Rate Calculator",
    subtitle: "",
    council: "",
    onLogoClick: fn(),
    navContent: navContent,
  },
};

export const HeaderWithCustomNavComponent = {
  args: {
    title: "Seeding Rate Calculator",
    subtitle: "",
    council: "",
    onLogoClick: fn(),
    navContent: [...navContent, ...customNavComponent],
  },
};

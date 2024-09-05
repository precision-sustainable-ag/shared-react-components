import { Spinner } from "./spinner";

const meta = {
  component: Spinner,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
  },
  argTypes: {
    color: {
      control: "color",
    },
    backgroundColor: {
      control: "color",
    },
  },
};

export default meta;

export const Basic = {};

export const CustomSize = {
  args: {
    size: "150px",
  },
};

export const CustomColor = {
  args: {
    color: "red",
    backgroundColor: "black",
  },
};

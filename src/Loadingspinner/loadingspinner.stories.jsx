import { PSALoadingspinner } from "./loadingspinner";
import styles from "./spinner.module.scss";

const meta = {
  title: "Feedback/PSALoadingspinner",
  component: PSALoadingspinner,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
  },
};

export default meta;

export const DefaultLoadingspinner = {
  args: {
    loaderStyle: {
      width: "50px",
      height: "50px",
      border: `8px solid #90EE90`,
      borderTop: `8px solid green`,
      borderLeft: `8px solid green`,
      borderRight: `8px solid green`,
      borderRadius: "50%",
      animation: `${styles.spin} 2s linear infinite`,
    },
  },
};

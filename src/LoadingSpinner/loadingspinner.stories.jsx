import { PSALoadingSpinner } from './loadingspinner';
import styles from './spinner.module.scss';

const meta = {
  title: 'Feedback/LoadingSpinner',
  component: PSALoadingSpinner,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
  },
};

export default meta;

export const DefaultStyle = {};

export const LoaderStyle = {
  args: {
    loaderStyle: {
      width: '50px',
      height: '50px',
      border: `8px solid black`,
      borderTop: `8px solid red`,
      borderLeft: `8px solid red`,
      borderRight: `8px solid red`,
      borderRadius: '50%',
      animation: `${styles.spin} 2s linear infinite`,
    },
  },
};

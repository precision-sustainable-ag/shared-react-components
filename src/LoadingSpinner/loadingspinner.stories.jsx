import orangeLoader from '../assets/images/orange.png';
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
      border: `8px solid #EB8868`,
      borderTop: `8px solid #DD3804`,
      borderLeft: `8px solid #DD3804`,
      borderRight: `8px solid #DD3804`,
      borderRadius: '50%',
      animation: `${styles.spin} 2s linear infinite`,
    },
  },
};

export const ImageLoader = {
  args: {
    image: orangeLoader,
  },
};

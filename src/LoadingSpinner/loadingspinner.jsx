import PropTypes from 'prop-types';
import styles from './spinner.module.scss';

export function PSALoadingSpinner({ loaderStyle, image }) {
  const defaultStyle = {
    width: '50px',
    height: '50px',
    border: `8px solid #90EE90`,
    borderTop: `8px solid green`,
    borderLeft: `8px solid green`,
    borderRight: `8px solid green`,
    borderRadius: '50%',
    animation: `${styles.spin} 2s linear infinite`,
  };

  if (image) {
    return (
      <img
        src={image}
        alt="loading"
        style={{
          width: '70px',
          height: '70px',
          borderRadius: '50%',
          animation: `${styles.spin} 2s linear infinite`,
          objectFit: 'cover',
          ...loaderStyle,
        }}
      />
    );
  }

  return <div style={loaderStyle ? loaderStyle : defaultStyle}></div>;
}

PSALoadingSpinner.propTypes = {
  /**
   * Styles for the loader
   */
  loaderStyle: PropTypes.object,
  image: PropTypes.string,
};

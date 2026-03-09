import React from 'react';
import ReactDOMServer from 'react-dom/server';

export const FieldIcon = ({ size = 18, color = '#000', className = 'field-icon' }) => (
  <svg
    id="polygon-tool"
    viewBox="0 0 24 24"
    width={size}
    height={size}
    className={`mapboxgl-ctrl-icon custom-icon ${className}`}
    style={{ verticalAlign: 'middle' }}
  >
    <path
      d="M19 19H15V21H19C20.1 21 21 20.1 21 19V15H19M19 3H15V5H19V9H21V5C21 3.9 20.1 3 19 3M5 5H9V3H5C3.9 3 3 3.9 3 5V9H5M5 15H3V19C3 20.1 3.9 21 5 21H9V19H5V15M7 11H9V13H7V11M11 11H13V13H11V11M15 11H17V13H15V11Z"
      fill={color}
      transform="scale(0.8) translate(3, 3)"
    />
  </svg>
);

export const fieldIconString = ReactDOMServer.renderToStaticMarkup(<FieldIcon />);

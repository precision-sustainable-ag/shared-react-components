import React from 'react';
import ReactDOMServer from 'react-dom/server';

export const PencilIcon = ({ size = 18, color = '#000', className = 'pencil-icon' }) => (
  <svg
    id="polygon-tool"
    viewBox="0 0 24 24"
    width={size}
    height={size}
    className={`mapboxgl-ctrl-icon custom-icon ${className}`}
    style={{ verticalAlign: 'middle' }}
  >
    <path
      d="M3 17.25V21h3.75l11-11.03-3.75-3.75L3 17.25zM20.71 7.04a1.003 
         1.003 0 0 0 0-1.42l-2.34-2.34a1.003 1.003 0 0 0-1.42 
         0l-1.83 1.83 3.75 3.75 1.84-1.82z"
      fill={color}
      transform="scale(0.8) translate(3, 3)"
    />
  </svg>
);

export const pencilIconString = ReactDOMServer.renderToStaticMarkup(<PencilIcon />);

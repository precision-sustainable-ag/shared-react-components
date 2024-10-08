import React from 'react';
import { PSACoverCropCouncil } from './PSACoverCropCouncil';

const meta = {
    title: 'PSACoverCropCouncil',
    component: PSACoverCropCouncil,
    tags: ["autodocs"],
  };
  
export default meta;

export const psaLogo = {
    render: () => (
      <PSACoverCropCouncil
      src={'src/logo-displayer/assets/PSAlogo-text.png'}
      alt=""
      style={{
        maxWidth: '120px',
        height: 'auto',
      }}
      />
    ),
  };

  export const mwcccLogo = {
    render: () => (
      <PSACoverCropCouncil
      src={'src/logo-displayer/assets/mwccc_logo.png'}
      alt=""
      style={{
        maxWidth: '120px',
        height: 'auto',
      }}
      />
    ),
  };

  export const necccLogo = {
    render: () => (
      <PSACoverCropCouncil
      src={'src/logo-displayer/assets/neccc_wide_logo_color_web.jpg'}
      alt=""
      style={{
        maxWidth: '120px',
        height: 'auto',
      }}
      />
    ),
  };

  export const scccLogo = {
    render: () => (
      <PSACoverCropCouncil
      src={'src/logo-displayer/assets/sccc_logo.png'}
      alt=""
      style={{
        maxWidth: '120px',
        height: 'auto',
      }}
      />
    ),
  };
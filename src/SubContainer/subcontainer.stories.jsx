import React from 'react';
import { PSASubContainer } from './subcontainer';

const meta = {
  title: 'Layout/SubContainer',
  component: PSASubContainer,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
  },
};

export default meta;

export const DefaultSubcontainer = {
  args: {
    title: 'Sub Container',
    content: <div style={{ padding: '20px', width: '120px' }}>Content</div>,
  },
};

export const SubcontainerWithDifferentContent = {
  args: {
    title: 'Sub Container',
    content: (
      <div
        style={{
          padding: '20px',
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            padding: '10px',
            border: '1px solid #ddd',
            borderRadius: '4px',
            marginBottom: '15px', // Add spacing between list items
          }}
        >
          <div
            style={{
              width: '120px',
              padding: '8px 12px',
              border: '1px solid #ddd',
              borderRadius: '4px',
              marginRight: '20px',
              fontSize: '1.1rem',
            }}
          >
            1.1
          </div>
          <span
            style={{
              fontSize: '1rem',
              color: '#333',
            }}
          >
            Default Seeding - 1000 sq ft
          </span>
        </div>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            padding: '10px',
            border: '1px solid #ddd',
            borderRadius: '4px',
            marginBottom: '15px', // Add spacing between list items
          }}
        >
          <div
            style={{
              width: '120px',
              padding: '8px 12px',
              border: '1px solid #ddd',
              borderRadius: '4px',
              marginRight: '20px',
              fontSize: '1.1rem',
            }}
          >
            2.1
          </div>
          <span
            style={{
              fontSize: '1rem',
              color: '#333',
            }}
          >
            Custom Seeding - 1500 sq ft
          </span>
        </div>
      </div>
    ),
  },
};

export const ErrorSubcontainer = {
  args: {
    title: 'Sub Container',
    error: true,
    content: <div style={{ padding: '20px', width: '120px' }}>Error Content</div>,
  },
};

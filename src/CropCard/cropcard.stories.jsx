import { Box, Typography } from '@mui/material';
import { PSACropCard } from './cropcard';

const meta = {
  title: 'Layout/CropCard',
  component: PSACropCard,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
  },
};

export default meta;

const sharedConeflowerArgs = {
  species: 'Pinnate prairie coneflower',
  scientific: 'Ratibida pinnata',
  cultivar: 'Sunglow',
  content: (
    <Box sx={{ width: '100%', boxSizing: 'border-box', fontSize: 12 }}>
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          minHeight: '32px',
          padding: '0 0.75rem',
          boxSizing: 'border-box',
        }}
      >
        <span>Type</span>
        <span style={{ textAlign: 'right' }}>Forb/wildflowers, Legumes</span>
      </Box>

      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          minHeight: '32px',
          background: '#F5F5F5',
          padding: '0 0.75rem',
          boxSizing: 'border-box',
        }}
      >
        <span>Duration</span>
        <span style={{ textAlign: 'right' }}>Perennial</span>
      </Box>

      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          minHeight: '32px',
          padding: '0 0.75rem',
          boxSizing: 'border-box',
        }}
      >
        <span>Nativity Status</span>
        <span style={{ textAlign: 'right' }}>Native</span>
      </Box>
    </Box>
  ),
  details: (
    <Typography>Everything you ever wanted to know about Pinnate prairie coneflower</Typography>
  ),
  thumbnail: 'https://plants.sc.egov.usda.gov/ImageLibrary/standard/rapi_004_shp.jpg',
  fullsize: 'https://plants.sc.egov.usda.gov/ImageLibrary/large/rapi_004_lhp.jpg',
  credits:
    '© Thomas G. Barnes. Barnes, T.G., and S.W. Francis. 2004, Wildflowers and ferns of Kentucky',
  creditsSimple: '© Thomas G. Barnes',
  // externalLink: 'https://plants.sc.egov.usda.gov/plant-profile/RAPI',
  externalLinkText: 'RAPI',
  externalLinkTitle: 'Open in USDA Plants',
  title: 'Pinnate prairie coneflower',
};

export const ConeflowerExample = {
  args: {
    ...sharedConeflowerArgs,
    onSelect: () => alert('Adding to list'),
  },
};

export const ConeflowerSelectedExample = {
  args: {
    ...sharedConeflowerArgs,
    selected: true,
    onRemove: () => alert('Removing from list'),
  },
};

const sharedAppalachianBlazingStarArgs = {
  species: 'Appalachian blazing star',
  scientific: 'Liatris squarrulosa',
  content: (
    <div style={{ padding: '0 0.5rem' }}>
      Forb/wildflowers
      <br />
      Perennial
      <br />
      Native
    </div>
  ),
  details: (
    <Typography>Everything you ever wanted to know about Appalachian blazing star</Typography>
  ),
  thumbnail: 'https://plants.sc.egov.usda.gov/ImageLibrary/standard/lisq2_001_svp.jpg',
  fullsize: 'https://plants.sc.egov.usda.gov/ImageLibrary/large/lisq2_001_lvp.jpg',
  credits:
    '© Thomas G. Barnes. Barnes, T.G., and S.W. Francis. 2004, Wildflowers and ferns of Kentucky',
  creditsSimple: '© Thomas G. Barnes',
  externalLink: 'https://plants.sc.egov.usda.gov/plant-profile/LISQ2',
  externalLinkText: 'LISQ2',
  externalLinkTitle: 'Open in USDA Plants',
  title: 'Appalachian blazing star',
  onSelect: () => alert('Adding to list'),
};

export const AppalachianBlazingStarPortraitExample = {
  args: {
    ...sharedAppalachianBlazingStarArgs,
    portrait: true,
  },
};

export const AppalachianBlazingStarWithoutPortraitExample = {
  args: {
    ...sharedAppalachianBlazingStarArgs,
  },
};

export const AppalachianBlazingStarInDetailsExample = {
  args: {
    ...sharedAppalachianBlazingStarArgs,
    inDetails: true,
  },
};

export const SelectorCropCardExample = {
  args: {
    species: 'Pinnate prairie coneflower',
    scientific: 'Ratibida pinnata',
    details: (
      <Typography>Everything you ever wanted to know about Pinnate prairie coneflower</Typography>
    ),
    thumbnail: 'https://plants.sc.egov.usda.gov/ImageLibrary/standard/rapi_004_shp.jpg',
    fullsize: 'https://plants.sc.egov.usda.gov/ImageLibrary/large/rapi_004_lhp.jpg',
    title: 'Pinnate prairie coneflower',
    onSelect: () => alert('Adding to list'),
  },
};

export const DefaultCropCard = {
  args: {},
};

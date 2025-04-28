import React from "react";
import { PSACropCard } from "./cropcard"; 
import { Typography } from "@mui/material";

const meta = {
  title: 'Layout/CropCard',
  component: PSACropCard,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
  },
};

export default meta;

export const DefaultCropCard = {
  args: {}
};

const sharedConeflowerArgs = {
  species: 'Pinnate prairie coneflower',
  scientific: 'Ratibida pinnata',
  cultivar: 'Sunglow',
  content: (
    <div>
      Forb/wildflowers, Legumes
      <br />
      Perennial
      <br />
      Native
    </div>
  ),
  details: <Typography>Everything you ever wanted to know about Pinnate prairie coneflower</Typography>,
  thumbnail: 'https://plants.sc.egov.usda.gov/ImageLibrary/standard/rapi_004_shp.jpg',
  fullsize: 'https://plants.sc.egov.usda.gov/ImageLibrary/large/rapi_004_lhp.jpg',
  credits: '© Thomas G. Barnes. Barnes, T.G., and S.W. Francis. 2004, Wildflowers and ferns of Kentucky',
  creditsSimple: '© Thomas G. Barnes',
  externalLink: 'https://plants.sc.egov.usda.gov/plant-profile/RAPI',
  externalLinkText: 'RAPI',
  externalLinkTitle: 'Open in USDA Plants',
  title: 'Pinnate prairie coneflower',
};

export const ConeflowerExample = { 
  args: {
    ...sharedConeflowerArgs,
    onSelect: () => alert('Adding to list'),
  }
};

export const ConeflowerSelectedExample = { 
  args: {
    ...sharedConeflowerArgs,
    selected: true,
    onRemove: () => alert('Removing from list'),
  }
};

const sharedAppalachianBlazingStarArgs = {
  species: 'Appalachian blazing star',
  scientific: 'Liatris squarrulosa',
  content: (
    <div>
      Forb/wildflowers
      <br />
      Perennial
      <br />
      Native
    </div>
  ),
  details: <Typography>Everything you ever wanted to know about Appalachian blazing star</Typography>,
  thumbnail: 'https://plants.sc.egov.usda.gov/ImageLibrary/standard/lisq2_001_svp.jpg',
  fullsize: 'https://plants.sc.egov.usda.gov/ImageLibrary/large/lisq2_001_lvp.jpg',
  credits: '© Thomas G. Barnes. Barnes, T.G., and S.W. Francis. 2004, Wildflowers and ferns of Kentucky',
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
    // no portrait
  },
};
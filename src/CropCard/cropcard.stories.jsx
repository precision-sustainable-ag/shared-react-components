import React from "react";
import { PSACropCard } from "./cropcard"; 

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

export const ConeflowerExample = { 
  args: {
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
    details: 'Everything you ever wanted to know about Pinnate prairie coneflower',
    thumbnail: 'https://plants.sc.egov.usda.gov/ImageLibrary/standard/rapi_004_shp.jpg',
    fullsize: 'https://plants.sc.egov.usda.gov/ImageLibrary/large/rapi_004_lhp.jpg',
    credits: '© Thomas G. Barnes. Barnes, T.G., and S.W. Francis. 2004, Wildflowers and ferns of Kentucky',
    creditsSimple: '© Thomas G. Barnes',
    externalLink: 'https://plants.sc.egov.usda.gov/plant-profile/RAPI',
    externalLinkText: 'RAPI',
    externalLinkTitle: 'Open in USDA Plants',
    select: () => alert('Adding to list'),
  },
};

export const ConeflowerSelectedExample = { 
  args: {
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
    details: 'Everything you ever wanted to know about Pinnate prairie coneflower',
    thumbnail: 'https://plants.sc.egov.usda.gov/ImageLibrary/standard/rapi_004_shp.jpg',
    fullsize: 'https://plants.sc.egov.usda.gov/ImageLibrary/large/rapi_004_lhp.jpg',
    credits: '© Thomas G. Barnes. Barnes, T.G., and S.W. Francis. 2004, Wildflowers and ferns of Kentucky',
    creditsSimple: '© Thomas G. Barnes',
    externalLink: 'https://plants.sc.egov.usda.gov/plant-profile/RAPI',
    externalLinkText: 'RAPI',
    externalLinkTitle: 'Open in USDA Plants',
    remove: () => alert('Removing from list'),
  },
};

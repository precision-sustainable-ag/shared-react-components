import React from "react";
import { PSATooltip } from "./tooltip"; 
import { Info } from '@mui/icons-material';
import { Button, styled } from '@mui/material';

const meta = {
  component: PSATooltip,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component: `This is a custom Tooltip component based on MUI's \`Tooltip\`. 
        It Inherits all [MUI Tooltip props](https://mui.com/material-ui/api/tooltip/) 
        and can be styled as needed.`,
      },
    },
  },
};

export const PlacementExample = () => (
  <>
  <div style={{ display: 'flex', justifyContent: 'space-around', padding: '50px', width:'300px' }}>

    <PSATooltip 
    title="Tooltip at the top" 
    placement="top" 
    tooltipContent={(<Button 
      variant="contained" 
      color="primary" 
    >
      Hover to see tooltip at top
    </Button>)}
    />

  </div>
 
  <div style={{ display: 'flex', justifyContent: 'space-around', padding: '50px' }}>
    
    <PSATooltip 
    title="Tooltip at the bottom" 
    placement="bottom" 
    tooltipContent={(<Button 
      variant="contained" 
      color="primary" 
    >
      Hover to see tooltip at Bottom
    </Button>)}
    />

  </div>
  </>
 
);

const dynamic_tooltip = "Dynamic Value";
export const TitlesExample = () => (
  <>
  <div style={{ display: 'flex', justifyContent: 'space-around', padding: '50px' }}>

    <PSATooltip 
    title={(
    <div>
      Text
    </div>
    )} 
    placement="top" 
    tooltipContent={(<button>Hover to see customized title</button>)}/>
    </div>

    <div style={{ display: 'flex', justifyContent: 'space-around', padding: '50px' }}>
    <PSATooltip 
    title={`${dynamic_tooltip} is title of dynamic tooltip`}
    placement="top" 
    tooltipContent={(<Button 
      variant="contained" 
      color="primary" 
    >
      Hover to see dynamic tooltip
    </Button>)}/>   
  </div>
  </>
);

const tooltipContent = () => (
  <div>
    <Button 
      variant="contained" 
      color="primary" 
    >
      Click Me
    </Button>
  </div>
);
export const TooltipContentExample = () => (
  <>
  <div style={{ display: 'flex', justifyContent: 'space-around', padding: '50px' }}>

    <PSATooltip 
    title={(
    <p>Tooltip Tile</p>
    )} 
    placement="top" 
    tooltipContent={tooltipContent()}/>
    </div>

  </>
);

export default meta;

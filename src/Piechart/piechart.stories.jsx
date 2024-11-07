import React from "react";
import { PSAPiechart } from "./piechart"; 


const defaultPieChartData = {
  seedingRateArray: [5],
  plantsPerSqftArray: [5],
  seedsPerSqftArray: [5],
};

const meta = {
  component: PSAPiechart,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
  },
};

export default meta;

export const DefaultPiechart = { 
  args: {
    chartData: [
      { name: 'Category A', value: 400 },
      { name: 'Category B', value: 300 },
      { name: 'Category C', value: 200 },
      { name: 'Category D', value: 100 },
    ],
    label: "Bar Chart",
  
  },
};